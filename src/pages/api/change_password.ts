import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";
import { hash, compareSync } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { ChangePasswordInputType } from "@/components/features/change-password/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST": {
        const data: ChangePasswordInputType = req.body;
       
        // Lấy email từ session
        const session = await getServerSession(req, res, authOptions);
        const email = session?.user?.email;
       
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return res.status(404).json({ message: "Người dùng không tìm thấy" });
        }

        if (!compareSync(data.current_password, user.password)) {
          return res
            .status(400)
            .json({ message: "Mật khẩu hiện tại không chính xác" });
        }
        
        const password = await hash(data.new_password, 12);
        await prisma.user.update({
          where: { email },
          data: { password },
        });
        return res.status(200).json({ success: true });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Có vấn đề xảy ra" });
  }
}