import React from "react";
import { ErrorOption, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormInputSchema, ExpenseFormInputType } from "./types";
import { Button, Typography } from "@mui/material";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import ktcbBackground from "@public/mission-background.jpg";
import { useRouter } from "next/router";
import { ExpenseForm } from "./components";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";

export const ExpenseCreation = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ExpenseFormInputType>({
    resolver: zodResolver(ExpenseFormInputSchema),
    defaultValues: {
      title: "",
      content: "",
      expense_date: Date.now(),
      image_url: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);

    setOpen(true);
  });

  return (
    <div className="flex flex-col mt-9 gap-4">
      <ToastSuccess
        open={open}
        onClose={() => setOpen(false)}
        heading="Xác nhận thành công"
        content="Cảm ơn đã gửi thông tin"
      />

      <ExpenseForm control={control} errors={errors} setError={setError} />

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
        Gửi thông tin
      </Button>
    </div>
  );
};
