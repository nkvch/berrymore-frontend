import styled from "@emotion/styled";
import { Clear, Info } from "@mui/icons-material";
import { Box } from "@mui/material";

export const ToolbarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media screen and (min-width: 1440px) {
    flex-direction: row;
  }
  margin-bottom: 1rem;
`;

export const SearchInfoIcon = styled(Info)`
  cursor: pointer;
`;

export const ClearIcon = styled(Clear)`
  cursor: pointer;
  margin-right: 0.5rem;
`;
