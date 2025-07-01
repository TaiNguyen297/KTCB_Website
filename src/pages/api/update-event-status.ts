import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { getEventStatusByDate } from "@/utils/eventStatus";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Lấy tất cả events
    const events = await prisma.event.findMany();
    
    let updatedCount = 0;
    
    // Cập nhật trạng thái cho từng event
    for (const event of events) {
      const newStatus = getEventStatusByDate(event.startDate, event.endDate);
      
      // Chỉ cập nhật nếu trạng thái thay đổi
      if (event.status !== newStatus) {
        await prisma.event.update({
          where: { id: event.id },
          data: { status: newStatus }
        });
        updatedCount++;
        console.log(`Updated event ${event.id} (${event.title}) from ${event.status} to ${newStatus}`);
      }
    }
    
    return res.status(200).json({ 
      message: `Đã cập nhật trạng thái cho ${updatedCount} sự kiện`,
      updatedCount,
      totalEvents: events.length
    });
    
  } catch (error) {
    console.error("Error updating event statuses:", error);
    return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái sự kiện" });
  }
}
