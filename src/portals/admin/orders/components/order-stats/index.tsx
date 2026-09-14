import { StatsProvider } from './context';
import { StatsSource } from './types';
import { useStats } from './use-stats';

const StatsGrid = (source: StatsSource) => {
	const stats = useStats(source);

	return (
		<div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
			{stats.map(stat => (
				<div
					key={stat.id}
					style={{ background: 'white', border: '1px solid #EAECF0', borderRadius: 8, padding: '10px 14px', minWidth: 150 }}
				>
					<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#667085' }}>{stat.label}</div>
					<div style={{ fontSize: 18, fontWeight: 600 }}>{stat.value}</div>
				</div>
			))}
		</div>
	);
};

export const OrderStats = (source: StatsSource) => (
	<StatsProvider>
		<StatsGrid {...source} />
	</StatsProvider>
);
