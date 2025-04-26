import {  maxLengthMessage } from "@/utils/common";
import { z } from "zod";
import { REGEX_PHONE_NUMBER } from "@/utils/constants";

export const MemberRegistrationInputSchema = z
  .object({
    // UserInformation
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

    // UserSocialActivities
    has_social_activities: z.string(),

    memories: z
      .string()
      .trim()
      .max(1000, {
        message: maxLengthMessage("Kỷ niệm"),
      }),

    // UserKTCB
    position: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      }),
    hope_to_receive: z
      .string()
      .trim()
      .min(1, {
        message: "Không được để trống",
      })
      .max(1000, {
        message: maxLengthMessage("Mong muốn nhận"),
      }),
  })
  // If has social activities, you must fill memories field
  .refine(
    (val) => {
      if (val.has_social_activities == "1") {
        return val.memories.trim().length > 0;
      }

      return true;
    },
    {
      path: ["memories"],
      message: "Không được để trống",
    }
  );

export type MemberRegistrationInputType = z.infer<
  typeof MemberRegistrationInputSchema
>;
