import styled from "@emotion/styled";
import { Clear, Info } from "@mui/icons-material";
import { Box } from "@mui/material";

export const ToolbarWrapper = styled(Box)`
  display: flex;
`;

export const SearchInfoIcon = styled(Info)`
  cursor: pointer;
`;

export const ClearIcon = styled(Clear)`
  cursor: pointer;
  margin-right: 0.5rem;
`;
