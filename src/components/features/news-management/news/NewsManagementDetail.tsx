import { INews } from "@/@types/news";
import { getHighlightNews } from "@/utils/common";
import { format } from "date-fns";
import { Button, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FC, useState } from "react";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";

interface NewsManagementDetailProps {
  data: INews;
  onDelete: (slug: string) => void;
  onEdit: (news: INews) => void;
}

export const NewsManagementDetail: FC<NewsManagementDetailProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const classNameCol =
    "rounded-md shadow-sm p-2 bg-gray-50 border border-gray-100";

  const handleDelete = () => {
    onDelete(data.slug);
    setConfirmDelete(false);
    setIsOpen(false);
    setSuccessToast(true);
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="news-detail-modal"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[80vw] w-full h-auto max-h-[80vh] max-[768px]:overflow-y-scroll bg-white mx-auto rounded-xl shadow-lg" style={{ zIndex: 9999 }}>
          <div className="grid grid-cols-6 h-full md:p-8 p-4 gap-4">
            <div className="lg:col-span-3 col-span-6 gap-4 flex flex-col">
              <div className={classNameCol}>
                <span className="font-bold">Tiêu đề: </span>
                {data.title}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Thời gian đăng: </span>
                {format(new Date(data.time), "dd/MM/yyyy")}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Tác giả: </span>
                {data.author || "Không có"}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Slug: </span>
                {data.slug}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Teams: </span>
                {/* {data.team.join(", ")} */}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Tags: </span>
                {data.tags.length > 0 ? data.tags.join(", ") : "Không có"}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Bài viết nổi bật: </span>
                {data.is_highlight ? "Có" : "Không"}
              </div>
            </div>

            <div className="lg:col-span-3 col-span-6 gap-4 flex flex-col">
              <div className={`${classNameCol} h-52 overflow-hidden`}>
                <span className="font-bold">Ảnh bìa: </span>
                <div className="mt-2 h-40 overflow-hidden">
                  <img 
                    src={data.banner_url} 
                    alt={data.title} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </div>
              <div className={`${classNameCol} flex-1`}>
                <span className="font-bold">Mô tả: </span>
                <p className="mt-1">{data.description}</p>
              </div>
            </div>

            <div className="col-span-6 flex justify-end gap-2 mt-4">
              {!confirmDelete ? (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setConfirmDelete(true)}
                  >
                    Xóa bài viết
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setIsOpen(false);
                      onEdit(data);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-red-500 font-medium mr-2 flex items-center">
                    Bạn có chắc chắn muốn xóa bài viết này?
                  </div>
                  <Button
                    variant="outlined"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                  >
                    Xác nhận xóa
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <ToastSuccess
        open={successToast}
        onClose={() => setSuccessToast(false)}
        heading="Thành công"
        content="Đã xóa bài viết thành công"
      />

      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 underline text-sm"
      >
        Chi tiết
      </button>
    </>
  );
};
