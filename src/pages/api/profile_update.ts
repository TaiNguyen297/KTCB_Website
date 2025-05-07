import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "PATCH":
        const data = req.body;

        if (!data) {
          return res.status(400).json({ message: "Content not found" });
        }

        const user = await prisma.member.update({
          where: { id: data.id },
          data: {
            fullName: data.full_name,
            birthday: new Date(data.birthday),
            email: data.email,
            phoneNumber: data.phone_number,
            bankAccount: data.bank_account,
            address: data.address,
            bank: data.bank,
            workPlace: data.work_place,
          },
        });

        return res.status(201).json(user);
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
