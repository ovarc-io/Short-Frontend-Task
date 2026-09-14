import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { apiClient } from '@/shared/apis/api-client';

export const useGetOrders = (params: { page: number; status?: number }) => {
	return useQuery({
		queryKey: ['admin-orders-list', { page: params.page, status: params.status }],
		queryFn: async () => {
			const response = await apiClient.get(
				`/admin/orders?${qs.stringify({ page: params.page, limit: 10, status: params.status })}`,
			);
			return response.data as any;
		},
	});
};
