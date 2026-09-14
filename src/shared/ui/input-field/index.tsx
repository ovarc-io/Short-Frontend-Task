import { InputHTMLAttributes, forwardRef } from 'react';

import { ErrorText, FieldWrapper, Label, StyledInput } from './styled';

type Props = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
	required?: boolean;
};

export const InputField = forwardRef<HTMLInputElement, Props>(({ label, error, required, ...rest }, ref) => (
	<FieldWrapper>
		{label && (
			<Label>
				{label}
				{required && ' *'}
			</Label>
		)}
		<StyledInput ref={ref} $hasError={!!error} {...rest} />
		{error && <ErrorText>{error}</ErrorText>}
	</FieldWrapper>
));
