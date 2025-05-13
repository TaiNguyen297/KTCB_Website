import { useMutation } from "@tanstack/react-query";
import { EventInputType } from "../types";

export const useCreateEventRegistration = () => {
  return useMutation({
    mutationKey: ["createDonorRegistration"],
    mutationFn: async (data: EventInputType) => {
      const response = await fetch("/api/volunteer_event", {
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
  });
};
