import { useState } from "react";
import { UserInformation, UserKTCB, UserSocialActivities } from "./components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MemberRegistrationInputSchema,
  MemberRegistrationInputType,
} from "./types";
import { Button, Typography } from "@mui/material";
import ktcbBackground from "@public/mission-background.jpg";
import { useRouter } from "next/router";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { ContainerXL } from "@/components/layouts/ContainerXL";

export const MemberRegistration = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberRegistrationInputType>({
    resolver: zodResolver(MemberRegistrationInputSchema),
    defaultValues: {
      full_name: "",
      birthday: Date.now(),
      phone_number: "",
      email: "",
      address: "",
      work_place: "",

      // social activities
      has_social_activities: "1",
      memories: "",

      // ktcb
      position: "",
      hope_to_receive: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitted(true);

    try {
      const response = await fetch('/api/member_registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      reset();
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <ContainerXL
      sx={{
        backgroundImage: `url(${ktcbBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        paddingBottom: "2rem",
      }}
    >
      <div className="flex flex-col mt-9 gap-4">
        <ToastSuccess
          open={open}
          onClose={() => setOpen(false)}
          heading="Xác nhận thành công"
          content="Cảm ơn đã gửi thông tin"
        />
        
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
            }}
            disabled
            color="secondary"
            onClick={() => router.push("/member-registration")}
          >
            Trở thành thành viên
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
            }}
            color="secondary"
            onClick={() => router.push("/donor-registration")}
          >
            Trở thành nhà hảo tâm
          </Button>
        </div>

        <Typography fontSize={28} fontWeight={"bold"}>
          Đăng ký trở thành thành viên Khoảng Trời Của Bé
        </Typography>

        <UserInformation control={control} errors={errors} />

        <UserSocialActivities control={control} errors={errors} />

        <UserKTCB control={control} errors={errors} />

        <Button
          variant="contained"
          sx={{
            marginTop: "1rem",
            width: "fit-content",
            alignSelf: "center",
          }}
          color="secondary"
          onClick={onSubmit}
          disabled={isSubmitted}
        >
          Gửi thông tin
        </Button>
      </div>
    </ContainerXL>
  );
};
