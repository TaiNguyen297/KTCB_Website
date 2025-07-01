// pages/api/payment.js
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_API_ENDPOINT,
    MOMO_REDIRECT_URL,
    MOMO_IPN_URL,
    MOMO_REQUEST_TYPE,
    MOMO_LANG,
  } = process.env;

  const { amount, orderInfo, orderId, donorInfo } = req.body;
  const finalOrderId = orderId || `ORDER_${Date.now()}`;
  const requestId = `${Date.now()}`;
  const finalOrderInfo = orderInfo || "Thanh toán MoMo";
  
  // Lưu thông tin donor tạm thời để sử dụng khi callback
  // Chúng ta sẽ encode donorInfo vào extraData
  const extraData = donorInfo ? Buffer.from(JSON.stringify(donorInfo)).toString('base64') : "";

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_IPN_URL}&orderId=${finalOrderId}&orderInfo=${finalOrderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=${MOMO_REQUEST_TYPE}`;

  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY!)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId: finalOrderId,
    orderInfo: finalOrderInfo,
    redirectUrl: MOMO_REDIRECT_URL,
    ipnUrl: MOMO_IPN_URL,
    extraData,
    requestType: MOMO_REQUEST_TYPE,
    signature,
    lang: MOMO_LANG,
  };

  const response = await fetch(MOMO_API_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  console.log("MoMo response:", result);

  return res.status(200).json(result);
}
