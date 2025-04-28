import React from "react";
import { IMemberManagement } from "./MemberManagementTable";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { ActionType } from "@/@types/common";

import ClearIcon from "@mui/icons-material/Clear";
import { ACTIONS } from "@/utils/constants";
import { MemberWithPosition } from "@/@types/member";

interface Props {
  data: MemberWithPosition;
  open: boolean;
  onClose: () => void;
  // handleOpenModal: (person: IMemberManagement, action?: ActionType) => void;
}

const classNameCol = "md:col-span-1 xs:col-span-2";

export const MemberManagementDetail: React.FC<Props> = ({
  data,
  onClose,
  open,
  // handleOpenModal,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] w-full h-auto max-h-[80vh] max-[768px]:overflow-y-scroll bg-white mx-auto">
        <div className="grid grid-cols-6 h-full md:p-8 p-4 gap-4">
          <div className="lg:col-span-2 col-span-6 gap-4 flex flex-col">
            <div className={classNameCol}>
              <span className="font-bold">Họ và tên: </span>
              {data.fullName}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Ngày tháng năm sinh: </span>
              {new Date(data.birthday).toLocaleDateString("vi")}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Email: </span>
              {data.email}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Số điện thoại: </span>
              {data.phoneNumber}
            </div>
          </div>

          <div className="lg:col-span-2 col-span-6 gap-4 flex flex-col">
            <div className={classNameCol}>
              <span className="font-bold">Địa chỉ: </span>
              {data.address}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Nơi làm việc: </span>
              {data.workPlace}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Team: </span>
              {data.team.name}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Vị trí: </span>
              {data.position.name}
            </div>
          </div>

          <div className="lg:col-span-2 col-span-6 gap-4 flex flex-col">
            <div className={classNameCol}>
              <span className="font-bold">Ngân hàng: </span>
              {data.bank}
            </div>

            <div className={classNameCol}>
              <span className="font-bold">Số tài khoản ngân hàng: </span>
              {data.bankAccount}
            </div>

            {/* <div className="flex items-center justify-center min-w-">
              <Tooltip title="Rời đội">
                <IconButton
                  onClick={() => {
                    handleOpenModal(data, ACTIONS["REJECT"] as ActionType);
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </div> */}
          </div>
        </div>
      </div>
    </Modal>
  );
};
