import { AxiosRequestConfig } from 'axios';
import qs from 'qs';

import { ORDER_STATUS_MAP, OrderStatus } from '@/shared/types/order';

import { ORDERS, OrderRow } from './data';

/**
 * Fake backend. Mirrors the real API contract:
 *
 *   GET   /admin/orders?page&limit&search&status
 *   GET   /admin/orders/:public_id
 *   PATCH /admin/orders/:public_id/ship   body: { tracking_number: string, carrier: 'aramex' | 'bosta' | 'dhl' }
 *
 * Responses use the same envelope as production: lists return `{ data, _metadata }`,
 * single resources return `{ status, data }`, validation errors return 422 `{ message, errors }`.
 */

type MockResponse = { status: number; data: unknown };

const serialize = (row: OrderRow) => ({
	...row,
	status: ORDER_STATUS_MAP[row.status].option,
});

const latency = () => 150 + Math.random() * 750;

export const handle = (config: AxiosRequestConfig): Promise<MockResponse> => {
	const method = (config.method ?? 'get').toUpperCase();
	const [path, search] = (config.url ?? '').split('?');
	const query = qs.parse(search ?? '');
	const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});

	return new Promise(resolve => {
		setTimeout(() => resolve(route(method, path, query, body)), latency());
	});
};

const route = (method: string, path: string, query: qs.ParsedQs, body: Record<string, unknown>): MockResponse => {
	// GET /admin/orders
	if (method === 'GET' && path === '/admin/orders') {
		const page = Number(query.page ?? 1);
		const limit = Number(query.limit ?? 10);
		const search = String(query.search ?? '')
			.trim()
			.toLowerCase();
		const status = query.status ? Number(query.status) : undefined;

		const filtered = ORDERS.filter(o => {
			const matchesSearch = search === '' || o.customer_name.toLowerCase().includes(search) || o.public_id.includes(search);
			const matchesStatus = status === undefined || o.status === status;
			return matchesSearch && matchesStatus;
		}).sort((a, b) => b.created_at.localeCompare(a.created_at));

		const start = (page - 1) * limit;
		const pageRows = filtered.slice(start, start + limit);
		const totalRevenue = filtered.filter(o => o.status !== OrderStatus.Cancelled).reduce((sum, o) => sum + Number(o.total), 0);

		return {
			status: 200,
			data: {
				data: pageRows.map(serialize),
				_metadata: {
					page,
					page_size: limit,
					last_page: Math.max(1, Math.ceil(filtered.length / limit)),
					total_records: filtered.length,
					total_revenue: totalRevenue.toFixed(2),
					pending_count: filtered.filter(o => o.status === OrderStatus.Pending).length,
				},
			},
		};
	}

	// GET /admin/orders/:public_id
	const detailsMatch = path.match(/^\/admin\/orders\/([^/]+)$/);
	if (method === 'GET' && detailsMatch) {
		const order = ORDERS.find(o => o.public_id === detailsMatch[1]);
		if (!order) return { status: 404, data: { message: 'Order not found' } };
		return { status: 200, data: { status: 200, data: serialize(order) } };
	}

	// PATCH /admin/orders/:public_id/ship
	const shipMatch = path.match(/^\/admin\/orders\/([^/]+)\/ship$/);
	if (method === 'PATCH' && shipMatch) {
		const order = ORDERS.find(o => o.public_id === shipMatch[1]);
		if (!order) return { status: 404, data: { message: 'Order not found' } };
		if (order.status !== OrderStatus.Pending) {
			return { status: 409, data: { message: 'Only pending orders can be shipped' } };
		}

		const errors: Record<string, string[]> = {};
		if (typeof body.tracking_number !== 'string' || body.tracking_number.trim() === '') {
			errors.tracking_number = ['Tracking number is required'];
		}
		if (!['aramex', 'bosta', 'dhl'].includes(String(body.carrier))) {
			errors.carrier = ['Carrier must be one of: aramex, bosta, dhl'];
		}
		if (Object.keys(errors).length > 0) {
			return { status: 422, data: { message: 'Validation failed', errors } };
		}

		order.status = OrderStatus.Shipped;
		order.tracking_number = String(body.tracking_number);
		order.carrier = body.carrier as OrderRow['carrier'];
		return { status: 200, data: { status: 200, data: serialize(order) } };
	}

	return { status: 404, data: { message: `No route for ${method} ${path}` } };
};
