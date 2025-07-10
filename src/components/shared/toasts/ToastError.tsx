import { Button, Modal } from "@mui/material";
import React from "react";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  heading: string;
  content: string;
}

const ToastError: React.FC<Props> = ({ open, onClose, heading, content }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 items-center justify-center bg-white rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-background-paper shadow-md px-16 py-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-center text-red-600">{heading}</h1>
        <p className="text-center text-gray-600">{content}</p>
        <Button
          variant="contained"
          sx={{
            width: "fit-content",
            marginTop: "12px",
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
          onClick={onClose}
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default ToastError;
