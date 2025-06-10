import { useMutation } from "@tanstack/react-query";
import { ProfileInputType } from "../types";

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (data: ProfileInputType & { id: number }) => {
      const response = await fetch(`${baseUrl}/api/profile_update`, {
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
  });
};
