import { maxLengthMessage } from "@/utils/common";
import { z } from "zod";

export const ChangePasswordInputSchema = z
  .object({
    current_password: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      })
      .max(255, {
        message: maxLengthMessage("Họ và tên"),
      }),
    new_password: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      })
      .max(255, {
        message: maxLengthMessage("Họ và tên"),
      }),
    confirm_new_password: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      })
      .max(255, {
        message: maxLengthMessage("Họ và tên"),
      }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Mật khẩu mới không trùng khớp",
    path: ["confirm_new_password"],
  });

export type ChangePasswordInputType = z.infer<typeof ChangePasswordInputSchema>;
