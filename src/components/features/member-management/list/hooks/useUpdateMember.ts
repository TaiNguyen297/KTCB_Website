import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MemberPositionDto } from "@/pages/api/member_management";

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: MemberPositionDto) => {
      const response = await fetch(`${baseUrl}/api/member_management`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
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
