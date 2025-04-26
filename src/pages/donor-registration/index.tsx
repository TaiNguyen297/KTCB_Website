import { DonorRegistration } from "@/components/features/donor-registration";
import { SEO } from "@/configs/seo.config";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import React from "react";

const DonorRegistrationPage: NextPage = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Đăng ký nhà hảo tâm" />
      <DonorRegistration />
    </>
  );
};

export default DonorRegistrationPage;
