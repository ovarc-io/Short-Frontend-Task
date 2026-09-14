import { StatDefinition, StatFormat } from './types';

export type StatsRegistry = {
	register: (definition: StatDefinition) => StatsRegistry;
	unregister: (id: string) => StatsRegistry;
	get: (id: string) => StatDefinition | undefined;
	getAll: () => StatDefinition[];
	ids: () => string[];
};

/**
 * Creates an isolated registry so different pages can expose different stat
 * sets while sharing the same rendering pipeline.
 */
export const createStatsRegistry = (initial: StatDefinition[] = []): StatsRegistry => {
	const definitions = new Map<string, StatDefinition>();

	const registry: StatsRegistry = {
		register(definition) {
			definitions.set(definition.id, definition);
			return registry;
		},
		unregister(id) {
			definitions.delete(id);
			return registry;
		},
		get: id => definitions.get(id),
		getAll: () => Array.from(definitions.values()),
		ids: () => Array.from(definitions.keys()),
	};

	initial.forEach(definition => registry.register(definition));
	return registry;
};

export const DEFAULT_STAT_DEFINITIONS: StatDefinition[] = [
	{
		id: 'total_records',
		label: 'Total records',
		format: StatFormat.Integer,
		compute: ({ totalRecords }) => totalRecords ?? 0,
	},
	{
		id: 'pending',
		label: 'Pending',
		format: StatFormat.Integer,
		compute: ({ orders }) => orders.filter(o => o.status.value == 10).length,
	},
	{
		id: 'revenue',
		label: 'Revenue',
		format: StatFormat.Currency,
		compute: ({ orders }) => {
			let total = 0;
			for (let i = 0; i < orders.length; i++) {
				if (orders[i].status.value !== 40) {
					total += parseInt(orders[i].total);
				}
			}
			return total;
		},
	},
];
