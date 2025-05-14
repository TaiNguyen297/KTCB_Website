import React from "react";
import { Modal } from "@mui/material";
import { IEvent } from "@/@types/event"; // Đảm bảo bạn có type này
import { format } from "date-fns";

interface Props {
  data: IEvent;
  open: boolean;
  onClose: () => void;
}

const classNameCol = "md:col-span-1 xs:col-span-2";

export const EventManagementDetail: React.FC<Props> = ({ data, open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] w-full h-auto max-h-[80vh] max-[768px]:overflow-y-scroll bg-white mx-auto rounded-xl shadow-lg">
        <div className="grid grid-cols-6 h-full md:p-8 p-4 gap-4">
          <div className="lg:col-span-3 col-span-6 gap-4 flex flex-col">
            <div className={classNameCol}>
              <span className="font-bold">Tên sự kiện: </span>
              {data.title}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Ngày diễn ra: </span>
              {format(new Date(data.date), "dd/MM/yyyy")}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Địa điểm: </span>
              {data.location}
            </div>
            {data.locationLink && (
              <div className={classNameCol}>
                <span className="font-bold">Link bản đồ: </span>
                <a
                  href={data.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Xem trên bản đồ
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 col-span-6 gap-4 flex flex-col">
            <div className={classNameCol}>
              <span className="font-bold">Mô tả: </span>
                {data.description}
            </div>
            <div className={classNameCol}>
              <span className="font-bold">Trạng thái: </span>
              {data.status === "UPCOMING"
                ? "Sắp diễn ra"
                : data.status === "ONGOING"
                ? "Đang diễn ra"
                : "Đã kết thúc"}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
