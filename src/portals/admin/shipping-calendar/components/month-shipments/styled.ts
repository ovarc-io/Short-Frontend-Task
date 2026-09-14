import styled from 'styled-components';

import { Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { Typography } from '@/shared/ui/typography';

export const Panel = styled.section`
	background: ${Colors.bg_primary};
	border: 1px solid ${Colors.border_secondary};
	border-radius: ${Radiuses.radius_md};
	overflow: hidden;
`;

export const PanelHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${Spaces.spacing_lg};
	flex-wrap: wrap;
	padding: ${Spaces.spacing_lg} ${Spaces.spacing_xl};
	border-bottom: 1px solid ${Colors.border_secondary};
	background: ${Colors.bg_secondary};
`;

export const PanelTitle = styled(Typography)`
	font-size: ${FontSizes.TX_LG};
	font-weight: ${FontWeights.SEMIBOLD};
`;

export const PanelMeta = styled(Typography)`
	font-size: ${FontSizes.TX_SM};
	color: ${Colors.text_tertiary_600};
`;

export const RolloverNote = styled.div`
	display: flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
	padding: ${Spaces.spacing_lg} ${Spaces.spacing_xl};
	background: ${Colors.utility_warning_50};
	border-bottom: 1px solid ${Colors.border_secondary};
	color: ${Colors.utility_warning_700};
`;

export const NoteText = styled(Typography)`
	font-size: ${FontSizes.TX_MD};
	color: ${Colors.utility_warning_700};
`;

export const Row = styled.div`
	display: grid;
	grid-template-columns: 8rem 1fr 6rem 7rem auto;
	align-items: center;
	gap: ${Spaces.spacing_lg};
	padding: ${Spaces.spacing_lg} ${Spaces.spacing_xl};

	&:not(:last-child) {
		border-bottom: 1px solid ${Colors.border_secondary};
	}

	@media (max-width: 48rem) {
		grid-template-columns: 1fr auto;
		gap: ${Spaces.spacing_md};
	}
`;

export const RowGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_xs};
	min-width: 0;
`;

export const PrimaryText = styled(Typography)`
	font-weight: ${FontWeights.MEDIUM};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const SecondaryText = styled(Typography)`
	font-size: ${FontSizes.TX_SM};
	color: ${Colors.text_tertiary_600};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const BadgeGroup = styled.div`
	display: flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
	flex-wrap: wrap;
`;

export const RowActions = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: ${Spaces.spacing_lg};
`;

export const OverCapacityNote = styled.div`
	display: flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
	padding: ${Spaces.spacing_lg} ${Spaces.spacing_xl};
	background: ${Colors.utility_error_50};
	border-bottom: 1px solid ${Colors.border_secondary};
`;

export const OverCapacityText = styled(Typography)`
	font-size: ${FontSizes.TX_MD};
	color: ${Colors.utility_error_700};
`;
