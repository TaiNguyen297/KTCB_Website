import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { sendMail } from "@/mailer/mailService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id, action } = req.body;
    if (!id || !action)
      return res.status(400).json({ message: "Missing id or action" });
    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!registration) return res.status(404).json({ message: "Not found" });
    if (action === "approve") {
      // Gửi mail duyệt
      await sendMail(
        [registration.email],
        "CẢM ƠN BẠN ĐÃ ĐĂNG KÝ THAM GIA SỰ KIỆN",
        `<p>Chào ${registration.fullName},</p>
                 <p>Cảm ơn bạn đã đăng ký tham gia sự kiện <strong>${registration.event.title}</strong>.</p>
                 <p>Chúng tôi rất vui mừng thông báo rằng đơn đăng ký của bạn đã được duyệt.</p>
                 <p>Hẹn gặp bạn tại sự kiện!</p>
                 <p>Trân trọng,</p>
                 <p>Khoảng Trời Của Bé</p>`
      );
      return res.status(200).json({ success: true });
    }
    if (action === "reject") {
      // Gửi mail từ chối
      await sendMail(
        [registration.email],
        "ĐĂNG KÝ THAM GIA SỰ KIỆN CỦA BẠN ĐÃ BỊ TỪ CHỐI",
        `<p>Chào ${registration.fullName},</p>
         <p>Rất tiếc, đăng ký tham gia sự kiện <strong>${registration.event.title}</strong> của bạn đã bị từ chối.</p>
         <p>Chúng tôi hy vọng sẽ có cơ hội làm việc với bạn trong tương lai.</p>
         <p>Trân trọng,</p>
         <p>Khoảng Trời Của Bé</p>`
      );
      await prisma.eventRegistration.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ message: "Invalid action" });
  }
  return res.status(405).end();
}
