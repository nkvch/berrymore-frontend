import styled from "@emotion/styled";
import withDefaultProps from "../../../../helpers/withDefaultProps";
import { Typography } from "@mui/material";
import FlexContainer from "../../../../components/elements/FlexContainer";

export const ModalTitle = styled(withDefaultProps({ variant: 'h5' }, Typography))`
  margin-right: 2rem;
`;

export const ModalContent = styled(FlexContainer)`
  gap: 1rem;
  margin-top: 2rem;
  width: 90vw;
  @media screen and (min-width: 995px) {
    width: 50vw;
  }
`
