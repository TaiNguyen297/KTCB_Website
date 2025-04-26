import { useMutation } from "@tanstack/react-query";
import { DonorRegistrationInputType } from "../types";

export const useCreateDonorRegistration = () => {
  return useMutation({
    mutationKey: ["createDonorRegistration"],
    mutationFn: async (data: DonorRegistrationInputType) => {
      const response = await fetch("/api/donor_registration", {
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
