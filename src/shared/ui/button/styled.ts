import styled, { css } from 'styled-components';

import { ANIMATION_SPEED, Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

export enum ButtonVariants {
	primary = 'primary',
	secondary_gray = 'secondary_gray',
	link = 'link',
}

export enum ButtonSizes {
	sm = 'sm',
	md = 'md',
}

const variants = {
	[ButtonVariants.primary]: css`
		background: ${Colors.bg_brand_solid};
		color: ${Colors.text_white};
		border: 1px solid ${Colors.bg_brand_solid};
		&:hover:not(:disabled) {
			background: ${Colors.bg_brand_solid_hover};
		}
	`,
	[ButtonVariants.secondary_gray]: css`
		background: ${Colors.bg_primary};
		color: ${Colors.text_secondary_700};
		border: 1px solid ${Colors.border_primary};
		&:hover:not(:disabled) {
			background: ${Colors.bg_secondary_hover};
		}
	`,
	[ButtonVariants.link]: css`
		background: transparent;
		color: ${Colors.bg_brand_solid};
		border: 1px solid transparent;
		padding: 0;
		&:hover:not(:disabled) {
			text-decoration: underline;
		}
	`,
};

const sizes = {
	[ButtonSizes.sm]: css`
		padding: ${Spaces.spacing_sm} ${Spaces.spacing_lg};
		font-size: ${FontSizes.TX_SM};
	`,
	[ButtonSizes.md]: css`
		padding: ${Spaces.spacing_md} ${Spaces.spacing_xl};
		font-size: ${FontSizes.TX_MD};
	`,
};

export const StyledButton = styled.button<{ $variant: ButtonVariants; $size: ButtonSizes }>`
	display: inline-flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
	border-radius: ${Radiuses.radius_md};
	font-weight: ${FontWeights.SEMIBOLD};
	font-family: inherit;
	cursor: pointer;
	transition: all ${ANIMATION_SPEED} ease;
	${({ $variant }) => variants[$variant]}
	${({ $size }) => sizes[$size]}
	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
`;
