// pages/api/payment.js
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

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

  const orderId = `ORDER_${Date.now()}`;
  const requestId = `${Date.now()}`;
  const orderInfo = "Thanh toán MoMo";
  const amount = req.body.amount; // amount should be an integer, as sent from the frontend
  const extraData = "";

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=${MOMO_REQUEST_TYPE}`;

  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY!)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
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
