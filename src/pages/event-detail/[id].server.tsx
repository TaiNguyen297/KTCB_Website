import { GetServerSideProps } from "next";
import EventDetailPage from "@/pages/event-detail/[id]";
import prisma from "@/libs/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  if (!id) return { notFound: true };
  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: { post: true },
  });
  if (!event) return { notFound: true };
  // Mapping status label/color
  let statusLabel = "";
  let statusColor: any = "default";
  switch (event.status) {
    case "UPCOMING": statusLabel = "Sắp diễn ra"; statusColor = "info"; break;
    case "ONGOING": statusLabel = "Đang diễn ra"; statusColor = "success"; break;
    case "FINISHED": statusLabel = "Đã kết thúc"; statusColor = "error"; break;
    default: statusLabel = "Không xác định";
  }
  return {
    props: {
      event: {
        ...event,
        statusLabel,
        statusColor,
      },
    },
  };
};

export default EventDetailPage;
