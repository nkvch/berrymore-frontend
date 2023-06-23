import styled from "@emotion/styled";
import { Button, IconButton, Modal } from "@mui/material";
import { Block } from "../../elements/Block";
import withDefaultProps from "../../../helpers/withDefaultProps";
import FlexContainer from "../../elements/FlexContainer";

export const ModalBackdrop = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const ModalBlock = styled(Block)`
  position: relative;
  width: fit-content;
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;

export const CancelButton = styled(withDefaultProps({ variant: 'contained', color: 'error' }, Button))`
`

export const ConfirmButton = styled(withDefaultProps({ variant: 'contained', color: 'primary' }, Button))`
`
export const ButtonContainer = styled(FlexContainer)`
  margin-top: 1rem;
  gap: 1rem;
`;
