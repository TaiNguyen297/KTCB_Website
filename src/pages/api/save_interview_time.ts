import prisma from "@/libs/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

interface InterviewTest {
  id: number;
  dateTime: Date ;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const data: InterviewTest = req.body;

  if (!data || typeof data.id !== 'number' || typeof data.dateTime !== 'string') {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  try {
    const updatedMember = await prisma.memberRegistration.update({
      where: { id: data.id },
      data: {  interviewTime: data.dateTime },
    });

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}