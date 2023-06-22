import React from 'react';
import { Modal as MuiModal, Paper } from '@mui/material';
import { CloseButton, ModalBackdrop, ModalBlock } from './elements';
import { Close } from '@mui/icons-material';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {

  return (
    <ModalBackdrop open={open} onClose={onClose}>
      <ModalBlock>
        <CloseButton onClick={onClose}>
          <Close />
        </CloseButton>
        {children}
      </ModalBlock>
    </ModalBackdrop>
  );
};

export default Modal;
