import styled from "@emotion/styled";
import withDefaultProps from "../../../../helpers/withDefaultProps";
import { Button, Typography } from "@mui/material";
import FlexContainer from "../../../../components/elements/FlexContainer";

export const PrintSelectedButton = styled(withDefaultProps({ variant: 'outlined', color: 'secondary' }, Button))`

`;

export const PrintAllButton = styled(withDefaultProps({ variant: 'outlined', color: 'primary' }, Button))`

`

export const ModalTitle = styled(withDefaultProps({ variant: 'h5' }, Typography))`
  margin-right: 2rem;
`;

export const ModalContent = styled(FlexContainer)`
  gap: 1rem;
  margin-top: 2rem;
`