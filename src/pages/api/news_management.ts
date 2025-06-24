import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prisma";

export interface CreatePostDto {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  image?: string;
  author?: string;
  published?: boolean;
  isHighlight?: boolean;
}

export interface UpdatePostDto extends CreatePostDto {
  id: number;
}

export interface DeletePostDto {
  id: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        const posts = await prisma.post.findMany();
        return res.status(200).json(posts);
      }
      case "POST": {
        const data: CreatePostDto = req.body;
        const post = await prisma.post.create({ data });
        return res.status(201).json(post);
      }
      case "PUT": {
        const data: UpdatePostDto = req.body;
        const { id, ...updateData } = data;
        const post = await prisma.post.update({
          where: { id },
          data: updateData,
        });
        return res.status(200).json(post);
      }
      case "PATCH": {
        const { id }: DeletePostDto = req.body;
        await prisma.post.delete({ where: { id } });
        return res.status(200).json({ message: "Xóa thành công" });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
}
