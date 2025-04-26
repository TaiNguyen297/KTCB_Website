import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetError,
} from "react-hook-form";
import { ExpenseFormInputType } from "../types";
import { Grid } from "@mui/material";
import { Input } from "@/components/shared/inputs";
import { UploadFile } from "@/components/shared/inputs/upload";
import { DatePicker } from "@/components/shared/inputs/time-picker";

interface Props {
  control: Control<ExpenseFormInputType>;
  errors: FieldErrors<ExpenseFormInputType>;
  setError: UseFormSetError<ExpenseFormInputType>;
}

const COL_SPAN = {
  xs: 12,
  md: 6,
};

export const ExpenseForm: React.FC<Props> = ({ control, errors, setError }) => {
  return (
    <Grid container spacing={2}>
      <Grid item {...COL_SPAN}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label={"Tiêu đề của khoản chi"}
              required
              fullWidth
              placeholder={"Nhập tiêu đề của khoản chi"}
              value={value}
              onChange={onChange}
              error={!!errors.title?.message}
              helperText={errors.title?.message}
            />
          )}
        />
      </Grid>

      <Grid item {...COL_SPAN}>
        <Controller
          name="expense_date"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={"Ngày chi"}
              required
              fullWidth
              value={value as unknown as Date}
              onChange={onChange}
              error={!!errors.expense_date?.message}
              helperText={errors.expense_date?.message as string}
              maxDate={new Date()}
            />
          )}
        />
      </Grid>

      <Grid item {...COL_SPAN}>
        <Controller
          name="content"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label={"Nội dung chi tiết khoản chi"}
              required
              fullWidth
              placeholder={"Nhập nội dung chi tiết khoản chi"}
              value={value}
              onChange={onChange}
              error={!!errors.content?.message}
              helperText={errors.content?.message}
              rows={4}
              multiline
            />
          )}
        />
      </Grid>

      <Grid item {...COL_SPAN}>
        <Controller
          name="image_url"
          control={control}
          render={({ field: { onChange } }) => (
            <UploadFile
              name="image_url"
              label={`Minh chứng, hoá đơn`}
              fullWidth
              required
              onChange={onChange}
              error={!!errors.image_url?.message}
              helperText={errors.image_url?.message as string}
              setError={setError}

              // hasPreviewUrl={true}
              // previewUrl={imageUrl}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
