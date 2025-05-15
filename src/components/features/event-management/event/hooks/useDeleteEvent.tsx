import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteEventDto } from "@/pages/api/event_management";

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteEventDto) => {
      const response = await fetch("/api/event_management", {
        method: "PATCH",
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
        // invalidate lại để memberList tự động reload
        queryClient.invalidateQueries(["eventList"]);
      },
  });
};