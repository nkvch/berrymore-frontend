import styled from '@emotion/styled';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const DataGridLimitedHeight = styled(DataGrid)`
  max-height: calc(100vh - 260px);
`;
