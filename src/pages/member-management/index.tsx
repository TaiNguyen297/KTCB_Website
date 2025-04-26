import { MemberManagementTable } from "@/components/features/member-management";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { SEO } from "@/configs/seo.config";
import { Typography } from "@mui/material";
import { DefaultSeo } from "next-seo";
import React from "react";

const MemberManagementPage = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <ContainerXL>
      <div className="flex flex-col mt-9 gap-4">
        <DefaultSeo {...SEO} title="Quản lý thành viên" />
        <ToastSuccess
          open={open}
          onClose={() => setOpen(false)}
          heading="Xác nhận thành công"
          content="Cảm ơn đã gửi thông tin"
        />

        <MemberManagementTable />
      </div>
    </ContainerXL>
  );
};

export default MemberManagementPage;
