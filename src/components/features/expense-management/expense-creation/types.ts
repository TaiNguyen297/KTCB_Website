import { maxLengthMessage } from "@/utils/common";
import { z } from "zod";

export const ExpenseFormInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Không được để trống",
    })
    .max(255, {
      message: maxLengthMessage("Tiêu đề của khoản chi", 255),
    }),
  expense_date: z.any(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Không được để trống",
    })
    .max(255, {
      message: maxLengthMessage("Nội dung chi tiết khoản chi", 1024),
    }),
  image_url: z.any().refine((file) => file, "Không được để trống"),
});

export type ExpenseFormInputType = z.infer<typeof ExpenseFormInputSchema>;
