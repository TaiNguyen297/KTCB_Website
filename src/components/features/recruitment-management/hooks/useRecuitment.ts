import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateMemberRegistrationDto } from "@/pages/api/recruitment_management";

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const useRecruitment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateMemberRegistration"],
    mutationFn: async (data: UpdateMemberRegistrationDto) => {
      const response = await fetch(`${baseUrl}/api/recruitment_management`, {
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
        queryKey: ["memberRegistration"],
      });
      queryClient.invalidateQueries({
        queryKey: ["personInterview"],
      });
    },
  });
};
