import { ChangePassword } from "@/components/features/change-password";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import React from "react";

const ChangePasswordPage = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Đổi mật khẩu" />
      <ChangePassword />
    </>
  );
};

export default ChangePasswordPage;
