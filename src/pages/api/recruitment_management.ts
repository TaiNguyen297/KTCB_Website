import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { sendMail } from "@/mailer/mailService";
import { MemberRegistrationStatus } from "@prisma/client";
import mailMemberInterviewPass from "@/mailer/templates/recruit-members/member-interview-pass";
import mailMemberInterviewFail from "@/mailer/templates/recruit-members/member-interview-fail";
import mailMemberFormPass from "@/mailer/templates/recruit-members/member-form-pass";
import mailMemberFormFail from "@/mailer/templates/recruit-members/member-form-fail";

export interface UpdateMemberRegistrationDto {
  id: number;
  status: MemberRegistrationStatus;
  interviewTime?: any;
  test: string;
  email: string;
  type: "FORM" | "INTERVIEW";
}

export interface PassMemberRegistrationDto {
  id: number;
  email: string;
  fullName: string;
  birthday: any;
  phoneNumber: string;
  address: string;
  workPlace: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "PATCH":
        const data: UpdateMemberRegistrationDto = req.body;

        if (!data) {
          return res.status(400).json({ message: "Content not found" });
        }

        const member = await prisma.memberRegistration.update({
          where: {
            id: data.id,
          },
          data: {
            status: data.status,
          },
        });

        await sendMail(
          [data.email],
          "MỜI PHỎNG VẤN THÀNH VIÊN KHOẢNG TRỜI CỦA BÉ",
          mailMemberFormPass(member)
        );

        return res.status(201).json(member);

      case "GET":
        const interviews = await prisma.memberRegistration.findMany({
          where: {
            status: "INTERVIEW",
          },
          include: {
            position: {
              select: {
                name: true,
              },
            },
          },
        });

        return res.status(200).json(interviews);

      case "POST":
        const passMember: PassMemberRegistrationDto = req.body;
        const memberRegistrations = await prisma.memberRegistration.findMany(
          {
            where: {
              id: passMember.id,
            },
          }
        );
        let transferredIds = [];

        for (const registration of memberRegistrations) {
          await prisma.member.create({
            data: {
              fullName: registration.fullName,
              birthday: registration.birthday,
              phoneNumber: registration.phoneNumber,
              email: registration.email,
              address: registration.address,
              workPlace: registration.workPlace,
              bank: "", 
              bankAccount: "",
              avatar: "", 
            },
          });

          transferredIds.push(registration.id);
          await sendMail(
            [registration.email],
            "KẾT QUẢ TRÚNG TUYỂN THÀNH VIÊN KHOẢNG TRỜI CỦA BÉ",
            mailMemberInterviewPass(registration)
          );
        }

        await prisma.memberRegistration.deleteMany({
          where: {
            id: {
              in: transferredIds, 
            },
          },
        });

        return res.status(201).json({ transferredIds });

      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
