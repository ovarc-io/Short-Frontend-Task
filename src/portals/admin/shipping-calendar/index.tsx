import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight } from '@untitledui/icons';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ORDER_SIZE_MAP, PlannedShipment } from '@/shared/types/shipping';

import { getPendingOrdersForPlanningOptions, getShipmentPinsOptions } from './apis/queries';

import { Badge } from '@/shared/ui/badge';
import { Button, ButtonSizes, ButtonVariants } from '@/shared/ui/button';
import { EmptyCard, ErrorCard } from '@/shared/ui/empty-card';
import { Skeleton } from '@/shared/ui/skeleton';

import { MonthCard } from './components/month-card';
import { MonthShipments } from './components/month-shipments';
import { PinShipmentModal } from './components/pin-shipment-modal';
import {
	currentMonthKey,
	findPlannedMonth,
	findShipment,
	monthKeysOfYear,
	planShipments,
	shipmentsRolledOutOf,
} from './shipping-plan';
import {
	Card,
	Grid,
	Header,
	Legend,
	LegendLabel,
	Page,
	Subtitle,
	Title,
	Toolbar,
	WarningCard,
	WarningItem,
	WarningTitle,
	YearLabel,
	YearNav,
} from './styled';

const MONTHS_IN_YEAR = 12;

const yearOf = (monthKey: string) => Number(monthKey.slice(0, 4));

const ShippingCalendar = () => {
	const navigate = useNavigate();

	const fromMonthKey = useMemo(() => currentMonthKey(), []);
	const [year, setYear] = useState(() => yearOf(fromMonthKey));
	const [selectedMonthKey, setSelectedMonthKey] = useState(fromMonthKey);
	const [placingOrderId, setPlacingOrderId] = useState<number | null>(null);

	const { data: orders, isLoading, isError, refetch } = useQuery(getPendingOrdersForPlanningOptions());
	const { data: pins } = useQuery(getShipmentPinsOptions());

	const plan = useMemo(
		() => planShipments({ orders: orders ?? [], pins: pins ?? [], fromMonthKey }),
		[orders, pins, fromMonthKey],
	);

	const monthKeys = useMemo(() => monthKeysOfYear(year), [year]);
	const selectedMonth = findPlannedMonth(plan, selectedMonthKey);
	const rolledOutShipments = shipmentsRolledOutOf(plan, selectedMonthKey);

	const firstYear = yearOf(fromMonthKey);
	const lastYear = yearOf(plan.months[plan.months.length - 1].monthKey);

	// Re-read from the plan rather than holding a snapshot, so the modal follows a re-plan.
	const placingShipment = placingOrderId === null ? undefined : findShipment(plan, placingOrderId);

	const handlePlaced = (monthKey: string) => {
		setYear(yearOf(monthKey));
		setSelectedMonthKey(monthKey);
	};

	const handleYearChange = (offset: number) => {
		const nextYear = year + offset;
		const firstPlanned = plan.months.find(month => yearOf(month.monthKey) === nextYear && month.shipments.length > 0);

		setYear(nextYear);
		setSelectedMonthKey(firstPlanned?.monthKey ?? monthKeysOfYear(nextYear)[0]);
	};

	return (
		<Page>
			<Button
				text='Back to orders'
				variant={ButtonVariants.link}
				size={ButtonSizes.sm}
				iconLeading={<ArrowLeft size={16} />}
				onClick={() => navigate('/orders')}
			/>

			<Header>
				<Title>Shipping calendar</Title>
				<Subtitle>
					Pending orders take cargo space by size. When a month fills up, the rest roll into the first month that still has room —
					this is where they will actually ship.
				</Subtitle>
			</Header>

			<Toolbar>
				<YearNav>
					<Button
						text=''
						aria-label='Previous year'
						variant={ButtonVariants.secondary_gray}
						size={ButtonSizes.sm}
						iconLeading={<ChevronLeft size={16} />}
						disabled={year <= firstYear}
						onClick={() => handleYearChange(-1)}
					/>
					<YearLabel>{year}</YearLabel>
					<Button
						text=''
						aria-label='Next year'
						variant={ButtonVariants.secondary_gray}
						size={ButtonSizes.sm}
						iconLeading={<ChevronRight size={16} />}
						disabled={year >= lastYear}
						onClick={() => handleYearChange(1)}
					/>
				</YearNav>

				<Legend>
					<LegendLabel>Cargo cost</LegendLabel>
					{Object.values(ORDER_SIZE_MAP).map(({ option, units, color }) => (
						<Badge key={option.value} text={`${option.label} · ${units} ${units === 1 ? 'unit' : 'units'}`} color={color} />
					))}
				</Legend>
			</Toolbar>

			{isLoading && (
				<>
					<Grid>
						{Array.from({ length: MONTHS_IN_YEAR }).map((_, index) => (
							<Skeleton key={index} $height='7rem' />
						))}
					</Grid>
					<Skeleton $height='12rem' />
				</>
			)}

			{isError && (
				<Card>
					<ErrorCard title='Shipping calendar' tryAgain={refetch} />
				</Card>
			)}

			{!isLoading && !isError && orders?.length === 0 && (
				<Card>
					<EmptyCard title='Nothing to plan' message='There are no pending orders waiting for cargo space.' />
				</Card>
			)}

			{!isLoading && !isError && !!orders?.length && (
				<>
					<LegendLabel>
						{orders.length} pending orders · {plan.totalUnits} units of cargo to load
					</LegendLabel>

					<Grid>
						{monthKeys.map(monthKey => (
							<MonthCard
								key={monthKey}
								monthKey={monthKey}
								month={findPlannedMonth(plan, monthKey)}
								isSelected={monthKey === selectedMonthKey}
								isPast={monthKey < fromMonthKey}
								onSelect={setSelectedMonthKey}
							/>
						))}
					</Grid>

					{plan.unschedulable.length > 0 && (
						<WarningCard>
							<WarningTitle>
								<AlertTriangle size={18} />
								{plan.unschedulable.length} orders do not fit in any month
							</WarningTitle>
							{plan.unschedulable.map(({ order, units }) => (
								<WarningItem key={order.id}>
									Order #{order.id} needs {units} {units === 1 ? 'unit' : 'units'} — more than any month in the plan has. Split it
									or book extra cargo.
								</WarningItem>
							))}
						</WarningCard>
					)}

					<MonthShipments
						monthKey={selectedMonthKey}
						month={selectedMonth}
						rolledOutShipments={rolledOutShipments}
						isPast={selectedMonthKey < fromMonthKey}
						onPlace={(shipment: PlannedShipment) => setPlacingOrderId(shipment.order.id)}
					/>
				</>
			)}
			{placingShipment && (
				<PinShipmentModal
					shipment={placingShipment}
					plan={plan}
					onPlaced={handlePlaced}
					onClose={() => setPlacingOrderId(null)}
				/>
			)}
		</Page>
	);
};

export default ShippingCalendar;
