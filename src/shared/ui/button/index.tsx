import { ButtonHTMLAttributes, ReactNode } from 'react';

import { ButtonSizes, ButtonVariants, StyledButton } from './styled';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
	text: string;
	variant?: ButtonVariants;
	size?: ButtonSizes;
	loading?: boolean;
	iconLeading?: ReactNode;
};

export const Button = ({
	text,
	variant = ButtonVariants.primary,
	size = ButtonSizes.md,
	loading,
	iconLeading,
	disabled,
	...rest
}: Props) => (
	<StyledButton $variant={variant} $size={size} disabled={disabled || loading} {...rest}>
		{iconLeading}
		{loading ? 'Loading…' : text}
	</StyledButton>
);

export { ButtonSizes, ButtonVariants };
