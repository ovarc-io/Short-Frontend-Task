import styled from 'styled-components';

import { ANIMATION_SPEED, Colors, FontSizes, FontWeights, Spaces } from '@/constants/styles';

import { Option } from '@/shared/types/general';

type Props<T> = { tabs: Option<T>[]; selected: T; onChange: (value: T) => void };

const List = styled.div`
	display: flex;
	gap: ${Spaces.spacing_xs};
	border-bottom: 1px solid ${Colors.border_secondary};
`;

const Tab = styled.button<{ $active: boolean }>`
	background: none;
	border: none;
	border-bottom: 2px solid ${({ $active }) => ($active ? Colors.border_brand : 'transparent')};
	padding: ${Spaces.spacing_md} ${Spaces.spacing_lg};
	font-family: inherit;
	font-size: ${FontSizes.TX_MD};
	font-weight: ${({ $active }) => ($active ? FontWeights.SEMIBOLD : FontWeights.MEDIUM)};
	color: ${({ $active }) => ($active ? Colors.text_primary : Colors.text_tertiary_600)};
	cursor: pointer;
	transition: all ${ANIMATION_SPEED} ease;
`;

export const Tabs = <T,>({ tabs, selected, onChange }: Props<T>) => (
	<List>
		{tabs.map(tab => (
			<Tab key={String(tab.value)} $active={tab.value === selected} onClick={() => onChange(tab.value)}>
				{tab.label}
			</Tab>
		))}
	</List>
);
