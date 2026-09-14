import { ReactNode, createContext, useContext, useState } from 'react';
import styled from 'styled-components';

import { Colors, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { Typography } from '@/shared/ui/typography';

export enum SnackbarTypes {
	SUCCESS = 'success',
	ERROR = 'error',
}

type Snackbar = { type: SnackbarTypes; title: string; description?: string };
type Ctx = { showSnackbar: (snackbar: Snackbar) => void };

const SnackbarContext = createContext<Ctx>({ showSnackbar: () => {} });

const Toast = styled.div<{ $type: SnackbarTypes }>`
	position: fixed;
	bottom: ${Spaces.spacing_3xl};
	right: ${Spaces.spacing_3xl};
	padding: ${Spaces.spacing_lg} ${Spaces.spacing_xl};
	border-radius: ${Radiuses.radius_md};
	background: ${({ $type }) => ($type === SnackbarTypes.SUCCESS ? Colors.utility_success_700 : Colors.utility_error_700)};
	color: ${Colors.text_white};
	z-index: 100;
`;

const Title = styled(Typography)`
	color: ${Colors.text_white};
	font-weight: ${FontWeights.SEMIBOLD};
`;

const Description = styled(Typography)`
	color: ${Colors.text_white};
`;

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
	const [snackbar, setSnackbar] = useState<Snackbar>();

	const showSnackbar = (next: Snackbar) => {
		setSnackbar(next);
		setTimeout(() => setSnackbar(undefined), 3000);
	};

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}
			{snackbar && (
				<Toast $type={snackbar.type}>
					<Title>{snackbar.title}</Title>
					{snackbar.description && <Description>{snackbar.description}</Description>}
				</Toast>
			)}
		</SnackbarContext.Provider>
	);
};

export const useSnackbar = () => useContext(SnackbarContext);
