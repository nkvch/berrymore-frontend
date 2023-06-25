import styled from "@emotion/styled";
import { DataGrid } from "@mui/x-data-grid";
import withDefaultProps from "../../helpers/withDefaultProps";
import { Button } from "@mui/material";

export const DataGridLimitedHeight = styled(DataGrid)`
  max-height: calc(100vh - 260px);
`;

export const AddButton = styled(withDefaultProps({ variant: 'contained' }, Button))`
  margin-top: 1rem;
`;
