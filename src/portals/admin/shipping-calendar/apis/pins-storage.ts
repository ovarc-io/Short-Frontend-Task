import { ShipmentPin } from '@/shared/types/shipping';

import { shipmentPinsSchema } from '@/shared/schemas/shipping';

/**
 * Stands in for the pins endpoints until the backend has them:
 *
 *   GET    /admin/shipping-pins
 *   PUT    /admin/shipping-pins/:order_id   body: { month_key }
 *   DELETE /admin/shipping-pins/:order_id
 *
 * Same async shape as an HTTP call, so `queries.ts` / `mutations.ts` only swap the transport line.
 * Pins live per browser, which is the honest limit of this: they are not shared between operators.
 */
const STORAGE_KEY = 'admin.shipping-calendar.pins';

const read = (): ShipmentPin[] => {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];

		const parsed = shipmentPinsSchema.safeParse(JSON.parse(raw));
		return parsed.success ? parsed.data : [];
	} catch {
		// Private mode, blocked storage or hand-edited JSON: plan without pins rather than crash.
		return [];
	}
};

const write = (pins: ShipmentPin[]) => {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
	} catch {
		throw new Error('Could not save the pin in this browser.');
	}
};

export const readShipmentPins = async (): Promise<ShipmentPin[]> => read();

export const writeShipmentPin = async (pin: ShipmentPin): Promise<ShipmentPin> => {
	write([...read().filter(existing => existing.order_id !== pin.order_id), pin]);
	return pin;
};

export const eraseShipmentPin = async (orderId: number): Promise<void> => {
	write(read().filter(existing => existing.order_id !== orderId));
};
