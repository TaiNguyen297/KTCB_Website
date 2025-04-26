import { MemberListTable } from "@/components/features/member-management";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import React from "react";
import { getMemberList } from "@/components/features/member-management/list/service/get-member-list";

const MemberListPage = () => {
  const [open, setOpen] = React.useState(false);
  const { data } = useQuery({
    queryKey: ["memberList"],
    queryFn: () => getMemberList(),
  });

  console.log(data);

  return (
    <ContainerXL>
      <div className="flex flex-col mt-9 gap-4">
        <DefaultSeo {...SEO} title="Danh sách thành viên" />
        <ToastSuccess
          open={open}
          onClose={() => setOpen(false)}
          heading="Xác nhận thành công"
          content="Cảm ơn đã gửi thông tin"
        />
        <MemberListTable data={data} />
      </div>
    </ContainerXL>
  );
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["memberList"], getMemberList);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default MemberListPage;
