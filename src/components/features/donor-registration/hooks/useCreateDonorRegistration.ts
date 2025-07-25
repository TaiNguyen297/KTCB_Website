import { useMutation } from "@tanstack/react-query";
import { DonorRegistrationInputType } from "../types";

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const useCreateDonorRegistration = () => {
  return useMutation({
    mutationKey: ["createDonorRegistration"],
    mutationFn: async (data: DonorRegistrationInputType) => {
      const response = await fetch(`${baseUrl}/api/donor_registration`, {
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
