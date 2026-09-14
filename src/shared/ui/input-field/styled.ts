import styled from 'styled-components';

import { Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { Typography } from '../typography';

export const FieldWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_sm};
	width: 100%;
`;

export const Label = styled(Typography)`
	font-weight: ${FontWeights.MEDIUM};
	color: ${Colors.text_secondary_700};
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
	padding: ${Spaces.spacing_md} ${Spaces.spacing_lg};
	border: 1px solid ${({ $hasError }) => ($hasError ? Colors.border_error : Colors.border_primary)};
	border-radius: ${Radiuses.radius_md};
	font-size: ${FontSizes.TX_MD};
	font-family: inherit;
	color: ${Colors.text_primary};
	outline: none;
	&::placeholder {
		color: ${Colors.text_placeholder};
	}
	&:focus {
		border-color: ${Colors.border_brand};
	}
`;

export const ErrorText = styled(Typography)`
	font-size: ${FontSizes.TX_SM};
	color: ${Colors.text_error_primary};
`;
