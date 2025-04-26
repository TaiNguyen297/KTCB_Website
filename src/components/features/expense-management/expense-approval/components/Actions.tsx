import React, { useMemo } from "react";
import { STATUS_OF_EXPENSE } from "@/utils/constants";
import { AcceptComponent, RejectComponent, UnAcceptComponent } from ".";
import { ActionType } from "@/@types/common";

interface Props {
  status: string;
  handleOpenModal: (action: ActionType) => void;
}

export const Actions: React.FC<Props> = ({ status, handleOpenModal }) => {
  const actions = useMemo(() => {
    switch (status) {
      case STATUS_OF_EXPENSE["PENDING"]:
        return (
          <>
            <AcceptComponent onClick={() => handleOpenModal("accept")} />
            <RejectComponent onClick={() => handleOpenModal("reject")} />
          </>
        );
      case STATUS_OF_EXPENSE["ACCEPTED"]:
        return (
          <>
            <UnAcceptComponent onClick={() => handleOpenModal("un_accept")} />
            <RejectComponent onClick={() => handleOpenModal("reject")} />
          </>
        );
      case STATUS_OF_EXPENSE["REJECTED"]:
        return <></>;
      default:
        return null;
    }
  }, [handleOpenModal, status]);

  return actions;
};
