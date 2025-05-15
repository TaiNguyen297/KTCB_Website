import React from "react";
import { Modal, Box, styled } from "@mui/material";
import { IEvent } from "@/@types/event"; // Đảm bảo bạn có type này
import { format } from "date-fns";

interface Props {
  data: IEvent;
  open: boolean;
  onClose: () => void;
}

const StyledModal = styled(Modal)(({ theme }) => ({
  zIndex: 9999,
  position: 'fixed',
  '& .MuiBackdrop-root': {
    zIndex: 9999
  }
}));

const classNameCol = "md:col-span-1 xs:col-span-2";

export const EventManagementDetail: React.FC<Props> = ({ data, open, onClose }) => {
  return (
    <StyledModal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] w-full h-auto max-h-[80vh] max-[768px]:overflow-y-scroll bg-white mx-auto rounded-xl shadow-lg" style={{ zIndex: 9999 }}>
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
            {data.mapLink && (
              <div className={classNameCol}>
                <span className="font-bold">Link bản đồ: </span>
                <a
                  href={data.mapLink}
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
          
          {data.image && (
            <div className="col-span-6 mt-4">
              <span className="font-bold block mb-2">Hình ảnh sự kiện:</span>
              <div className="flex justify-center">
                <img 
                  src={data.image} 
                  alt={data.title || "Sự kiện"} 
                  className="max-w-full max-h-[300px] object-contain rounded-lg shadow-md" 
                  onError={(e) => { 
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </StyledModal>
  );
};
