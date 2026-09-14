import { SnackbarTypes, useSnackbar } from '@/shared/contexts/snackbar';
import { formatDate } from '@/utilities/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from '@untitledui/icons';
import { Controller, useForm } from 'react-hook-form';

import { DateFormatOptions } from '@/constants/dateFormats';
import { ADMIN_QUERY_KEYS } from '@/constants/query-keys';

import { PlannedMonth, PlannedShipment, ShippingPlan } from '@/shared/types/shipping';

import { PinShipmentFormData, pinShipmentSchema } from '@/shared/schemas/shipping';

import { deleteShipmentPinOptions, putShipmentPinOptions } from '../../apis/mutations';

import { Button, ButtonVariants } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { ModalContainer, ModalFlexContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '@/shared/ui/modal/styled';

import { Field, Hint, Label, Select, WarningHint } from './styled';

/** One year of choices is as far ahead as anyone plans a manifest by hand. */
const SELECTABLE_MONTHS = 12;

const AUTO_VALUE = '';

type Props = {
	shipment: PlannedShipment;
	plan: ShippingPlan;
	onPlaced: (monthKey: string) => void;
	onClose: () => void;
};

export const PinShipmentModal = ({ shipment, plan, onPlaced, onClose }: Props) => {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();

	const { mutateAsync: pinShipment, isPending: isPinning } = useMutation(putShipmentPinOptions());
	const { mutateAsync: unpinShipment, isPending: isUnpinning } = useMutation(deleteShipmentPinOptions());

	const { control, handleSubmit, watch } = useForm<PinShipmentFormData>({
		resolver: zodResolver(pinShipmentSchema),
		defaultValues: { month_key: shipment.isPinned ? shipment.monthKey : AUTO_VALUE },
	});

	// Months this order could ship in: never before the one it is currently planned into minus its
	// own roll-over, so the list starts at the earliest month the planner considered for it.
	const earliestMonthKey = shipment.rolledFromMonthKey ?? shipment.monthKey;
	const selectableMonths = plan.months.filter(month => month.monthKey >= earliestMonthKey).slice(0, SELECTABLE_MONTHS);

	/** This order's own space comes back if it moves out of the month it currently sits in. */
	const freeUnitsWithout = (monthKey: string, remainingUnits: number) =>
		monthKey === shipment.monthKey ? remainingUnits + shipment.units : remainingUnits;

	/**
	 * What the month looks like right now, not what it would look like once this order left it —
	 * a full month reads as full, even when this order is the one filling it.
	 */
	const describeCapacity = (month: PlannedMonth) => {
		if (month.monthKey === shipment.monthKey) return shipment.isPinned ? 'pinned here now' : 'planned here now';
		if (month.remainingUnits < 0) return `${Math.abs(month.remainingUnits)} units over capacity`;
		if (month.remainingUnits === 0) return 'full';
		return `${month.remainingUnits} ${month.remainingUnits === 1 ? 'unit' : 'units'} free`;
	};

	const selectedMonthKey = watch('month_key');
	const selectedMonth = plan.months.find(month => month.monthKey === selectedMonthKey);
	// A full month is not a blocker: the planner moves its automatic orders out to make room.
	// Only other pinned orders can genuinely push a month past its capacity.
	const otherPinnedUnits = selectedMonth
		? selectedMonth.pinnedUnits - (shipment.isPinned && shipment.monthKey === selectedMonth.monthKey ? shipment.units : 0)
		: 0;
	const overflowUnits = selectedMonth ? otherPinnedUnits + shipment.units - selectedMonth.capacityUnits : 0;
	const displacedUnits =
		selectedMonth && overflowUnits <= 0
			? shipment.units - freeUnitsWithout(selectedMonth.monthKey, selectedMonth.remainingUnits)
			: 0;

	const onSubmit = async ({ month_key }: PinShipmentFormData) => {
		if (month_key === AUTO_VALUE && !shipment.isPinned) {
			onClose();
			return;
		}

		try {
			if (month_key === AUTO_VALUE) {
				await unpinShipment({ params: { order_id: shipment.order.id } });
				showSnackbar({ type: SnackbarTypes.SUCCESS, title: 'Back to automatic planning' });
			} else {
				await pinShipment({ params: { order_id: shipment.order.id }, body: { month_key } });
				showSnackbar({
					type: SnackbarTypes.SUCCESS,
					title: `Order #${shipment.order.id} pinned`,
					description: `Now shipping in ${formatDate(`${month_key}-01`, DateFormatOptions.Month)}.`,
				});
			}

			await queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.SHIPPING_CALENDAR.SHIPMENT_PINS] });
			if (month_key !== AUTO_VALUE) onPlaced(month_key);
			onClose();
		} catch (error) {
			showSnackbar({
				type: SnackbarTypes.ERROR,
				title: 'Could not update the plan',
				description: error instanceof Error ? error.message : undefined,
			});
		}
	};

	return (
		<Modal onClose={onClose}>
			<ModalContainer>
				<ModalHeader>
					<div>
						<ModalTitle>Place order #{shipment.order.id}</ModalTitle>
						<ModalSubtitle>
							{shipment.order.customer_name} · {shipment.units} {shipment.units === 1 ? 'unit' : 'units'} of cargo
						</ModalSubtitle>
					</div>
				</ModalHeader>

				<ModalFlexContent>
					<Controller
						name='month_key'
						control={control}
						render={({ field }) => (
							<Field>
								<Label>Ship in</Label>
								<Select value={field.value} onChange={event => field.onChange(event.target.value)}>
									<option value={AUTO_VALUE}>Automatic — first month with room</option>
									{selectableMonths.map(month => (
										<option key={month.monthKey} value={month.monthKey}>
											{formatDate(`${month.monthKey}-01`, DateFormatOptions.Month)} — {describeCapacity(month)}
										</option>
									))}
								</Select>
							</Field>
						)}
					/>

					{overflowUnits > 0 && (
						<WarningHint>
							<AlertTriangle size={16} />
							Pinned orders alone would put {formatDate(`${selectedMonthKey}-01`, DateFormatOptions.MonthShort)} {overflowUnits}{' '}
							{overflowUnits === 1 ? 'unit' : 'units'} over capacity. The pin is kept — book extra cargo or move another pinned
							order out.
						</WarningHint>
					)}

					{overflowUnits <= 0 && displacedUnits > 0 && (
						<Hint>
							{formatDate(`${selectedMonthKey}-01`, DateFormatOptions.Month)} is full, so the planner will push {displacedUnits}{' '}
							{displacedUnits === 1 ? 'unit' : 'units'} of automatic orders into a later month to make room for this one.
						</Hint>
					)}

					{overflowUnits <= 0 && displacedUnits <= 0 && (
						<Hint>A pinned order stays in its month even when the planner would move it. Pick automatic to hand it back.</Hint>
					)}
				</ModalFlexContent>

				<ModalFooter>
					<Button text='Cancel' variant={ButtonVariants.secondary_gray} onClick={onClose} />
					<Button text='Save placement' loading={isPinning || isUnpinning} onClick={handleSubmit(onSubmit)} />
				</ModalFooter>
			</ModalContainer>
		</Modal>
	);
};
