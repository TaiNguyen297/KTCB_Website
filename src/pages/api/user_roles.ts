import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export interface UpdateUserRoleDto {
  userId: number;
  roleId: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        const { userId } = req.query;
        
        if (!userId || Array.isArray(userId)) {
          return res.status(400).json({ message: "userId hợp lệ là bắt buộc" });
        }
        
        // Lấy thông tin user và role của họ
        const user = await prisma.user.findUnique({
          where: { id: Number(userId) },
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        });
        
        if (!user) {
          return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        
        return res.status(200).json({
          roleId: user.roleId,
          roleName: user.role.name,
          permissions: user.role.permissions,
        });
      }
      
      case "PUT": {
        const { userId, roleId }: UpdateUserRoleDto = req.body;
        
        if (!userId || !roleId) {
          return res.status(400).json({ message: "userId và roleId là bắt buộc" });
        }
        
        // Kiểm tra role tồn tại
        const roleExists = await prisma.role.findUnique({
          where: { id: roleId },
        });
        
        if (!roleExists) {
          return res.status(404).json({ message: "Vai trò không tồn tại" });
        }
        
        // Cập nhật vai trò cho user
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { roleId },
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        });
        
        return res.status(200).json({
          message: "Cập nhật vai trò thành công",
          roleId: updatedUser.roleId,
          roleName: updatedUser.role.name,
          permissions: updatedUser.role.permissions,
        });
      }
      
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
}
