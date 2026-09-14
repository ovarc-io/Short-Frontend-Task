import { formatDate } from '@/utilities/date';
import { AlertTriangle, Pin01 } from '@untitledui/icons';
import { useNavigate } from 'react-router-dom';

import { DateFormatOptions } from '@/constants/dateFormats';

import { BadgeTypes } from '@/shared/types/general';
import { ORDER_SIZE_MAP, PlannedMonth, PlannedShipment } from '@/shared/types/shipping';

import { Badge } from '@/shared/ui/badge';
import { Button, ButtonSizes, ButtonVariants } from '@/shared/ui/button';
import { EmptyCard } from '@/shared/ui/empty-card';

import {
	BadgeGroup,
	NoteText,
	OverCapacityNote,
	OverCapacityText,
	Panel,
	PanelHeader,
	PanelMeta,
	PanelTitle,
	PrimaryText,
	RolloverNote,
	Row,
	RowActions,
	RowGroup,
	SecondaryText,
} from './styled';

type Props = {
	monthKey: string;
	month?: PlannedMonth;
	/** Orders that were due in this month but had to ship later because capacity ran out. */
	rolledOutShipments: PlannedShipment[];
	isPast: boolean;
	onPlace: (shipment: PlannedShipment) => void;
};

export const MonthShipments = ({ monthKey, month, rolledOutShipments, isPast, onPlace }: Props) => {
	const navigate = useNavigate();

	const monthLabel = formatDate(`${monthKey}-01`, DateFormatOptions.Month);
	const rolledOutUnits = rolledOutShipments.reduce((sum, shipment) => sum + shipment.units, 0);
	const overCapacityUnits = month ? Math.abs(Math.min(0, month.remainingUnits)) : 0;

	return (
		<Panel>
			<PanelHeader>
				<PanelTitle>{monthLabel}</PanelTitle>
				{month && !isPast && (
					<PanelMeta>
						{month.usedUnits} of {month.capacityUnits} units loaded · {month.shipments.length}{' '}
						{month.shipments.length === 1 ? 'order' : 'orders'} ·{' '}
						{month.isOverCapacity ? `${overCapacityUnits} units over` : `${month.remainingUnits} units free`}
						{month.pinnedCount > 0 && ` · ${month.pinnedCount} pinned`}
					</PanelMeta>
				)}
			</PanelHeader>

			{month?.isOverCapacity && (
				<OverCapacityNote>
					<AlertTriangle size={18} />
					<OverCapacityText>
						{overCapacityUnits} {overCapacityUnits === 1 ? 'unit' : 'units'} over capacity — pinned orders are being kept here.
						Book extra cargo or move one out.
					</OverCapacityText>
				</OverCapacityNote>
			)}

			{rolledOutShipments.length > 0 && (
				<RolloverNote>
					<AlertTriangle size={18} />
					<NoteText>
						{monthLabel} cargo is full — {rolledOutShipments.length} order{rolledOutShipments.length === 1 ? '' : 's'} (
						{rolledOutUnits} units) ship in a later month.
					</NoteText>
				</RolloverNote>
			)}

			{isPast && <EmptyCard title='Month closed' message='This month is in the past, so nothing is planned into it.' />}

			{!isPast && (!month || month.shipments.length === 0) && (
				<EmptyCard title='Nothing loaded yet' message='No pending orders are scheduled to ship in this month.' />
			)}

			{!isPast &&
				month?.shipments.map(shipment => (
					<Row key={shipment.order.id}>
						<RowGroup>
							<PrimaryText>#{shipment.order.id}</PrimaryText>
							<SecondaryText>{shipment.order.public_id}</SecondaryText>
						</RowGroup>

						<RowGroup>
							<PrimaryText>{shipment.order.customer_name}</PrimaryText>
							<SecondaryText>Placed {formatDate(shipment.order.created_at)}</SecondaryText>
						</RowGroup>

						<BadgeGroup>
							<Badge text={ORDER_SIZE_MAP[shipment.size].option.label} color={ORDER_SIZE_MAP[shipment.size].color} />
						</BadgeGroup>

						<BadgeGroup>
							<SecondaryText>
								{shipment.units} {shipment.units === 1 ? 'unit' : 'units'}
							</SecondaryText>
							{shipment.isPinned && <Badge text='Pinned' />}
							{shipment.rolledFromMonthKey && (
								<Badge
									text={`Rolled from ${formatDate(`${shipment.rolledFromMonthKey}-01`, DateFormatOptions.MonthShort)}`}
									color={BadgeTypes.warning}
								/>
							)}
						</BadgeGroup>

						<RowActions>
							<Button
								text={shipment.isPinned ? 'Move' : 'Place'}
								variant={ButtonVariants.secondary_gray}
								size={ButtonSizes.sm}
								iconLeading={<Pin01 size={14} />}
								onClick={() => onPlace(shipment)}
							/>
							<Button
								text='View order'
								variant={ButtonVariants.link}
								size={ButtonSizes.sm}
								onClick={() => navigate(`/orders/${shipment.order.public_id}`)}
							/>
						</RowActions>
					</Row>
				))}
		</Panel>
	);
};
