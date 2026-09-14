import styled from 'styled-components';

import { Colors, FontWeights, Spaces } from '@/constants/styles';

import { Button, ButtonSizes, ButtonVariants } from '../button';
import { Typography } from '../typography';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${Spaces.spacing_md};
	padding: ${Spaces.spacing_4xl};
	text-align: center;
`;

const Title = styled(Typography)`
	font-weight: ${FontWeights.SEMIBOLD};
`;

const Message = styled(Typography)`
	color: ${Colors.text_tertiary_600};
`;

export const EmptyCard = ({ title, message }: { title: string; message: string }) => (
	<Wrapper>
		<Title>{title}</Title>
		<Message>{message}</Message>
	</Wrapper>
);

export const ErrorCard = ({ title, tryAgain }: { title: string; tryAgain?: () => void }) => (
	<Wrapper>
		<Title>{title}</Title>
		<Message>Something went wrong while loading this section.</Message>
		{tryAgain && <Button text='Try again' variant={ButtonVariants.secondary_gray} size={ButtonSizes.sm} onClick={tryAgain} />}
	</Wrapper>
);
