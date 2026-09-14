import styled from 'styled-components';

import { Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { BadgeTypes } from '@/shared/types/general';

type Props = { text: string; color?: BadgeTypes };

const palette: Record<BadgeTypes, { bg: Colors; fg: Colors }> = {
	[BadgeTypes.gray]: { bg: Colors.utility_gray_50, fg: Colors.utility_gray_700 },
	[BadgeTypes.warning]: { bg: Colors.utility_warning_50, fg: Colors.utility_warning_700 },
	[BadgeTypes.blue]: { bg: Colors.utility_blue_50, fg: Colors.utility_blue_700 },
	[BadgeTypes.success]: { bg: Colors.utility_success_50, fg: Colors.utility_success_700 },
	[BadgeTypes.error]: { bg: Colors.utility_error_50, fg: Colors.utility_error_700 },
};

const StyledBadge = styled.span<{ $color: BadgeTypes }>`
	display: inline-flex;
	padding: ${Spaces.spacing_xs} ${Spaces.spacing_md};
	border-radius: ${Radiuses.radius_full};
	font-size: ${FontSizes.TX_SM};
	font-weight: ${FontWeights.MEDIUM};
	background: ${({ $color }) => palette[$color].bg};
	color: ${({ $color }) => palette[$color].fg};
`;

export const Badge = ({ text, color = BadgeTypes.gray }: Props) => <StyledBadge $color={color}>{text}</StyledBadge>;
