import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useGlobalModalContext } from "../GlobalModal";

interface Props {
  title?: string;
  content: string;
  onConfirm: () => void;
}

export const ModalConfirm: React.FC<Props> = ({
  title,
  content,
  onConfirm,
}) => {
  const { hideModal } = useGlobalModalContext();

  const handleModalToggle = () => {
    hideModal();
  };

  return (
    <Dialog
      open={true}
      onClose={handleModalToggle}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          width: "100%",
        }}
      >
        {title || "Thông báo xác nhận"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleModalToggle}>
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onConfirm}
          autoFocus
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};
