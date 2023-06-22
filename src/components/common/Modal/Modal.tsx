import { Close } from '@mui/icons-material';
import React from 'react';
import { CloseButton, ModalBackdrop, ModalBlock } from './elements';

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
