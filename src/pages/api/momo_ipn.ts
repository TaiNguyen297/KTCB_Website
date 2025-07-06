import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log toàn bộ thông tin request để debug IPN MoMo
  console.log("[MoMo IPN] Incoming request:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    ip: req.socket?.remoteAddress,
    body: req.body,
  });
  

  if (req.method !== "POST") {
    console.error("[MoMo IPN] Method not allowed:", req.method);
    return res.status(405).json({ resultCode: 1, message: "Method Not Allowed" });
  }

  const data = req.body;

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
        console.log("[MoMo IPN] Donation created:", donation);
      } else {
        console.error("No donor info found in extraData");
      }
    } catch (error) {
      console.error("Error creating donation:", error);
    }
  }

  // Trả về đúng format cho MoMo
  console.log("[MoMo IPN] Response sent to MoMo");
  return res.status(200).json({ resultCode: 0, message: "Confirm Success" });
}
