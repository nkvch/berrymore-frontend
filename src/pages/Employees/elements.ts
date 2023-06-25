import styled from "@emotion/styled";
import withDefaultProps from "../../helpers/withDefaultProps";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Info } from "@mui/icons-material";

export const AddButton = styled(withDefaultProps({ variant: 'contained' }, Button))`
  margin-top: 1rem;
`;

export const PageActionButton = styled(withDefaultProps({ variant: 'outlined' }, Button))`
  margin-top: 1rem;
  margin-left: 1rem;
`;

export const PaginationWrapper = styled(Box)`
  flex: 1;
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
  gap: 1rem;
`;

export const FetchMoreButton = styled(withDefaultProps({ variant: 'text' }, Button))`
  flex: 1;
`;

export const PagesInfo = styled(withDefaultProps({ variant: 'body1' }, Typography))`
  margin-left: auto;
`

export const DataGridLimitedHeight = styled(DataGrid)`
  max-height: calc(100vh - 260px);
`;
