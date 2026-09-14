import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/shared/apis/api-client';

type ShipOrderParams = {
	id: string;
	tracking_number: string;
	carrier: string;
};

export const usePatchShipOrder = () => {
	return useMutation({
		mutationFn: async ({ id, tracking_number, carrier }: ShipOrderParams) => {
			const response = await apiClient.patch(`/admin/orders/${id}/ship`, { tracking_number, carrier });
			return response.data;
		},
	});
};
