import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const data = req.body;

        if (!data) {
          return res.status(400).json({ message: "Content not found" });
        }

        const user = await prisma.eventRegistration.create({
          data: {
            fullName: data.full_name,
            birthday: new Date(data.birthday),
            email: data.email,
            phoneNumber: data.phone_number,
            address: data.address,
            workPlace: data.work_place,
            eventId: parseInt(data.event_id),
          },
          include:{
            event: {
              select: {
                title: true,
              }
            }
          }
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
