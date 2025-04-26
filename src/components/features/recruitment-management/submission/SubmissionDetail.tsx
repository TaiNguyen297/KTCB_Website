import React from "react";
import { ActionTypeAdd } from "./SubmissionTable";
import { IconButton, Modal, Tooltip } from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ClearIcon from "@mui/icons-material/Clear";
import MicIcon from "@mui/icons-material/Mic";

import { ACTIONS } from "@/utils/constants";
import { MemberRegistrationWithPosition } from "@/@types/membershipRegistration";

interface Props {
  data: MemberRegistrationWithPosition;
  open: boolean;
  onClose: () => void;
  handleOpenModal: (person: MemberRegistrationWithPosition, action?: ActionTypeAdd) => void;
}

const classNameCol = "md:col-span-1 xs:col-span-2";

export const SubmissionDetail: React.FC<Props> = ({
  data,
  onClose,
  open,
  handleOpenModal,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] w-full h-auto max-h-[80vh] max-[768px]:overflow-y-scroll bg-white mx-auto">
        <div className="grid grid-cols-6 h-full md:p-8 p-4 gap-4">
          <div className="lg:col-span-6 col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className={classNameCol}>
              <span className="font-bold">Nơi làm việc: </span>
              {data.workPlace}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Địa chỉ: </span>
              {data.address}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">
                Đã từng tham gia hoạt động xã hội:{" "}
              </span>

              {data.hasSocialActivities ? "Có" : "Không"}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">
                Kỷ niệm đáng nhớ khi tham gia hoạt động xã hội:{" "}
              </span>
              {data.memories}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Vị trí mong muốn: </span>
              {data.position.name}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">
                Điều mong muốn nhận khi tham gia KTCB:{" "}
              </span>
              {data.hopeToReceive}
            </div>
            <div className={classNameCol}></div>
            <div className={classNameCol}>
              <div className="flex items-center justify-center min-w-">
                <Tooltip title="Chuyển đơn tuyển sang thành viên chính thức">
                  <IconButton
                    onClick={() => {
                      handleOpenModal(data, ACTIONS["ACCEPT"] as ActionTypeAdd);
                    }}
                  >
                    <PeopleAltIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Chuyển đơn tuyển sang vòng phỏng vấn">
                  <IconButton
                    onClick={() =>
                      handleOpenModal(
                        data,
                        ACTIONS["ACCEPT_INTERVIEW"] as ActionTypeAdd
                      )
                    }
                  >
                    <MicIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Loại đơn tuyển">
                  <IconButton
                    onClick={() => {
                      handleOpenModal(data, ACTIONS["REJECT"] as ActionTypeAdd);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
