import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/shared/apis/api-client';

export const useGetOrder = (publicId: string) => {
	return useQuery({
		queryKey: ['admin-order-details', publicId],
		queryFn: async () => {
			const response = await apiClient.get(`/admin/orders/${publicId}`);
			return response.data.data as any;
		},
	});
};
