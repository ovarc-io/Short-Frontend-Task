import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { usePatchShipOrder } from '../apis/mutations';

import { Button, ButtonVariants } from '@/shared/ui/button';
import { InputField } from '@/shared/ui/input-field';
import { Modal } from '@/shared/ui/modal';
import { ModalContainer, ModalFlexContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '@/shared/ui/modal/styled';

const schema = z.object({
	trackingNumber: z.string().min(1, 'Tracking number is required'),
	carrier: z.string(),
});

type FormData = z.infer<typeof schema>;

export const ShipOrderModal = (props: any) => {
	const { mutate: shipOrder, isPending } = usePatchShipOrder();

	const { control, handleSubmit } = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { trackingNumber: '', carrier: 'bosta' },
		mode: 'onChange',
	});

	const onSubmit = async (data: FormData) => {
		if (!data.trackingNumber) return;
		try {
			shipOrder({ id: props.order.public_id, trackingNumber: data.trackingNumber, carrier: data.carrier });
		} catch (e) {
			console.log(e);
		}
		props.onShipped(props.order.id);
		props.onClose();
	};

	if (!props.isOpen) return null;

	return (
		<Modal onClose={props.onClose}>
			<ModalContainer>
				<ModalHeader>
					<div>
						<ModalTitle>Ship order #{props.order.id}</ModalTitle>
						<ModalSubtitle>{props.order.customer_name}</ModalSubtitle>
					</div>
				</ModalHeader>
				<ModalFlexContent>
					<Controller
						name='trackingNumber'
						control={control}
						render={({ field, fieldState }) => (
							<InputField
								label='Tracking number'
								required
								placeholder='e.g. TRK123456'
								value={field.value ?? ''}
								onChange={field.onChange}
								error={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						name='carrier'
						control={control}
						render={({ field }) => (
							<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								<label style={{ fontSize: 14, fontWeight: 500, color: '#344054' }}>Carrier</label>
								<select
									value={field.value}
									onChange={e => field.onChange(e.target.value)}
									style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #D0D5DD', fontSize: 14 }}
								>
									<option value='aramex'>Aramex</option>
									<option value='bosta'>Bosta</option>
									<option value='dhl'>DHL</option>
								</select>
							</div>
						)}
					/>
				</ModalFlexContent>
				<ModalFooter>
					<Button text='Cancel' variant={ButtonVariants.secondary_gray} onClick={props.onClose} />
					<Button text='Confirm shipment' loading={isPending} onClick={handleSubmit(onSubmit)} />
				</ModalFooter>
			</ModalContainer>
		</Modal>
	);
};
