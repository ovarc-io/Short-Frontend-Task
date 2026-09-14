import { StatsAction, StatsState } from './types';

export const initStatsState = (ids: string[]): StatsState => ({
	visibility: Object.fromEntries(ids.map(id => [id, true])),
	order: [...ids],
});

export const statsReducer = (state: StatsState, action: StatsAction): StatsState => {
	switch (action.type) {
		case 'toggle':
			return {
				...state,
				visibility: { ...state.visibility, [action.id]: !state.visibility[action.id] },
			};
		case 'reorder':
			return { ...state, order: [...action.order] };
		case 'reset':
			return initStatsState(action.ids);
		default:
			return state;
	}
};
