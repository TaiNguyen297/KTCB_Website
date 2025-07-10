import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EventRegistrationActionDto {
  id: number;
  action: "approve" | "reject";
}

export const useEventRegistrationAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EventRegistrationActionDto) => {
      const response = await fetch("/api/event_registration_action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      return response.json();
    },

    onSuccess: () => {
      // Invalidate queries để refetch data
      queryClient.invalidateQueries({ queryKey: ["registerList"] });
    },

    onError: (error) => {
      console.error("Event registration action failed:", error);
    },
  });
};
