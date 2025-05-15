import { format } from "date-fns";
import { IEventRegistration } from "./RegisterTable";

interface RegisterDetailProps {
  open: boolean;
  onClose: () => void;
  data: IEventRegistration;
}

export const RegisterDetail = ({ open, onClose, data }: RegisterDetailProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "visible" : "invisible"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">Chi tiết đăng ký</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">Họ và tên:</p>
            <p>{data.fullName}</p>
          </div>
          <div>
            <p className="font-bold">Ngày sinh:</p>
            <p>{format(new Date(data.birthday), "dd/MM/yyyy")}</p>
          </div>
          <div>
            <p className="font-bold">Số điện thoại:</p>
            <p>{data.phoneNumber}</p>
          </div>
          <div>
            <p className="font-bold">Email:</p>
            <p>{data.email}</p>
          </div>
          <div>
            <p className="font-bold">Địa chỉ:</p>
            <p>{data.address}</p>
          </div>
          <div>
            <p className="font-bold">Nơi công tác:</p>
            <p>{data.workPlace}</p>
          </div>
          <div className="col-span-2">
            <p className="font-bold">Sự kiện đăng ký:</p>
            <p>{data.event.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 