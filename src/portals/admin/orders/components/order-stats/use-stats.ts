import { useMemo } from 'react';

import { useStatsContext } from './context';
import { formatStat } from './formatters';
import { ComputedStat, StatsSource } from './types';

/**
 * Resolves the visible stats, in display order, against the given source.
 * Values are memoised on the source and the visibility/order state.
 */
export const useStats = (source: StatsSource): ComputedStat[] => {
	const { registry, state } = useStatsContext();

	return useMemo(
		() =>
			state.order
				.filter(id => state.visibility[id])
				.map(id => registry.get(id))
				.filter((definition): definition is NonNullable<typeof definition> => !!definition)
				.map(definition => ({
					id: definition.id,
					label: definition.label,
					value: formatStat(definition.format, definition.compute(source)),
				})),
		[registry, state, source],
	);
};
