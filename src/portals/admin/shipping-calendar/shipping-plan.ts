import dayjs from 'dayjs';

import { DateFormatOptions } from '@/constants/dateFormats';
import { DEFAULT_MONTHLY_CAPACITY_UNITS, MONTHLY_CAPACITY_UNITS } from '@/constants/shipping-capacity';

import { Order } from '@/shared/types/order';
import {
	ORDER_SIZE_MAP,
	OrderSize,
	PlannedMonth,
	PlannedShipment,
	ShipmentAllocation,
	ShipmentPin,
	ShippingPlan,
} from '@/shared/types/shipping';

/** How far ahead we allocate. Anything that doesn't fit in two years is a business problem, not a UI one. */
export const PLANNING_HORIZON_MONTHS = 24;

const MEDIUM_MIN_ITEMS = 3;
const LARGE_MIN_ITEMS = 5;

export const currentMonthKey = () => dayjs().format(DateFormatOptions.MonthKey);

export const toMonthKey = (date: string) => dayjs(date).format(DateFormatOptions.MonthKey);

export const shiftMonthKey = (monthKey: string, months: number) =>
	dayjs(`${monthKey}-01`).add(months, 'month').format(DateFormatOptions.MonthKey);

export const monthKeysOfYear = (year: number) =>
	Array.from({ length: 12 }, (_, index) => dayjs().year(year).month(index).format(DateFormatOptions.MonthKey));

export const capacityUnitsForMonth = (monthKey: string) => MONTHLY_CAPACITY_UNITS[monthKey] ?? DEFAULT_MONTHLY_CAPACITY_UNITS;

/**
 * Size drives how much cargo space an order takes. `items_count` is the only size signal the API
 * gives us today; swap this for a real volume/weight field when the backend exposes one.
 */
export const deriveOrderSize = (itemsCount: number): OrderSize => {
	if (itemsCount >= LARGE_MIN_ITEMS) return OrderSize.Large;
	if (itemsCount >= MEDIUM_MIN_ITEMS) return OrderSize.Medium;
	return OrderSize.Small;
};

type PlanInput = {
	orders: Order[];
	/** First month we can still load cargo into — the current month in the app, injected so this stays pure. */
	fromMonthKey: string;
	/** Hand-placed orders. A pin for an unknown order, a past month or a month outside the horizon is ignored. */
	pins?: ShipmentPin[];
	horizonMonths?: number;
};

/**
 * Allocates pending orders to shipping months.
 *
 * Pinned orders are placed first, into the month ops chose, even when that pushes the month past
 * its capacity — an explicit instruction is never silently dropped, the month is reported as over
 * capacity instead. Everything else then goes oldest-first into the first month from its due month
 * onwards that still has room. When a month runs out of capacity the order rolls forward and is
 * reported against the month it was pushed out of, so the calendar can say *why* it ships later
 * than expected. Smaller orders may still fill the gap a rolled-over order left behind: that keeps
 * cargo full at the cost of strict FIFO, which is the trade-off ops make on real manifests.
 */
export const planShipments = ({
	orders,
	fromMonthKey,
	pins = [],
	horizonMonths = PLANNING_HORIZON_MONTHS,
}: PlanInput): ShippingPlan => {
	const months: PlannedMonth[] = Array.from({ length: horizonMonths }, (_, offset) => {
		const monthKey = shiftMonthKey(fromMonthKey, offset);
		const capacityUnits = capacityUnitsForMonth(monthKey);
		return {
			monthKey,
			capacityUnits,
			usedUnits: 0,
			remainingUnits: capacityUnits,
			isFull: capacityUnits === 0,
			isOverCapacity: false,
			pinnedCount: 0,
			pinnedUnits: 0,
			shipments: [],
		};
	});

	const unschedulable: ShipmentAllocation[] = [];
	let totalUnits = 0;

	const load = (month: PlannedMonth, shipment: PlannedShipment) => {
		month.usedUnits += shipment.units;
		month.remainingUnits = month.capacityUnits - month.usedUnits;
		month.isFull = month.remainingUnits <= 0;
		month.isOverCapacity = month.remainingUnits < 0;
		month.pinnedCount += shipment.isPinned ? 1 : 0;
		month.pinnedUnits += shipment.isPinned ? shipment.units : 0;
		month.shipments.push(shipment);
	};

	// Oldest order ships first; `id` only breaks ties so the plan is stable between renders.
	const queue = [...orders]
		.sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id - b.id)
		.map(order => {
			const size = deriveOrderSize(order.items_count);
			const { units } = ORDER_SIZE_MAP[size];
			totalUnits += units;

			// An order can't ship before the month it was placed in, nor before the month we plan from.
			const orderMonthKey = toMonthKey(order.created_at);
			return { order, size, units, dueMonthKey: orderMonthKey > fromMonthKey ? orderMonthKey : fromMonthKey };
		});

	const pinnedMonthByOrderId = new Map(pins.map(pin => [pin.order_id, pin.month_key]));
	const placedOrderIds = new Set<number>();

	queue.forEach(({ order, size, units, dueMonthKey }) => {
		const pinnedMonthKey = pinnedMonthByOrderId.get(order.id);
		if (!pinnedMonthKey) return;

		const target = months.find(month => month.monthKey === pinnedMonthKey && month.monthKey >= dueMonthKey);
		if (!target) return;

		load(target, { order, size, units, monthKey: target.monthKey, rolledFromMonthKey: null, isPinned: true });
		placedOrderIds.add(order.id);
	});

	queue.forEach(({ order, size, units, dueMonthKey }) => {
		if (placedOrderIds.has(order.id)) return;

		const target = months.find(month => month.monthKey >= dueMonthKey && month.remainingUnits >= units);

		if (!target) {
			unschedulable.push({ order, size, units });
			return;
		}

		load(target, {
			order,
			size,
			units,
			monthKey: target.monthKey,
			rolledFromMonthKey: target.monthKey === dueMonthKey ? null : dueMonthKey,
			isPinned: false,
		});
	});

	// Pins are placed before the rest, so restore reading order within each month.
	months.forEach(month =>
		month.shipments.sort((a, b) => a.order.created_at.localeCompare(b.order.created_at) || a.order.id - b.order.id),
	);

	return { months, unschedulable, totalUnits };
};

export const findPlannedMonth = (plan: ShippingPlan, monthKey: string) => plan.months.find(month => month.monthKey === monthKey);

export const countRolledInto = (month: PlannedMonth) => month.shipments.filter(shipment => shipment.rolledFromMonthKey).length;

export const shipmentsRolledOutOf = (plan: ShippingPlan, monthKey: string): PlannedShipment[] =>
	plan.months.flatMap(month => month.shipments.filter(shipment => shipment.rolledFromMonthKey === monthKey));

export const findShipment = (plan: ShippingPlan, orderId: number): PlannedShipment | undefined => {
	for (const month of plan.months) {
		const shipment = month.shipments.find(candidate => candidate.order.id === orderId);
		if (shipment) return shipment;
	}
	return undefined;
};
