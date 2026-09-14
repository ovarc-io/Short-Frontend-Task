import { Carrier, OrderStatus } from '@/shared/types/order';

// Raw backend rows. The API layer (handlers.ts) serialises these — do not import from components.
export type OrderRow = {
	id: number;
	public_id: string;
	customer_name: string;
	customer_email: string;
	status: OrderStatus;
	items_count: number;
	total: string;
	currency: string;
	tracking_number: string | null;
	carrier: Carrier | null;
	created_at: string;
};

const names = [
	'John Carter',
	'Johanna Mills',
	'Maria Gomez',
	'Ahmed Hassan',
	'Jonas Berg',
	'Sara Lindqvist',
	'Joseph Okafor',
	'Li Wei',
	'Emily Johnson',
	'Omar Farouk',
	'Jo Nakamura',
	'Fatima Zahra',
	'Jonathan Reyes',
	'Hana Kim',
	'Marcus Johansson',
	'Priya Patel',
	'Joe Bloggs',
	'Chloe Dubois',
	'Youssef Amin',
	'Anna Kowalski',
	'Johnny Blaze',
	'Nour El Din',
	'Diego Alvarez',
	'Ingrid Solberg',
	'Jordan Smith',
	'Aisha Bello',
	'Tom Hardy',
	'Mei Chen',
	'Karim Said',
	'Laura Bianchi',
	'Mohamed Adel',
	'Salma Tarek',
	'Peter Novak',
	'Yara Mostafa',
	'Lucas Silva',
	'Dina Kamel',
	'Rania Fathy',
	'Oliver Brown',
	'Sofia Rossi',
	'Hassan Ali',
	'Elena Petrova',
	'Amr Khaled',
	'Isabella Costa',
	'Mahmoud Samir',
];
const statuses = [OrderStatus.Pending, OrderStatus.Shipped, OrderStatus.Delivered, OrderStatus.Cancelled];
const totals = ['129.99', '54.50', '312.00', '89.90', '19.99', '240.75', '75.25', '410.10', '33.33', '150.00', '98.45', '61.80'];

export const ORDERS: OrderRow[] = names.map((name, i) => {
	const status = statuses[i % statuses.length];
	const day = 1 + (i % 14);
	const hour = 8 + (i % 10);
	return {
		id: 1001 + i,
		public_id: `ord_${(1001 + i).toString(36)}${i * 7919}`,
		customer_name: name,
		customer_email: `${name.toLowerCase().replace(/ /g, '.')}@example.com`,
		status,
		items_count: 1 + (i % 6),
		total: totals[i % totals.length],
		currency: 'EGP',
		tracking_number: status === OrderStatus.Shipped || status === OrderStatus.Delivered ? `TRK${100000 + i * 37}` : null,
		carrier: status === OrderStatus.Shipped || status === OrderStatus.Delivered ? Carrier.Bosta : null,
		created_at: `2026-09-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}:00Z`,
	};
});
