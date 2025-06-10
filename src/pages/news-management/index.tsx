import { INews } from "@/@types/news";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import { SEO } from "@/configs/seo.config";
import { useSession } from "next-auth/react";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import AddIcon from "@mui/icons-material/Add";
import { NewsManagementTable } from "@/components/features/news-management/news/NewsManagementTable";
import { NewsFormModal } from "@/components/features/news-management/news/NewsFormModal";
import { getNewsList, createNews, updateNews, deleteNews } from "@/components/features/news-management/news/service/news-service";

const NewsManagementPage: NextPage = () => {
  const { data: session } = useSession();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<INews | null>(null);
  const [successToast, setSuccessToast] = useState({
    open: false,
    message: "",
  });

  // Query to get news data
  const { data: newsData = [], refetch } = useQuery({
    queryKey: ["newsList"],
    queryFn: getNewsList,
  });

  // Handle form submission (create or update)
  const handleSubmit = async (formData: any) => {
    try {
      if (editingNews) {
        // Update existing news
        await updateNews({
          slug: editingNews.slug,
          title: formData.title,
          description: formData.description,
          banner_url: formData.banner_url,
          author: formData.author,
          tags: formData.tags,
          team: formData.team,
          is_highlight: formData.is_highlight,
        });
        setSuccessToast({
          open: true,
          message: "Cập nhật bài viết thành công",
        });
      } else {
        // Create new news
        await createNews({
          title: formData.title,
          description: formData.description,
          banner_url: formData.banner_url,
          author: formData.author,
          tags: formData.tags,
          team: formData.team,
          is_highlight: formData.is_highlight,
        });
        setSuccessToast({
          open: true,
          message: "Thêm bài viết mới thành công",
        });
      }

      // Close the form and refresh data
      setIsFormOpen(false);
      setEditingNews(null);
      refetch();
    } catch (error) {
      console.error("Error submitting news:", error);
      // Handle error
    }
  };

  // Handle delete news
  const handleDelete = async (slug: string) => {
    try {
      await deleteNews(slug);
      setSuccessToast({
        open: true,
        message: "Xóa bài viết thành công",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  // Handle edit news
  const handleEdit = (news: INews) => {
    setEditingNews(news);
    setIsFormOpen(true);
  };

  return (
    <ContainerXL>
      <div className="flex flex-col mt-9 gap-4">
        <DefaultSeo {...SEO} title="Quản lý bài viết" />
        
        <ToastSuccess
          open={successToast.open}
          onClose={() => setSuccessToast({ open: false, message: "" })}
          heading="Thành công"
          content={successToast.message}
        />

        <div className="flex justify-between items-center">
          <Typography fontSize={28} fontWeight={"bold"}>
            Quản lý bài viết
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingNews(null);
              setIsFormOpen(true);
            }}
            sx={{ minWidth: "180px" }}
          >
            Thêm bài viết
          </Button>
        </div>

        <Box>
          <NewsManagementTable 
            data={newsData} 
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Box>

        <NewsFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingNews(null);
          }}
          onSubmit={handleSubmit}
          editingNews={editingNews}
        />
      </div>
    </ContainerXL>
  );
};

export default NewsManagementPage;

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["newsList"],
    queryFn: getNewsList,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
