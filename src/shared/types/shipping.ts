import { BadgeTypes, Option } from './general';
import { Order } from './order';

// ============================================================================
// Enums
// ============================================================================

export enum OrderSize {
	Small = 'small',
	Medium = 'medium',
	Large = 'large',
}

// ============================================================================
// Types
// ============================================================================

/** An operator's explicit decision to ship an order in a given month, overriding the auto-plan. */
export type ShipmentPin = {
	order_id: number;
	month_key: string;
	pinned_at: string;
};

export type ShipmentAllocation = {
	order: Order;
	size: OrderSize;
	units: number;
};

export type PlannedShipment = ShipmentAllocation & {
	monthKey: string;
	/** The month this order was due in, when capacity there was full and it had to roll forward. */
	rolledFromMonthKey: string | null;
	/** Placed by hand rather than by the planner — pins are honoured even when the month overflows. */
	isPinned: boolean;
};

export type PlannedMonth = {
	monthKey: string;
	capacityUnits: number;
	usedUnits: number;
	/** Negative once pinned orders push the month past its capacity. */
	remainingUnits: number;
	isFull: boolean;
	isOverCapacity: boolean;
	pinnedCount: number;
	/** Units held by hand-placed orders. Only these can actually overbook a month. */
	pinnedUnits: number;
	shipments: PlannedShipment[];
};

export type ShippingPlan = {
	months: PlannedMonth[];
	/** Orders larger than any month in the horizon can hold — ops have to split or charter for these. */
	unschedulable: ShipmentAllocation[];
	totalUnits: number;
};

// ============================================================================
// Maps / Options
// ============================================================================

export const ORDER_SIZE_MAP: Record<OrderSize, { option: Option<OrderSize>; units: number; color: BadgeTypes }> = {
	[OrderSize.Small]: { option: { label: 'Small', value: OrderSize.Small }, units: 1, color: BadgeTypes.success },
	[OrderSize.Medium]: { option: { label: 'Medium', value: OrderSize.Medium }, units: 2, color: BadgeTypes.blue },
	[OrderSize.Large]: { option: { label: 'Large', value: OrderSize.Large }, units: 4, color: BadgeTypes.warning },
};

export const ORDER_SIZE_OPTIONS = Object.values(ORDER_SIZE_MAP).map(item => item.option);
