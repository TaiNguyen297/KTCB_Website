import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordInputSchema, ChangePasswordInputType } from "./types";
import { Button, Typography } from "@mui/material";
import ktcbBackground from "@public/mission-background.jpg";

import { Controller } from "react-hook-form";
import { Grid } from "@mui/material";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { useRouter } from "next/router";
import { PasswordInput } from "@/components/shared/inputs/PasswordInput";
import { useSession } from "next-auth/react";

const COL_SPAN = {
  xs: 12,
  sm: 6,
  md: 4,
};

export const ChangePassword = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputType>({
    resolver: zodResolver(ChangePasswordInputSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!session?.user?.email) throw new Error("Không tìm thấy Email người dùng");
      const res = await fetch("/api/change_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          current_password: data.current_password,
          new_password: data.new_password,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Đổi mật khẩu thất bại");
        return;
      }
      setOpen(true);
    } catch (e: any) {
      alert(e.message || "Đổi mật khẩu thất bại");
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
              textWrap: "nowrap",
            }}
            color="secondary"
            onClick={() => router.push("/profile")}
          >
            Chỉnh sửa thông tin
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
              textWrap: "nowrap",
            }}
            disabled
            color="secondary"
            onClick={() => router.push("/change-password")}
          >
            Thay đổi mật khẩu
          </Button>
        </div>

        <Typography fontSize={28} fontWeight={"bold"} className="text-center">
          Mật khẩu
        </Typography>

        <Grid container className="justify-center">
          <Grid container item xs={12} sm={8} md={6} lg={4} spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="current_password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PasswordInput
                    label={"Mật khẩu hiện tại"}
                    required
                    fullWidth
                    placeholder={"Nhập mật khẩu hiện tại"}
                    value={value}
                    onChange={onChange}
                    error={!!errors.current_password?.message}
                    helperText={errors.current_password?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="new_password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PasswordInput
                    label={"Mật khẩu mới"}
                    required
                    fullWidth
                    placeholder={"Nhập mật khẩu mới"}
                    value={value}
                    onChange={onChange}
                    error={!!errors.new_password?.message}
                    helperText={errors.new_password?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="confirm_new_password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PasswordInput
                    label={"Nhập lại mật khẩu mới"}
                    required
                    fullWidth
                    placeholder={"Nhập lại mật khẩu mới"}
                    value={value}
                    onChange={onChange}
                    error={!!errors.confirm_new_password?.message}
                    helperText={errors.confirm_new_password?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{
            marginTop: "1rem",
            width: "fit-content",
            alignSelf: "center",
          }}
          color="secondary"
          onClick={onSubmit}
        >
          Đổi mật khẩu
        </Button>
      </div>
    </ContainerXL>
  );
};
