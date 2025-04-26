import { MemberRegistration } from "@/components/features/member-registration";
import { SEO } from "@/configs/seo.config";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import React from "react";

const MemberRegistrationPage: NextPage = () => {
  return <>
    <DefaultSeo {...SEO} title="Đăng ký thành viên" />
    <MemberRegistration />
  </>;
};

export default MemberRegistrationPage;
