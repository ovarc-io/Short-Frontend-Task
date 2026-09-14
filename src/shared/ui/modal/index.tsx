import { ReactNode, useEffect } from 'react';

import { Backdrop, Panel } from './styled';

type Props = { onClose: () => void; children: ReactNode };

export const Modal = ({ onClose, children }: Props) => {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose]);

	return (
		<Backdrop onClick={onClose}>
			<Panel role='dialog' onClick={e => e.stopPropagation()}>
				{children}
			</Panel>
		</Backdrop>
	);
};
