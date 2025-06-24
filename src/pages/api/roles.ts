import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // Lấy tất cả vai trò và số lượng người dùng mỗi vai trò
      const roles = await prisma.role.findMany({
        include: {
          _count: {
            select: {
              users: true,
            },
          },
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json(roles);
    }

    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
}
