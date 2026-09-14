import { Calendar } from '@untitledui/icons';
import qs from 'qs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetOrders } from './apis/queries';
import { apiClient } from '@/shared/apis/api-client';

import { Badge } from '@/shared/ui/badge';
import { Button, ButtonVariants } from '@/shared/ui/button';
import { Tabs } from '@/shared/ui/tabs';

import { OrderStats } from './components/order-stats';
import { ShipOrderModal } from './components/ship-order-modal';

const TABS = [
	{ label: 'All', value: undefined },
	{ label: 'Pending', value: 10 },
	{ label: 'Shipped', value: 20 },
	{ label: 'Delivered', value: 30 },
	{ label: 'Cancelled', value: 40 },
];

const getStatusColor = (status: number) => {
	if (status === 10) return 'warning';
	if (status === 20) return 'blue';
	if (status === 30) return 'success';
	if (status === 40) return 'error';
	return 'gray';
};

const Orders = () => {
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<number | undefined>(undefined);
	const [search, setSearch] = useState('');
	const [orders, setOrders] = useState<any[]>([]);
	const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
	const [isShipModalOpen, setIsShipModalOpen] = useState(false);
	const navigate = useNavigate();

	const { data, isLoading, isError } = useGetOrders({ page, status });

	useEffect(() => {
		if (data) {
			setOrders(data.data);
		}
	}, [data]);

	useEffect(() => {
		if (!search) {
			if (data) setOrders(data.data);
			return;
		}
		apiClient.get(`/admin/orders?${qs.stringify({ page: 1, limit: 10, status, search })}`).then(response => {
			setOrders(response.data.data);
		});
	}, [search]);

	useEffect(() => {
		if (!isShipModalOpen) {
			setSelectedOrderId(null);
		}
	}, [isShipModalOpen]);

	const handleTabChange = useCallback((value: number | undefined) => {
		setStatus(value);
		setPage(1);
	}, []);

	const handleOpenShipModal = useCallback((id: number) => {
		setSelectedOrderId(id);
		setIsShipModalOpen(true);
	}, []);

	const handleShipped = useCallback(
		(id: number) => {
			setOrders(orders.map(o => (o.id === id ? { ...o, status: { label: 'Shipped', value: 20 } } : o)));
		},
		[orders],
	);

	const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId), [orders, selectedOrderId]);

	const columns = useMemo(
		() => [
			{ label: '#', render: (o: any) => o.id },
			{ label: 'Customer', render: (o: any) => o.customer_name },
			{ label: 'Status', render: (o: any) => <Badge text={o.status.label} color={getStatusColor(o.status.value) as any} /> },
			{ label: 'Items', render: (o: any) => o.items_count },
			{ label: 'Total', render: (o: any) => `EGP ${o.total}` },
			{ label: 'Tracking', render: (o: any) => o.tracking_number || '--' },
			{ label: 'Date', render: (o: any) => new Date(o.created_at).toLocaleDateString() },
			{
				label: '',
				render: (o: any) =>
					o.status.value === 10 ? (
						<button
							style={{
								padding: '4px 10px',
								fontSize: 12,
								border: '1px solid #D0D5DD',
								borderRadius: 6,
								background: 'white',
								cursor: 'pointer',
							}}
							onClick={e => {
								e.stopPropagation();
								handleOpenShipModal(o.id);
							}}
						>
							Mark shipped
						</button>
					) : null,
			},
		],
		[handleOpenShipModal],
	);

	if (isLoading) {
		return <p style={{ padding: 32 }}>Loading...</p>;
	}

	if (isError) {
		return null;
	}

	return (
		<div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<div>
					<h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#101828' }}>Orders</h1>
					<p style={{ margin: '4px 0 0', fontSize: 14, color: '#475467' }}>Manage and fulfil customer orders.</p>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<input
						placeholder='Search customer or order id'
						value={search}
						onChange={e => setSearch(e.target.value)}
						style={{ padding: '8px 12px', width: 260, border: '1px solid #D0D5DD', borderRadius: 8, fontSize: 14 }}
					/>
					<Button
						text='Shipping calendar'
						variant={ButtonVariants.secondary_gray}
						iconLeading={<Calendar size={16} />}
						onClick={() => navigate('/orders/calendar')}
					/>
				</div>
			</div>

			<Tabs tabs={TABS} selected={status} onChange={handleTabChange} />

			<OrderStats orders={orders} totalRecords={data?._metadata?.total_records} />

			<div style={{ background: 'white', border: '1px solid #EAECF0', borderRadius: 8, overflow: 'hidden' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr>
							{columns.map((c, i) => (
								<th
									key={i}
									style={{
										textAlign: 'left',
										padding: '10px 12px',
										fontSize: 12,
										textTransform: 'uppercase',
										color: '#667085',
										background: '#F9FAFB',
										borderBottom: '1px solid #EAECF0',
									}}
								>
									{c.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{orders.map((o, i) => (
							<tr key={i} onClick={() => navigate(`/orders/${o.public_id}`)} style={{ cursor: 'pointer' }}>
								{columns.map((c, j) => (
									<td key={j} style={{ padding: '10px 12px', fontSize: 14, borderBottom: '1px solid #EAECF0' }}>
										{c.render(o)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}>
					<span style={{ fontSize: 13, color: '#475467' }}>
						Page {data?._metadata?.page} of {data?._metadata?.last_page}
					</span>
					<div style={{ display: 'flex', gap: 8 }}>
						<button disabled={page <= 1} onClick={() => setPage(page - 1)}>
							Previous
						</button>
						<button disabled={page >= (data?._metadata?.last_page ?? 1)} onClick={() => setPage(page + 1)}>
							Next
						</button>
					</div>
				</div>
			</div>

			<ShipOrderModal
				isOpen={isShipModalOpen}
				order={selectedOrder}
				onShipped={handleShipped}
				onClose={() => setIsShipModalOpen(false)}
			/>
		</div>
	);
};

export default Orders;
