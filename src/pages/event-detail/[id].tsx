import { Box, Typography, Divider, Container, Stack } from "@mui/material";
import { format } from "date-fns";
import Image from "next/image";
import logoImg from "../../../public/ktcb-logo-512.png";
import { GetServerSideProps } from "next";
import prisma from "@/libs/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.params?.id;
  if (!postId || isNaN(Number(postId))) return { notFound: true };
  // Tìm event có postId này
  const event = await prisma.event.findFirst({
    where: { postId: Number(postId) },
    include: { post: true },
  });
  if (!event || !event.postId) return { notFound: true };
  // Chuyển đổi các trường Date thành string để tránh lỗi serialize
  const safeEvent = {
    ...event,
    startDate: event.startDate ? event.startDate.toISOString() : null,
    endDate: event.endDate ? event.endDate.toISOString() : null,
  };
  return { props: { event: safeEvent } };
};

export default function EventDetailPage({ event }: { event: any }) {
  return (
    <>
      <Box className="relative" sx={{ width: "100%", position: "relative" }}>
        <Image
          className="banner"
          src={event?.post.image}
          alt={event?.title || "KTCB Event"}
          width={1920}
          height={500}
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
            position: "relative",
          }}
          priority
        />
      </Box>
      <Container maxWidth="xl">
        <section className="news lg:pt-4 pt-4 mb-5">
          <div className="flex flex-wrap">
            <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-6 lg:w-3/4 pr-4 pl-4 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="news-posted">
                  {event.startDate &&
                    format(new Date(event.startDate), "dd/MM/yyyy")}{" "}
                  -{" "}
                  {event.endDate &&
                    format(new Date(event.endDate), "dd/MM/yyyy")}
                </span>
                <strong>{event.author || "Nguyễn Hữu Tài"}</strong>
              </div>
              <h1 className="news-title text-4xl">{event?.title}</h1>
              {/* Nếu có bài viết chi tiết thì render nội dung bài viết */}
              {event.post ? (
                <Box mb={2}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={2}
                  >
                    {event.post.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    mb={2}
                  >
                    {event.post.summary}
                  </Typography>
                  <Box mb={2} id="content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: event.post.content || "",
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1">{event.description}</Typography>
              )}
            </div>
            {/* Sidebar: có thể thêm tin liên quan ở đây nếu muốn */}
            <div className="flex flex-col align-center justify-start gap-4 lg:px-6 lg:w-1/4 pr-4 pl-4 w-full lg:mt-0 mt-4">
              {/* Để trống hoặc render các sự kiện liên quan nếu muốn */}
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
