import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import withDefaultProps from "../../../../helpers/withDefaultProps";

export const Title = styled(withDefaultProps({ variant: 'h6' }, Typography))`

`
export const DeleteAllEmplyeeData = styled(withDefaultProps({ variant: 'outlined', color: 'error' }, Button))`

`;

export const DeleteEmployee = styled(withDefaultProps({ variant: 'contained', color: 'error' }, Button))`

`;

export const ArchiveEmployee = styled(withDefaultProps({ variant: 'outlined', color: 'warning' }, Button))`

`;
