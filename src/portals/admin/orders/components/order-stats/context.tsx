import { Dispatch, ReactNode, createContext, useContext, useMemo, useReducer, useRef } from 'react';

import { initStatsState, statsReducer } from './reducer';
import { DEFAULT_STAT_DEFINITIONS, StatsRegistry, createStatsRegistry } from './registry';
import { StatsAction, StatsState } from './types';

type StatsContextValue = {
	registry: StatsRegistry;
	state: StatsState;
	dispatch: Dispatch<StatsAction>;
};

const StatsContext = createContext<StatsContextValue | null>(null);

type Props = {
	registry?: StatsRegistry;
	children: ReactNode;
};

export const StatsProvider = ({ registry: externalRegistry, children }: Props) => {
	const registryRef = useRef<StatsRegistry>(externalRegistry ?? createStatsRegistry(DEFAULT_STAT_DEFINITIONS));
	const [state, dispatch] = useReducer(statsReducer, registryRef.current.ids(), initStatsState);

	const value = useMemo(() => ({ registry: registryRef.current, state, dispatch }), [state]);

	return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};

export const useStatsContext = () => {
	const context = useContext(StatsContext);
	if (!context) {
		throw new Error('useStatsContext must be used within a StatsProvider');
	}
	return context;
};
