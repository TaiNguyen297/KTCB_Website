import { useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import PostForm from "@/components/features/news/PostForm";
import { getPostList, addPost, updatePost, deletePost } from "@/components/features/news/service/post-service";

export default function NewsManagementPage() {
  const { data = [], refetch } = useQuery({
    queryKey: ["postList"],
    queryFn: getPostList,
  });
  const [openForm, setOpenForm] = useState(false);
  const [rowSelected, setRowSelected] = useState<any>(null);

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
          onClick={async () => {
            if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
              await deletePost(row.original.id);
              refetch();
            }
          }}
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
              if (values.id) {
                await updatePost(values);
              } else {
                await addPost(values);
              }
              setOpenForm(false);
              refetch();
            }}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
