import { MutationOptions } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { ShipmentPin } from '@/shared/types/shipping';

import { eraseShipmentPin, writeShipmentPin } from './pins-storage';

export type PutShipmentPinPayload = {
	params: { order_id: number };
	body: { month_key: string };
};

export type DeleteShipmentPinPayload = {
	params: { order_id: number };
};

export const putShipmentPinOptions = (): MutationOptions<ShipmentPin, Error, PutShipmentPinPayload> => ({
	mutationFn: async ({ params, body }) =>
		writeShipmentPin({ order_id: params.order_id, month_key: body.month_key, pinned_at: dayjs().toISOString() }),
});

export const deleteShipmentPinOptions = (): MutationOptions<void, Error, DeleteShipmentPinPayload> => ({
	mutationFn: async ({ params }) => eraseShipmentPin(params.order_id),
});
