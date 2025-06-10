import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemberDto } from "@/pages/api/member_management";

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: deleteMemberDto) => {
      const response = await fetch(`${baseUrl}/api/member_management`, {
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
        queryClient.invalidateQueries(["memberList"]);
      },
  });
};