import styled from 'styled-components';

import { Colors, FontSizes, FontWeights } from '@/constants/styles';

export const Typography = styled.p`
	margin: 0;
	font-size: ${FontSizes.TX_MD};
	font-weight: ${FontWeights.REGULAR};
	color: ${Colors.text_primary};
`;
