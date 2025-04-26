import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMemberList } from "../MemberListTable";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: IMemberList) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      return Promise.resolve();
    },

    onMutate: (newMemberInfo: IMemberList) => {
      queryClient.setQueryData(["members"], (prevUsers: any) =>
        prevUsers?.map((prevUser: IMemberList) =>
          prevUser.full_name === newMemberInfo.full_name
            ? newMemberInfo
            : prevUser
        )
      );
    },

  });
};
