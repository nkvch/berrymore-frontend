import styled from "@emotion/styled";
import withDefaultProps from "../../helpers/withDefaultProps";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export const AddButton = styled(withDefaultProps({ variant: 'contained' }, Button))`
  margin-top: 1rem;
`;

export const DataGridLimitedHeight = styled(DataGrid)`
  max-height: calc(100vh - 260px);
`;
