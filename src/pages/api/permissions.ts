import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // Lấy tất cả permissions
      const permissions = await prisma.permission.findMany();
      return res.status(200).json(permissions);
    }

    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
}
