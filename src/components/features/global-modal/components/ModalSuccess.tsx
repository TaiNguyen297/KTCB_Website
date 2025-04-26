import { Button, Modal } from "@mui/material";
import React from "react";
import EmailImg from "@public/email.png";
import Image from "next/image";
import { useGlobalModalContext } from "../GlobalModal";

interface Props {
  heading?: string;
  content: string;
}

const ModalSuccess: React.FC<Props> = ({ heading, content }) => {
  const { hideModal } = useGlobalModalContext();

  const handleModalToggle = () => {
    hideModal();
  };

  return (
    <Modal open={true} onClose={handleModalToggle}>
      <div className="flex flex-col gap-4 items-center justify-center bg-white rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-background-paper shadow-md px-16 py-8">
        <Image src={EmailImg.src} alt="email" width={80} height={80} />
        <h1 className="text-2xl font-bold text-center">
          {heading || "Xác nhận thành công"}
        </h1>
        <p className="text-center">{content}</p>
        <Button
          variant="contained"
          sx={{
            width: "fit-content",
            marginTop: "12px",
          }}
          color="secondary"
          onClick={handleModalToggle}
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};

export { ModalSuccess };
