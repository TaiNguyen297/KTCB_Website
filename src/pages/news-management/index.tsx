import { useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import PostForm from "@/components/features/news/PostForm";
import { getPostList, addPost, updatePost, deletePost } from "@/components/features/news/service/post-service";
import { MODAL_TYPES, useGlobalModalContext } from "@/components/features/global-modal/GlobalModal";
import { ACTIONS, TEXT_TOAST, TEXT_CONFIRM } from "@/utils/constants";

export default function NewsManagementPage() {
  const { showModal } = useGlobalModalContext();
  const { data = [], refetch } = useQuery({
    queryKey: ["postList"],
    queryFn: getPostList,
  });
  const [openForm, setOpenForm] = useState(false);
  const [rowSelected, setRowSelected] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSuccess = (message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
  };

  const handleError = (message: string) => {
    setToastMessage(message);
    setShowErrorToast(true);
  };

  const handleDeletePost = (postId: number) => {
    showModal(MODAL_TYPES.MODAL_CONFIRM, {
      title: "Xác nhận xóa",
      content: TEXT_CONFIRM.DELETE_NEWS,
      onConfirm: async () => {
        try {
          await deletePost(postId);
          refetch();
          handleSuccess(TEXT_TOAST.NEWS_DELETE_SUCCESS);
        } catch (error) {
          handleError(TEXT_TOAST.ERROR);
        }
      },
    });
  };

  const columns: MRT_ColumnDef<any>[] = [
    { accessorKey: "title", header: "Tiêu đề", size: 200 },
    { accessorKey: "slug", header: "Slug", size: 150 },
    { accessorKey: "summary", header: "Mô tả ngắn", size: 250 },
    { accessorKey: "author", header: "Tác giả", size: 120 },
    {
      accessorKey: "published",
      header: "Trạng thái",
      size: 100,
      Cell: ({ cell }) =>
        cell.getValue() ? "Đã đăng" : "Chưa đăng",
    },
  ];

  const table = useTable({
    columns,
    data,
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setRowSelected(row.original);
            setOpenForm(true);
          }}
        >
          Sửa
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => handleDeletePost(row.original.id)}
        >
          Xóa
        </Button>
      </div>
    ),
  });

  return (
    <Box maxWidth={1200} mx="auto" py={2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý bài viết
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setRowSelected(null);
            setOpenForm(true);
          }}
        >
          Thêm bài viết
        </Button>
      </Box>
      <MaterialReactTable table={table} />
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <PostForm
            open={true}
            initialValues={rowSelected}
            onSuccess={async (values) => {
              try {
                if (values.id) {
                  await updatePost(values);
                  handleSuccess(TEXT_TOAST.NEWS_UPDATE_SUCCESS);
                } else {
                  await addPost(values);
                  handleSuccess(TEXT_TOAST.NEWS_CREATE_SUCCESS);
                }
                setOpenForm(false);
                refetch();
              } catch (error) {
                handleError(TEXT_TOAST.ERROR);
              }
            }}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
