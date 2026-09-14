import styled from 'styled-components';

import { ANIMATION_SPEED, Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { Typography } from '@/shared/ui/typography';

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_sm};
`;

export const Label = styled(Typography)`
	font-weight: ${FontWeights.MEDIUM};
	color: ${Colors.text_secondary_700};
`;

export const Select = styled.select`
	padding: ${Spaces.spacing_md} ${Spaces.spacing_lg};
	border: 1px solid ${Colors.border_primary};
	border-radius: ${Radiuses.radius_md};
	font-family: inherit;
	font-size: ${FontSizes.TX_MD};
	color: ${Colors.text_primary};
	background: ${Colors.bg_primary};
	cursor: pointer;
	transition: border-color ${ANIMATION_SPEED} ease;

	&:focus {
		outline: none;
		border-color: ${Colors.border_brand};
	}
`;

export const Hint = styled(Typography)`
	font-size: ${FontSizes.TX_SM};
	color: ${Colors.text_tertiary_600};
`;

export const WarningHint = styled(Hint)`
	display: flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
	color: ${Colors.utility_warning_700};
`;
