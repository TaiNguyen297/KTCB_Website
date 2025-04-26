import React from "react";
import { IMemberList } from "./MemberListTable";
import { Modal } from "@mui/material";
import { Member } from "@prisma/client";

interface Props {
  data: Member;
  open: boolean;
  onClose: () => void;
}

const classNameCol = "md:col-span-1 xs:col-span-2";

export const MemberDetail: React.FC<Props> = ({ data, onClose, open }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] w-full h-auto max-h-[80vh] max-[768px]:overflow-y-scroll bg-white mx-auto">
        <div className="grid grid-cols-6 h-full md:p-8 p-4 gap-5">
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
              <span className="font-bold">Số điện thoại: </span>
              {data.phoneNumber}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Email: </span>
              {data.email}
            </div>
          </div>

          <div className="lg:col-span-2 col-span-6 gap-4 flex flex-col">
            <div className={classNameCol}>
              <span className="font-bold">Nơi làm việc: </span>
              {data.address}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Địa chỉ: </span>
              {data.address}
            </div>
            {/* <div className={classNameCol}>
              <span className="font-bold">Team: </span>
              {data.team}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Vị trí: </span>
              {data.position}
            </div> */}
          </div>

          <div className="lg:col-span-2 col-span-6 gap-4 flex flex-col">
            <div className={classNameCol}>
              <span className="font-bold">Địa chỉ làm việc: </span>
              {data.workPlace}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Ngân hàng: </span>
              {data.bank}
            </div>

            <div className={classNameCol}>
              <span className="font-bold">Số tài khoản ngân hàng: </span>
              {data.bankAccount}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
