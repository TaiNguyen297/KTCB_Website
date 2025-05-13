import { maxLengthMessage } from "@/utils/common";
import { z } from "zod";
import { REGEX_PHONE_NUMBER } from "@/utils/constants";

export const EventInputSchema = z.object({
   full_name: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      })
      .max(255, {
        message: maxLengthMessage("Họ và tên"),
      }),
    birthday: z.any(),
    email: z
      .string()
      .min(1, {
        message: "Không được để trống",
      })
      .email({
        message: "Email không hợp lệ",
      }),
    phone_number: z
      .string()
      .min(1, {
        message: "Không được để trống",
      })
      .max(11, {
        message: maxLengthMessage("Số điện thoại", 11),
      })
      .regex(REGEX_PHONE_NUMBER, {
        message: "Số điện thoại không hợp lệ",
      }),
    address: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      })
      .max(255, {
        message: maxLengthMessage("Địa chỉ"),
      }),
    work_place: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      })
      .max(255, {
        message: maxLengthMessage("Nơi làm việc"),
      }),
});

export type EventInputType = z.infer<
  typeof EventInputSchema
>;
