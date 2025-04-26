import * as React from "react";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import logoNoBackground from "@public/ktcb_logo_no_background.png";
import { Input } from "@/components/shared/inputs";
import { notEmptyMessage } from "@/utils/common";
import { authOptions } from "./api/auth/[...nextauth]";

export const LoginInputSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: notEmptyMessage("Email"),
    })
    .email({
      message: "Email không hợp lệ",
    }),

  password: z.string().min(1, {
    message: "Mật khẩu không được bỏ trống",
  }),
});

export default function Login() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginInputSchema>>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password
      });

      console.log(res);
      if (!res?.error) {
        router.push('/');
      }
    } catch (error: any) {
      console.log(error);
    }
  });

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        paddingBottom: "110px",
      }}
    >
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "0.0625rem solid rgb(222, 226, 230)",
          boxShadow:
            "rgba(0, 0, 0, 0.05) 0px 0.0625rem 0.1875rem, rgba(0, 0, 0, 0.05) 0px 1.25rem 1.5625rem -0.3125rem, rgba(0, 0, 0, 0.04) 0px 0.625rem 0.625rem -0.3125rem",
          borderRadius: "8px",
          padding: {
            sm: "40px 60px",
            xs: "24px 32px",
          },
        }}
      >
        <Link href="/" className="flex items-center">
          <Box
            component="img"
            maxHeight={80}
            width={80}
            src={logoNoBackground.src}
            alt="logoNoBackground"
            loading="lazy"
          />
        </Link>
        <p className="text-[#292929] text-[28px] font-bold mt-6">
          Đăng nhập Hệ thống Nội bộ KTCB
        </p>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          maxWidth={400}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={"Email"}
                fullWidth
                placeholder={"Nhập email"}
                value={value}
                onChange={onChange}
                error={!!errors.email?.message}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={"Mật khẩu"}
                fullWidth
                placeholder={"Nhập mật khẩu"}
                type="password"
                value={value}
                onChange={onChange}
                error={!!errors.password?.message}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="secondary"
          >
            Đăng nhập
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions as any);
  if (session) return { redirect: { destination: '/' } };

  return { props: { session } };
}
