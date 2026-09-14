import { StatFormat } from './types';

export type StatFormatter = (value: number) => string;

/**
 * Formatter plugins keyed by format kind. Register additional formats here
 * (percentages, durations, ...) without touching the stat definitions.
 */
export const FORMATTERS: Record<StatFormat, StatFormatter> = {
	[StatFormat.Integer]: value => String(value),
	[StatFormat.Currency]: value => `EGP ${value.toFixed(2)}`,
};

export const formatStat = (format: StatFormat, value: number): string => {
	const formatter = FORMATTERS[format];
	if (!formatter) {
		throw new Error(`No formatter registered for format "${format}"`);
	}
	return formatter(value);
};
