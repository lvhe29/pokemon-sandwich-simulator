import styled from 'styled-components';
import { CenteredList } from '../style';
import { SVG } from '../svg/svg';

const StyledArrowRow = styled(CenteredList)`
  height: ${p => p.height || 80}px;
  margin: 8px 0 8px;
`;

export const ArrowRow = ({hight}) => (
  <StyledArrowRow height={40}>
    <div>{SVG.DownArrow('#0007', 40)}</div>
  </StyledArrowRow>
);
