import styled from 'styled-components';

import { Colors, FontSizes, FontWeights, Radiuses, Spaces } from '@/constants/styles';

import { Typography } from '@/shared/ui/typography';

export const Page = styled.div`
	max-width: 68.75rem;
	margin: 0 auto;
	padding: ${Spaces.spacing_4xl} ${Spaces.spacing_xl};
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_xl};
`;

export const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_xs};
`;

export const Title = styled(Typography)`
	font-size: ${FontSizes.SM};
	font-weight: ${FontWeights.SEMIBOLD};
`;

export const Subtitle = styled(Typography)`
	color: ${Colors.text_tertiary_600};
`;

export const Toolbar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${Spaces.spacing_lg};
	flex-wrap: wrap;
`;

export const YearNav = styled.div`
	display: flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
`;

export const YearLabel = styled(Typography)`
	font-size: ${FontSizes.TX_LG};
	font-weight: ${FontWeights.SEMIBOLD};
	min-width: ${Spaces.spacing_4xl};
	text-align: center;
`;

export const Legend = styled.div`
	display: flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
	flex-wrap: wrap;
`;

export const LegendLabel = styled(Typography)`
	font-size: ${FontSizes.TX_SM};
	color: ${Colors.text_tertiary_600};
`;

export const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: ${Spaces.spacing_lg};

	@media (max-width: 64rem) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 48rem) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

export const Card = styled.div`
	background: ${Colors.bg_primary};
	border: 1px solid ${Colors.border_secondary};
	border-radius: ${Radiuses.radius_md};
`;

export const WarningCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${Spaces.spacing_md};
	padding: ${Spaces.spacing_lg} ${Spaces.spacing_xl};
	background: ${Colors.utility_error_50};
	border: 1px solid ${Colors.border_error};
	border-radius: ${Radiuses.radius_md};
`;

export const WarningTitle = styled(Typography)`
	display: flex;
	align-items: center;
	gap: ${Spaces.spacing_md};
	font-weight: ${FontWeights.SEMIBOLD};
	color: ${Colors.utility_error_700};
`;

export const WarningItem = styled(Typography)`
	font-size: ${FontSizes.TX_SM};
	color: ${Colors.utility_error_700};
`;
