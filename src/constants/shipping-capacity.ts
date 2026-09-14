/**
 * Cargo capacity per month, in shipping units (see ORDER_SIZE_MAP for what an order costs).
 * Ops set these per season — lower around holidays, higher before sale periods.
 * Lives here until `GET /admin/shipping-capacity` exists; then this map becomes a query.
 */
export const DEFAULT_MONTHLY_CAPACITY_UNITS = 10;

export const MONTHLY_CAPACITY_UNITS: Record<string, number> = {
	'2026-09': 8,
	'2026-10': 10,
	'2026-11': 12,
	'2026-12': 6,
	'2027-01': 10,
	'2027-02': 12,
};
