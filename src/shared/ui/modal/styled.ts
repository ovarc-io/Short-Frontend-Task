import styled from 'styled-components';

import { Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { Typography } from '../typography';

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(16, 24, 40, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 50;
`;

export const Panel = styled.div`
	background: ${Colors.bg_primary};
	border-radius: ${Radiuses.radius_lg};
	width: 100%;
	max-width: 28rem;
`;

export const ModalContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: ${Spaces.spacing_3xl} ${Spaces.spacing_3xl} 0;
`;

export const ModalTitle = styled(Typography)`
	font-size: ${FontSizes.TX_XL};
	font-weight: ${FontWeights.SEMIBOLD};
`;

export const ModalSubtitle = styled(Typography)`
	color: ${Colors.text_tertiary_600};
	margin-top: ${Spaces.spacing_xs};
`;

export const ModalFlexContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_xl};
	padding: ${Spaces.spacing_3xl};
`;

export const ModalFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: ${Spaces.spacing_lg};
	padding: 0 ${Spaces.spacing_3xl} ${Spaces.spacing_3xl};
`;
