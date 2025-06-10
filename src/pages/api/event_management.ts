import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { EventStatus } from "@prisma/client";

export interface DeleteEventDto {
  id: number;
}

export interface UpdateEventDto {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  mapLink: string;
  status: EventStatus;
  image: string;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const { type } = req.query;

        if(type == "event"){
          const data = req.body;

        if (!data) {
          return res.status(400).json({ message: "Content not found" });
        }

        const event = await prisma.volunteerEvents.create({
          data: {
            title: data.title,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: data.status,
            location: data.location,
            mapLink: data.mapLink,
            image: data.image,
            description: data.description,
          }
        });

        return res.status(201).json(event);
        }

        if(type == "register"){
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
        }

     case "GET": {
        const { type } = req.query;

        if (type === "event") {
          const events = await prisma.volunteerEvents.findMany({
            include: {
              _count: {
                select: {
                  eventRegistrations: true
                }
              }
            }
          });
          return res.status(200).json(events);
        }

        if (type === "registration") {
          const registrations = await prisma.eventRegistration.findMany({
            include: {
              event: {
                select: {
                  title: true,
                },
              },
            },
          });
          return res.status(200).json(registrations);
        }

        return res.status(400).json({ message: "Invalid type" });
      }

      case "PUT": {
        const data: UpdateEventDto = req.body;
        if (!data) {
          return res.status(400).json({ message: "Content not found" });
        }
        const event = await prisma.volunteerEvents.update({
          where: {
            id: data.id,
          },
          data: {
            title: data.title,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            location: data.location,
            mapLink: data.mapLink,
            status: data.status,
            image: data.image,
            description: data.description,
          },
        });
        return res.status(201).json(event);
      }

      case "PATCH": {
          const deleteData : DeleteEventDto = req.body;  

          const deleteEvent = await prisma.volunteerEvents.delete({
            where: {
              id: deleteData.id,
            },
          });
          return res.status(200).json(deleteEvent);
      }
        
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
