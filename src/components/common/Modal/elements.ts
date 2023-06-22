import styled from "@emotion/styled";
import { IconButton, Modal } from "@mui/material";
import { Block } from "../../elements/Block";

export const ModalBackdrop = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
