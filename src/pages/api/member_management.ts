import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export interface MemberPositionDto {
    id: number;
    positionId: number;
    teamId: number;
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

            case "PATCH":
                const data: MemberPositionDto = req.body;

                if(!data || typeof data.id !== 'number' || typeof data.positionId !== 'number' || typeof data.teamId !== 'number') {
                        
                        res.status(400).json({ message: "ID not found" });
                        return;
                    }

                const updatedMember = await prisma.member.update({
                        
                        where: {
                            id: data.id
                        },
                        data: {
                           positionId: data.positionId,
                           teamId: data.teamId,
                        },
                    });

                    return res.status(200).json(updatedMember);

            default:
                return res.status(405).end();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}