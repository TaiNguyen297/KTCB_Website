import { Profile } from "@/components/features/profile";
import { SEO } from "@/configs/seo.config";
import { getServerSession } from "next-auth";
import { DefaultSeo } from "next-seo";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "@/libs/prisma";
import { Member } from "@prisma/client";

interface ProfilePageProps {
  me: Member;
}

const ProfilePage = ({ me }: ProfilePageProps) => {
  console.log(me);

  return (
    <>
      <DefaultSeo {...SEO} title="Thông tin cá nhân" />
      <Profile me={me} />
    </>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("Session:", session);
  console.log("Session User Email:", session?.user?.email);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const me = await prisma.member.findFirst({
    where: { email: session.user.email },
    select: {
      id: true,
      fullName: true,
      email: true,
      bankAccount: true,
      address: true,
      bank: true,
      birthday: true,
      phoneNumber: true,
      workPlace: true,
    },
  });

  console.log("User Data:", me);

  if (!me) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
    },
  };
}