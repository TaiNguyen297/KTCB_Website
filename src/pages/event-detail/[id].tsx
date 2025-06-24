import { Box, Typography, Divider, Chip } from "@mui/material";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import prisma from "@/libs/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.params?.id;
  if (!postId) return { notFound: true };
  // Tìm event có postId này
  const event = await prisma.event.findFirst({
    where: { postId: Number(postId) },
    include: { post: true },
  });
  if (!event) return { notFound: true };
  // Chuyển đổi các trường Date thành string để tránh lỗi serialize
  const safeEvent = {
    ...event,
    startDate: event.startDate ? event.startDate.toISOString() : null,
    endDate: event.endDate ? event.endDate.toISOString() : null,
  };
  return { props: { event: safeEvent } };
};

export default function EventDetailPage({ event }: { event: any }) {
  // event: dữ liệu sự kiện đã fetch từ server (bao gồm cả bài viết chi tiết nếu có)
  return (
    <Box maxWidth={900} mx="auto" py={4}>
      <Box sx={{ position: "relative", width: "100%", height: 350, mb: 3 }}>
        <Image src={event?.image} alt={event?.title} layout="fill" objectFit="cover" />
      </Box>
      <Typography variant="h4" fontWeight="bold" mb={2}>{event?.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={1}>
        {format(new Date(event.startDate), "dd/MM/yyyy")} - {format(new Date(event.endDate), "dd/MM/yyyy")} | Địa điểm: {event.location}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {/* Nếu có bài viết chi tiết thì render nội dung bài viết */}
      {event.post && (
        <Box>
          <Typography variant="h5" fontWeight="bold" mb={2}>{event.post.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>{event.post.summary}</Typography>
          <Box mb={2}>
            <div dangerouslySetInnerHTML={{ __html: event.post.content || "" }} />
          </Box>
        </Box>
      )}
      {/* Nếu không có bài viết thì render mô tả mặc định */}
      {!event.post && (
        <Typography variant="body1">{event.description}</Typography>
      )}
    </Box>
  );
}
