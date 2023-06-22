import { Typography } from "@mui/material";
import Modal, { ModalProps } from "../../Modal";

export interface ConfirmModalProps extends ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
}

function ConfirmModal({ open, onConfirm, onCancel }: ConfirmModalProps) {
  return <Modal open={open} onClose={onCancel}>
    <Typography variant="h6">Are you sure?</Typography>
    <Typography variant="body1">This action cannot be undone.</Typography>
    <div>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </div>
  </Modal>;
};

export default ConfirmModal;
