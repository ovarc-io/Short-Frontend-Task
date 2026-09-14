import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/shared/apis/api-client';

type ShipOrderParams = {
	id: string;
	trackingNumber: string;
	carrier: string;
};

export const usePatchShipOrder = () => {
	return useMutation({
		mutationFn: async ({ id, trackingNumber, carrier }: ShipOrderParams) => {
			const response = await apiClient.patch(`/admin/orders/${id}/ship`, { trackingNumber, carrier });
			return response.data;
		},
	});
};
