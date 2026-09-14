import { z } from 'zod';

export const shipmentPinSchema = z.object({
	order_id: z.number(),
	month_key: z.string().regex(/^\d{4}-\d{2}$/),
	pinned_at: z.string(),
});

export const shipmentPinsSchema = z.array(shipmentPinSchema);

export const pinShipmentSchema = z.object({
	/** Empty string means "unpin and let the planner decide". */
	month_key: z.string(),
});

export type PinShipmentFormData = z.infer<typeof pinShipmentSchema>;
