import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateEventDto } from "@/pages/api/event_management";

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: UpdateEventDto) => {
      const response = await fetch("/api/event_management", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
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
