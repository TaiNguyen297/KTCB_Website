import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { memberId } = req.query;

      if (!memberId || Array.isArray(memberId)) {
        return res.status(400).json({ message: "memberId hợp lệ là bắt buộc" });
      }

      // Tìm user từ memberId
      const user = await prisma.user.findUnique({
        where: { memberId: Number(memberId) },
        select: {
          id: true,
          username: true,
          email: true,
          roleId: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản cho thành viên này" });
      }

      return res.status(200).json({
        userId: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.name,
      });
    }

    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
}
