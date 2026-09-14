/**
 * Data source every stat is derived from. Kept generic so stats can be
 * computed from any list-like payload, not just the orders table.
 */
export type StatsSource = {
	orders: any[];
	totalRecords?: number;
};

export enum StatFormat {
	Integer = 'integer',
	Currency = 'currency',
}

export type StatDefinition = {
	/** Stable identifier used for visibility/order state. */
	id: string;
	label: string;
	format: StatFormat;
	/** Extracts the raw numeric value for this stat from the current source. */
	compute: (source: StatsSource) => number;
};

export type ComputedStat = {
	id: string;
	label: string;
	value: string;
};

export type StatsState = {
	visibility: Record<string, boolean>;
	order: string[];
};

export type StatsAction =
	{ type: 'toggle'; id: string } | { type: 'reorder'; order: string[] } | { type: 'reset'; ids: string[] };
