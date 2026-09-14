import styled from 'styled-components';

import { ANIMATION_SPEED, Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { Typography } from '@/shared/ui/typography';

export enum CapacityLevel {
	Healthy = 'healthy',
	Tight = 'tight',
	Full = 'full',
	Over = 'over',
	Closed = 'closed',
}

const levelColors: Record<CapacityLevel, Colors> = {
	[CapacityLevel.Healthy]: Colors.utility_success_700,
	[CapacityLevel.Tight]: Colors.utility_warning_700,
	[CapacityLevel.Full]: Colors.utility_blue_700,
	[CapacityLevel.Over]: Colors.utility_error_700,
	[CapacityLevel.Closed]: Colors.fg_disabled,
};

// The shared Button renders a single text label, so a month cell — a card with its own layout —
// is a native button here instead.
export const Cell = styled.button<{ $isSelected: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_md};
	width: 100%;
	padding: ${Spaces.spacing_lg};
	text-align: left;
	font-family: inherit;
	background: ${Colors.bg_primary};
	border: 1px solid ${({ $isSelected }) => ($isSelected ? Colors.border_brand : Colors.border_secondary)};
	box-shadow: ${({ $isSelected }) => ($isSelected ? `0 0 0 1px ${Colors.border_brand}` : 'none')};
	border-radius: ${Radiuses.radius_md};
	cursor: pointer;
	transition: all ${ANIMATION_SPEED} ease;

	&:hover:not(:disabled) {
		background: ${Colors.bg_secondary};
	}

	&:disabled {
		cursor: default;
		background: ${Colors.bg_secondary};
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${Spaces.spacing_md};
`;

export const MonthName = styled(Typography)`
	font-size: ${FontSizes.TX_LG};
	font-weight: ${FontWeights.SEMIBOLD};
`;

export const Meta = styled(Typography)`
	font-size: ${FontSizes.TX_SM};
	color: ${Colors.text_tertiary_600};
`;

export const CapacityTrack = styled.div`
	width: 100%;
	height: ${Spaces.spacing_sm};
	background: ${Colors.bg_disabled};
	border-radius: ${Radiuses.radius_full};
	overflow: hidden;
`;

export const CapacityFill = styled.div<{ $percentage: number; $level: CapacityLevel }>`
	width: ${({ $percentage }) => $percentage}%;
	height: 100%;
	background: ${({ $level }) => levelColors[$level]};
	border-radius: ${Radiuses.radius_full};
	transition: width ${ANIMATION_SPEED} ease;
`;

export const Footer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: ${Spaces.spacing_xs} ${Spaces.spacing_md};
	min-height: ${Spaces.spacing_3xl};
`;
