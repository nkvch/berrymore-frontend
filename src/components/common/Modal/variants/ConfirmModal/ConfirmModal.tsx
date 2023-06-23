import { CircularProgress, Typography } from "@mui/material";
import Modal from "../../Modal";
import { ButtonContainer, CancelButton, ConfirmButton } from "../../elements";

export interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
  loading?: boolean;
}

function ConfirmModal({ open, onConfirm, onCancel, title, text, loading }: ConfirmModalProps) {
  return <Modal open={open} onClose={onCancel}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body1">{text}</Typography>
    <ButtonContainer>
      <CancelButton
        disabled={loading}
        onClick={onCancel}>Отмена</CancelButton>
      <ConfirmButton
        disabled={loading}
        onClick={onConfirm}
        endIcon={loading ? <CircularProgress color='info' size={20} /> : undefined}
      >Подтвердить</ConfirmButton>
    </ButtonContainer>
  </Modal>;
};

export default ConfirmModal;
