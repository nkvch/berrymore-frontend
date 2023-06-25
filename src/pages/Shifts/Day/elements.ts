import styled from "@emotion/styled";
import FlexContainerColumn from "../../../components/elements/FlexContainerColumn";
import { Button } from "@mui/material";
import withDefaultProps from "../../../helpers/withDefaultProps";
import { DataGrid } from "@mui/x-data-grid";

export const Container = styled(FlexContainerColumn)`

`;

export const DeleteButton = styled(withDefaultProps({ variant: 'outlined', color: 'error' }, Button))`
  margin-top: 10px;
  width: fit-content;
`;

export const DataGridLimitedHeight = styled(DataGrid)`
  max-height: calc(100vh - 260px);
`;
