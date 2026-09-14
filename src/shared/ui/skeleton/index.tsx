import styled, { keyframes } from 'styled-components';

import { Colors, Radiuses, Spaces } from '@/constants/styles';

const pulse = keyframes`
	0%, 100% { opacity: 1; }
	50% { opacity: 0.4; }
`;

export const Skeleton = styled.div<{ $width?: string; $height?: string }>`
	width: ${({ $width }) => $width ?? '100%'};
	height: ${({ $height }) => $height ?? '1rem'};
	background: ${Colors.bg_secondary_hover};
	border-radius: ${Radiuses.radius_sm};
	animation: ${pulse} 1.5s ease-in-out infinite;
`;

const Rows = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_lg};
	padding: ${Spaces.spacing_xl};
`;

export const TableSkeleton = ({ numberOfRows = 5 }: { numberOfRows?: number }) => (
	<Rows>
		{Array.from({ length: numberOfRows }).map((_, i) => (
			<Skeleton key={i} $height='2.25rem' />
		))}
	</Rows>
);
