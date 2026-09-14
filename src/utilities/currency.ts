import { Currency } from '@/shared/types/general';

export const currencyFormatter = (amount: number | string, currency: Currency = Currency.EGP) => {
	const value = typeof amount === 'string' ? Number(amount) : amount;
	return new Intl.NumberFormat('en-EG', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
};
