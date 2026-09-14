import { BadgeTypes, MetaData, Option } from './general';

// ============================================================================
// Enums
// ============================================================================

export enum OrderStatus {
	Pending = 10,
	Shipped = 20,
	Delivered = 30,
	Cancelled = 40,
}

export enum Carrier {
	Aramex = 'aramex',
	Bosta = 'bosta',
	DHL = 'dhl',
}

// ============================================================================
// Types
// ============================================================================

export type Order = {
	id: number;
	public_id: string;
	customer_name: string;
	customer_email: string;
	status: Option<OrderStatus>;
	items_count: number;
	total: string;
	currency: string;
	tracking_number: string | null;
	carrier: Carrier | null;
	created_at: string;
};

export type OrdersListMetaData = MetaData & {
	total_revenue: string;
	pending_count: number;
};

// ============================================================================
// Maps / Options
// ============================================================================

export const ORDER_STATUS_MAP: Record<OrderStatus, { option: Option<OrderStatus>; color: BadgeTypes }> = {
	[OrderStatus.Pending]: { option: { label: 'Pending', value: OrderStatus.Pending }, color: BadgeTypes.warning },
	[OrderStatus.Shipped]: { option: { label: 'Shipped', value: OrderStatus.Shipped }, color: BadgeTypes.blue },
	[OrderStatus.Delivered]: { option: { label: 'Delivered', value: OrderStatus.Delivered }, color: BadgeTypes.success },
	[OrderStatus.Cancelled]: { option: { label: 'Cancelled', value: OrderStatus.Cancelled }, color: BadgeTypes.error },
};

export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS_MAP).map(item => item.option);

export const CARRIER_MAP: Record<Carrier, Option<Carrier>> = {
	[Carrier.Aramex]: { label: 'Aramex', value: Carrier.Aramex },
	[Carrier.Bosta]: { label: 'Bosta', value: Carrier.Bosta },
	[Carrier.DHL]: { label: 'DHL', value: Carrier.DHL },
};

export const CARRIER_OPTIONS = Object.values(CARRIER_MAP);
