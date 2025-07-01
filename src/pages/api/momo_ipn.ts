import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const body = req.body;
  // Nếu dùng bodyParser mặc định, body có thể là string, cần parse lại
  const data = typeof body === "string" ? JSON.parse(body) : body;

  // Log dữ liệu callback từ MoMo để kiểm tra
  console.log("MoMo IPN callback:", data);
  console.log("orderId từ MoMo:", data.orderId, "transId từ MoMo:", data.transId);

  // Chỉ lưu khi thanh toán thành công
  if (data.resultCode === 0) {
    try {
      // Decode thông tin donor từ extraData
      let donorInfo = null;
      if (data.extraData) {
        try {
          const decodedData = Buffer.from(data.extraData, 'base64').toString('utf-8');
          donorInfo = JSON.parse(decodedData);
        } catch (error) {
          console.error("Error decoding donor info:", error);
        }
      }

      // Tạo bản ghi Donation mới
      if (donorInfo) {
        const donation = await prisma.donation.create({
          data: {
            amount: Number(data.amount),
            donorName: donorInfo.fullName,
            donorEmail: donorInfo.email,
            paymentMethod: donorInfo.paymentMethod || "MOMO",
            eventId: donorInfo.eventId,
            orderId: data.orderId,
          },
        });
      } else {
        console.error("No donor info found in extraData");
      }
    } catch (error) {
      console.error("Error creating donation:", error);
    }
  }

  // Trả về đúng format cho MoMo
  return res.status(200).json({ resultCode: 0, message: "Confirm Success" });
}
