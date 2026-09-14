import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { BackendError } from '@/shared/types/general';

export const extractBodyErrors = (error: BackendError): Record<string, string> => {
	if (!error.errors) return {};
	return Object.fromEntries(Object.entries(error.errors).map(([field, messages]) => [field, messages[0]]));
};

export const setBackendFormErrors = <T extends FieldValues>(
	fieldErrors: Record<string, string>,
	setError: UseFormSetError<T>,
) => {
	Object.entries(fieldErrors).forEach(([field, message]) => {
		setError(field as Path<T>, { type: 'server', message });
	});
};
