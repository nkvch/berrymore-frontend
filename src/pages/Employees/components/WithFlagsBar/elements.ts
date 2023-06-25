import styled from "@emotion/styled";
import { Chip } from "@mui/material";

export const RelativeDiv = styled.div`
  position: relative;
`
export const FlagsBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  gap: 0.5rem;
`;

export const Flag = styled(Chip)`
  height: 1rem;
  font-size: 0.75rem;
`;
