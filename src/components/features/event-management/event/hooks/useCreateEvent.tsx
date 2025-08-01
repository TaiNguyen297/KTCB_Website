import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventStatus, EventType } from "@prisma/client";

interface CreateEventData {
  title: string;
  type: EventType;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  location: string;
  mapLink: string;
  image: string;
  description: string;
  goalAmount?: number;
  postId?: number; // liên kết bài viết
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createEvent"],
    mutationFn: async (data: CreateEventData) => {
      const response = await fetch("/api/event_management?type=event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: () => {
      // Cập nhật lại dữ liệu trên bảng sau khi tạo sự kiện thành công
      queryClient.invalidateQueries(["eventList"]);
    },
  });
};
