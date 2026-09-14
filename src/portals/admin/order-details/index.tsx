import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetOrder } from './apis/queries';

import { Badge } from '@/shared/ui/badge';

import { ShipOrderModal } from './components/ship-order-modal';

const getStatusColor = (status: number) => {
	if (status === 10) return 'warning';
	if (status === 20) return 'blue';
	if (status === 30) return 'success';
	if (status === 40) return 'error';
	return 'gray';
};

const Row = ({ label, value }: any) => (
	<div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #EAECF0' }}>
		<span style={{ fontSize: 13, color: '#667085' }}>{label}</span>
		<span style={{ fontSize: 14, color: '#101828' }}>{value}</span>
	</div>
);

const OrderDetails = () => {
	const { public_id } = useParams();
	const navigate = useNavigate();
	const [isShipModalOpen, setIsShipModalOpen] = useState(false);

	const { data: order, isLoading, isError } = useGetOrder(public_id as string);

	if (isLoading) {
		return <p style={{ padding: 32 }}>Loading...</p>;
	}

	if (isError || !order) {
		return <p style={{ padding: 32 }}>Order not found.</p>;
	}

	return (
		<div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
			<button
				onClick={() => navigate('/orders')}
				style={{
					background: 'none',
					border: 'none',
					color: '#475467',
					cursor: 'pointer',
					padding: 0,
					fontSize: 14,
					marginBottom: 16,
				}}
			>
				← Back to orders
			</button>

			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<div>
					<h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#101828' }}>Order #{order.id}</h1>
					<p style={{ margin: '4px 0 0', fontSize: 14, color: '#475467' }}>{order.public_id}</p>
				</div>
				<Badge text={order.status.label} color={getStatusColor(order.status.value) as any} />
			</div>

			<div style={{ background: 'white', border: '1px solid #EAECF0', borderRadius: 8, padding: '4px 16px', marginBottom: 16 }}>
				<Row label='Customer' value={order.customer_name} />
				<Row label='Email' value={order.customer_email} />
				<Row label='Items' value={order.items_count} />
				<Row label='Total' value={`EGP ${order.total}`} />
				<Row label='Carrier' value={order.carrier || '--'} />
				<Row label='Tracking' value={order.tracking_number || '--'} />
				<Row label='Created' value={new Date(order.created_at).toLocaleString()} />
			</div>

			{order.status.value === 10 && (
				<button
					onClick={() => setIsShipModalOpen(true)}
					style={{
						padding: '8px 14px',
						fontSize: 14,
						border: 'none',
						borderRadius: 8,
						background: '#033B6E',
						color: 'white',
						cursor: 'pointer',
					}}
				>
					Mark shipped
				</button>
			)}

			<ShipOrderModal isOpen={isShipModalOpen} order={order} onClose={() => setIsShipModalOpen(false)} />
		</div>
	);
};

export default OrderDetails;
