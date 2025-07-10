import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { EventStatus } from "@prisma/client";
import { updateEventsStatus, updateEventStatus } from "@/utils/eventStatus";

export interface DeleteEventDto {
  id: number;
}

export interface UpdateEventDto {
  id: number;
  title: string;
  type: "VOLUNTEER" | "DONATION";
  startDate: Date;
  endDate: Date;
  location: string;
  mapLink: string;
  status: EventStatus;
  image: string;
  description: string;
  goalAmount?: number; 
  postId?: number; // Thêm trường postId nếu cần liên kết với bài viết
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

        const event = await prisma.event.create({
          data: {
            title: data.title,
            type: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: data.status,
            location: data.location,
            mapLink: data.mapLink,
            image: data.image,
            description: data.description,
            goalAmount: data.goalAmount,
            postId: data.postId,
          }
        });

        return res.status(201).json(event);
        }

        if(type == "register"){
          const data = req.body;

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

        if(type == "eventResult") {
          const data = req.body;
         
          const eventResult = await prisma.eventResult.create({
            data: {
              event: { connect: { id: Number(data.eventId) } },
              totalDonation: data.totalDonation,
              totalParticipant: data.totalParticipant,
              summary: data.summary,
              totalHour: data.totalHours,
              resultImages: Array.isArray(data.resultImages) ? data.resultImages : [],
              achievements: Array.isArray(data.achievements) ? data.achievements : [],
            },
          });
          return res.status(201).json(eventResult);
        }

     case "GET": {
        const { type, id } = req.query;

        if (type === "event" && id) {
          // Lấy chi tiết 1 event kèm báo cáo
          const event = await prisma.event.findUnique({
            where: { id: Number(id) },
            include: {
              eventRegistrations: true,
              eventResult: true,
              donations: true, // Include donations để tính tổng
            },
          });
          if (!event) return res.status(404).json({ message: "Không tìm thấy sự kiện" });
          
          // Tính tổng amount từ donations
          const eventWithAmount = {
            ...event,
            amount: event.donations.reduce((sum, donation) => sum + donation.amount, 0),
            // Giữ lại donations array cho event detail
          };
          
          // Tự động cập nhật trạng thái dựa theo thời gian
          const eventWithUpdatedStatus = updateEventStatus(eventWithAmount);
          
          return res.status(200).json(eventWithUpdatedStatus);
        }

        if (type === "event") {
          const events = await prisma.event.findMany({
            include: {
              eventResult: true,
              donations: true, // Include donations để tính tổng
              _count: {
                select: {
                  eventRegistrations: true
                }
              }
            }
          });
          
          // Tính tổng amount từ donations cho mỗi event
          const eventsWithAmount = events.map(event => {
            const totalAmount = event.donations.reduce((sum, donation) => sum + donation.amount, 0);
            console.log(`Event ${event.id} (${event.title}): ${event.donations.length} donations, total: ${totalAmount}`);
            return {
              ...event,
              amount: totalAmount,
              // Không trả về donations array để giảm dung lượng response
              donations: undefined
            };
          });
          
          // Tự động cập nhật trạng thái dựa theo thời gian
          const eventsWithUpdatedStatus = updateEventsStatus(eventsWithAmount);
          
          console.log("Final events with amount and status:", eventsWithUpdatedStatus.map(e => ({ id: e.id, title: e.title, amount: e.amount, status: e.status })));
          
          return res.status(200).json(eventsWithUpdatedStatus);
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
        const { type } = req.query;
        
        if (type === "eventResult") {
          const updateData = req.body;

          const updated = await prisma.eventResult.update({
            where: { id: Number(updateData.id) },
            data: {
              totalDonation: updateData.totalDonation,
              totalParticipant: updateData.totalParticipant,
              totalHour: updateData.totalHours,
              summary: updateData.summary,
              resultImages: Array.isArray(updateData.resultImages) ? updateData.resultImages : [],
              achievements: Array.isArray(updateData.achievements) ? updateData.achievements : [],
            },
          });
          return res.status(200).json(updated);
        }

        if (type === "event") {
          const data: UpdateEventDto = req.body;
          
          const event = await prisma.event.update({
            where: {
              id: data.id,
            },
            data: {
              title: data.title,
              type: data.type,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
              location: data.location,
              mapLink: data.mapLink,
              status: data.status,
              image: data.image,
              description: data.description,
              goalAmount: data.goalAmount,
              postId: data.postId,
            },
          });
          return res.status(201).json(event);
        }
      }

      case "PATCH": {
          const deleteData : DeleteEventDto = req.body;  

          const deleteEvent = await prisma.event.delete({
            where: {
              id: deleteData.id,
            },
          });
          return res.status(200).json(deleteEvent);
      }

      case "DELETE": {
        const { type, id } = req.query;
        
        if (type === "eventResult") {
          const deletedReport = await prisma.eventResult.delete({
            where: { id: Number(id) },
          });
          return res.status(200).json({ message: "Xóa báo cáo thành công", data: deletedReport });
        }
        
        return res.status(400).json({ message: "Loại xóa không hợp lệ" });
      }
        
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
