import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export interface MemberPositionDto {
    id: number;
    positionId: number;
    teamId: number;
}

export interface deleteMemberDto { 
    id: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Content not found" });
        }

        switch (req.method) {
            case "GET":
                const member = await prisma.member.findMany({
                    where: {
                        id: req.body.id,
                    },
                    include: {
                        position: {
                            select: {
                                name: true,
                            },
                        },
                        team: {
                            select: {
                                name: true,
                            },
                        }
                    }
                });

                return res.status(200).json(member);

            case "PUT":
                const data: MemberPositionDto = req.body;
                  
                if (!data || typeof data.id !== "number") {
                      return res.status(400).json({ message: "ID is required" });
                }
                  
                const updateData: any = {};
                if (typeof data.teamId === "number") {
                      updateData.teamId = data.teamId;
                }
                if (typeof data.positionId === "number") {
                      updateData.positionId = data.positionId;
                }
                  
                if (Object.keys(updateData).length === 0) {
                      return res.status(400).json({ message: "No fields to update" });
                }
                  
                const updatedMember = await prisma.member.update({
                      where: { id: data.id },
                      data: updateData,
                });
                console.log("Payload nhận được:", req.body);
                console.log("Payload nhận được:", updatedMember);
                return res.status(200).json(updatedMember);

            case "PATCH":  
                    const deleteData: deleteMemberDto = req.body;

                    const deleteMember = await prisma.member.delete({
                            
                            where: {
                                id: deleteData.id,
                            },
                        });
                        console.log("Payload nhận được:", req.body);    
                    return res.status(200).json(deleteMember);

            case "POST":
                // Cấp tài khoản cho member
                if (req.query.action === "createAccount") {
                    const { memberId, password, username } = req.body;
                    console.log("Payload nhận được:", req.body);
                    if (!memberId || !password) {
                        return res.status(400).json({ message: "memberId và password là bắt buộc" });
                    }
                    // Kiểm tra member tồn tại
                    const member = await prisma.member.findUnique({ where: { id: memberId } });
                    if (!member) {
                        return res.status(404).json({ message: "Member không tồn tại" });
                    }
                    const email = member.email;
                    // Kiểm tra email đã tồn tại chưa
                    const existedUser = await prisma.user.findUnique({ where: { email } });
                    if (existedUser) {
                        return res.status(400).json({ message: "Email đã tồn tại" });
                    }
                    // Hash password (giả sử bạn có hàm hashPassword)
                    const { hashPassword } = await import("@/utils/hash");
                    const hashedPassword = await hashPassword(password);
                    // Tạo user mới
                    const newUser = await prisma.user.create({
                        data: {
                            email,
                            password: hashedPassword,
                            member: { connect: { id: memberId } },
                            username: username || email,
                            role: { connect: { name: "MEMBER" } },
                        },
                    });
                    return res.status(201).json({ message: "Cấp tài khoản thành công", user: newUser });
                }
            default:
                return res.status(405).end();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}