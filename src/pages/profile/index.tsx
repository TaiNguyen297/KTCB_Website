import { Profile } from "@/components/features/profile";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import React from "react";

const ProfilePage = () => {
  return (
    <>
      <DefaultSeo {...SEO} title="Thông tin cá nhân" />
      <Profile />
    </>
  );
};

export default ProfilePage;
