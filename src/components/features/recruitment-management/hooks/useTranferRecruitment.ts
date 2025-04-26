import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PassMemberRegistrationDto } from "@/pages/api/recruitment_management";

export const useTranferRecruitment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["useTranferRecruitment"],
    mutationFn: async (data : PassMemberRegistrationDto) => {
      const response = await fetch("/api/recruitment_management", {
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
      queryClient.invalidateQueries({
        queryKey: ["memberRegistration"],
      });
      queryClient.invalidateQueries({
        queryKey: ["personInterview"],
      });
    },
  });
};