import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { ADMIN_QUERY_KEYS } from '@/constants/query-keys';

import { GetListResponse } from '@/shared/types/general';
import { Order, OrderStatus, OrdersListMetaData } from '@/shared/types/order';

import { apiClient } from '@/shared/apis/api-client';

import { readShipmentPins } from './pins-storage';

const PLANNING_PAGE_SIZE = 100;
/** Safety net so a bad `last_page` can't spin the loop forever. */
const MAX_PLANNING_PAGES = 20;

/**
 * The calendar plans over every pending order, not one page of them, so this walks the paginated
 * list endpoint until it runs out. Keyed under the orders list so invalidating orders refreshes
 * the calendar too.
 */
export const getPendingOrdersForPlanningOptions = () =>
	queryOptions({
		queryKey: [ADMIN_QUERY_KEYS.ORDERS.ORDERS_LIST, ADMIN_QUERY_KEYS.SHIPPING_CALENDAR.PLANNING_SCOPE],
		queryFn: async () => {
			const orders: Order[] = [];
			let page = 1;
			let lastPage = 1;

			do {
				const queries = { page, limit: PLANNING_PAGE_SIZE, status: OrderStatus.Pending };
				const response = await apiClient.get<GetListResponse<Order, OrdersListMetaData>>(
					`/admin/orders?${qs.stringify(queries)}`,
				);
				orders.push(...response.data.data);
				lastPage = response.data._metadata.last_page;
				page += 1;
			} while (page <= lastPage && page <= MAX_PLANNING_PAGES);

			return orders;
		},
	});

export const getShipmentPinsOptions = () =>
	queryOptions({
		queryKey: [ADMIN_QUERY_KEYS.SHIPPING_CALENDAR.SHIPMENT_PINS],
		queryFn: readShipmentPins,
	});
