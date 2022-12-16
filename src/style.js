import styled from 'styled-components';

export const Separator = styled.div`
  margin: 4px;
  height: ${(p) => (p.thin === true ? 0.5 : 2)}px;
  background: #0003;
`;

export const SeparatorH = styled.div`
  margin: 0 4px;
  width: 2px;
  height: ${(p) => p.h || 32}px;
  background: #0003;
`;

export const GhostSeparatorV = styled.div`
  margin: 0;
  height: ${(p) => p.h || 24}px;
  background: transparent;
`;

export const AffectList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  padding: 0 4px;
`;

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

export const CenteredList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

export const StyledClearButton = styled.div`
  border-radius: 4px;
  margin: 0px 2px;
  padding: 2px 16px;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #fcc;
  color: #500;
  cursor: pointer;
`;

export const StyledFilterCard = styled.div`
  max-width: 900px;
  background-color: #fff8;
  border-radius: 6px;
  /* box-shadow: 0px 2px 4px 2px #0003; */
  border: 0.5px solid #0003;
  margin: 0 12px;
  padding: 8px;
`;

export const MainList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  text-align: center;
`;

export const ContentList = styled.div`
  overflow: auto;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const PowerExplain = styled(CenteredList)`
  color: #555;
  font-size: 14px;
  height: 20px;
  padding: 0 0 5px 0;
`;

export const StyledTopBar = styled.div`
  min-height: 40px;
  flex-shrink: 0;
  width: 100%;
  background: #fffa;
  border-bottom: 0.5px solid #999;
  box-shadow: 0px 0px 6px 1px #0003;
  z-index: 100;
  padding-top: 8px;
`;

export const Button = styled.button`
  margin: 0 8px 8px;
  background: #eee;
  color: #000;
  border: 0.5px solid #0003;
  padding: 2px 8px;
  border-radius: 4px;
  /* border: none; */
  /* box-shadow: 0px 0px 2px 0px #0005; */
  height: 30px;
  cursor: pointer;
`;

export const IngredientName = styled.div`
  padding-right: 8px;
`;
