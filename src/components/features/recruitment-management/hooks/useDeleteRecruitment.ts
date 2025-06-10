import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemberRegistrationDto } from "@/pages/api/member_registration";

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const useDeleteRecruitment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["useDeleteRecruitment"],
    mutationFn: async (data: deleteMemberRegistrationDto) => {
      const response = await fetch(`${baseUrl}/api/member_registration`, {
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
      queryClient.invalidateQueries({
        queryKey:  ["memberRegistration"],
      });
      queryClient.invalidateQueries({
        queryKey: ["personInterview"],
      });
    },
  });
};