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
            event: {
              connect: {
                id: data.eventId,
              },
            },
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

     case "GET": {
        const { type } = req.query;

        if (type === "event") {
          const events = await prisma.volunteerEvents.findMany();
          return res.status(200).json(events);
        }

        if (type === "registration") {
          const registrations = await prisma.eventRegistration.findMany();
          return res.status(200).json(registrations);
        }

        return res.status(400).json({ message: "Invalid type" });
      }
        
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
