import { Button, Modal } from "@mui/material";
import React from "react";
import EmailImg from "@public/email.png";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  heading: string;
  content: string;
}

const ToastSuccess: React.FC<Props> = ({ open, onClose, heading, content }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 items-center justify-center bg-white rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-background-paper shadow-md px-16 py-8">
        <Image src={EmailImg.src} alt="email" width={80} height={80} />
        <h1 className="text-2xl font-bold text-center">{heading}</h1>
        <p className="text-center">{content}</p>
        <Button
          variant="contained"
          sx={{
            width: "fit-content",
            marginTop: "12px",
          }}
          color="secondary"
          onClick={onClose}
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default ToastSuccess;
