import { formatDate } from '@/utilities/date';

import { DateFormatOptions } from '@/constants/dateFormats';

import { BadgeTypes } from '@/shared/types/general';
import { PlannedMonth } from '@/shared/types/shipping';

import { Badge } from '@/shared/ui/badge';

import { capacityUnitsForMonth, countRolledInto } from '../../shipping-plan';
import { CapacityFill, CapacityLevel, CapacityTrack, Cell, Footer, Header, Meta, MonthName } from './styled';

const TIGHT_UTILIZATION_PERCENTAGE = 70;

type Props = {
	monthKey: string;
	month?: PlannedMonth;
	isSelected: boolean;
	isPast: boolean;
	onSelect: (monthKey: string) => void;
};

const resolveLevel = (percentage: number, isPast: boolean, isOverCapacity: boolean) => {
	if (isPast) return CapacityLevel.Closed;
	if (isOverCapacity) return CapacityLevel.Over;
	if (percentage >= 100) return CapacityLevel.Full;
	if (percentage >= TIGHT_UTILIZATION_PERCENTAGE) return CapacityLevel.Tight;
	return CapacityLevel.Healthy;
};

export const MonthCard = ({ monthKey, month, isSelected, isPast, onSelect }: Props) => {
	const capacityUnits = month?.capacityUnits ?? capacityUnitsForMonth(monthKey);
	const usedUnits = month?.usedUnits ?? 0;
	const percentage = capacityUnits === 0 ? 100 : Math.min(100, Math.round((usedUnits / capacityUnits) * 100));
	const rolledInCount = month ? countRolledInto(month) : 0;
	const orderCount = month?.shipments.length ?? 0;

	return (
		<Cell type='button' $isSelected={isSelected} aria-pressed={isSelected} disabled={isPast} onClick={() => onSelect(monthKey)}>
			<Header>
				<MonthName>{formatDate(`${monthKey}-01`, DateFormatOptions.MonthShort)}</MonthName>
				{isPast ? (
					<Badge text='Closed' />
				) : (
					month?.isFull && (
						<Badge
							text={month.isOverCapacity ? 'Over capacity' : 'Cargo full'}
							color={month.isOverCapacity ? BadgeTypes.error : BadgeTypes.blue}
						/>
					)
				)}
			</Header>

			<CapacityTrack>
				<CapacityFill $percentage={isPast ? 0 : percentage} $level={resolveLevel(percentage, isPast, !!month?.isOverCapacity)} />
			</CapacityTrack>

			<Meta>{isPast ? 'Not open for planning' : `${usedUnits} of ${capacityUnits} units`}</Meta>

			<Footer>
				{!isPast && (
					<Meta>
						{orderCount} {orderCount === 1 ? 'order' : 'orders'}
					</Meta>
				)}
				{!isPast && !!month?.pinnedCount && <Badge text={`${month.pinnedCount} pinned`} />}
				{rolledInCount > 0 && <Badge text={`+${rolledInCount} rolled in`} color={BadgeTypes.warning} />}
			</Footer>
		</Cell>
	);
};
