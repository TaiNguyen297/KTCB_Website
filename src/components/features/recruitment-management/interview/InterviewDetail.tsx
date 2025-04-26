import React from "react";
import { MemberRegistrationWithPosition } from "@/@types/membershipRegistration";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { DatetimePicker, SelectBox } from "@/components/shared/inputs";
import TestOptions from "@/utils/data/json/recruitment_test.json";
import { ActionType } from "@/@types/common";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ClearIcon from "@mui/icons-material/Clear";
import { ACTIONS } from "@/utils/constants";
import { format } from "date-fns";


interface Props {
  data: MemberRegistrationWithPosition;
  open: boolean;
  onClose: () => void;
  handleOpenModal: (person: MemberRegistrationWithPosition, action?: ActionType) => void;
}

const classNameCol = "md:col-span-1 xs:col-span-2";
const getLabelByValue = (value: number|string) => {
  const item = TestOptions.find(item => item.name.toString() === value);
  return item ? item.content : "Không thấy bài test";
};
export const InterviewDetail: React.FC<Props> = ({
  data,
  onClose,
  open,
  handleOpenModal,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] w-full h-auto max-h-[80vh] max-[768px]:overflow-y-scroll bg-white mx-auto">
        <div className="grid grid-cols-6 h-full md:p-8 p-4 gap-4">
          <div className="lg:col-span-4 col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className={classNameCol}>
              <span className="font-bold">Link GG meet: </span>
              <a href={data.linkGGmeet} target="_blank" className="underline">
                {data.linkGGmeet}
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 col-span-6 gap-4 flex flex-col">
            <div className="flex flex-col gap-1">
              <p className="font-bold">Giờ phỏng vấn</p>
              {new Date(data.interviewTime).toLocaleString("vi", { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold">Bài test</p>
              <a href={getLabelByValue(data.test)} target="_blank" className="underline">
              {getLabelByValue(data.test)}
              </a>
            </div>
            <div className="flex items-center justify-center min-w-">
              <Tooltip title="Chuyển đơn tuyển sang thành viên chính thức">
                <IconButton
                  onClick={() => {
                    handleOpenModal(data, ACTIONS["ACCEPT"] as ActionType);
                  }}
                >
                  <PeopleAltIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Loại đơn tuyển">
                <IconButton
                  onClick={() => {
                    handleOpenModal(data, ACTIONS["REJECT"] as ActionType);
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
