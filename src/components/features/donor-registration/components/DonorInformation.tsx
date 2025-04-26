import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DonorRegistrationInputType } from "../types";
import { Stack, Typography, Grid } from "@mui/material";
import { Input } from "@/components/shared/inputs";
import { DatePicker } from "@/components/shared/inputs/time-picker";

const COL_SPAN = {
  xs: 12,
  md: 6,
};

export const DonorInformation = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<DonorRegistrationInputType>();

  return (
    <Stack>
      <Typography variant="h5" mb={2}>
        Bạn hãy chia sẻ một số thông tin cá nhân với chúng mình nhé…
      </Typography>

      <Grid container spacing={2}>
        <Grid item {...COL_SPAN}>
          <Controller
            name="full_name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={"Họ và tên đầy đủ của bạn là gì?"}
                required
                fullWidth
                placeholder={"Nhập họ và tên"}
                value={value}
                onChange={onChange}
                error={!!errors.full_name?.message}
                helperText={errors.full_name?.message}
              />
            )}
          />
        </Grid>

        <Grid item {...COL_SPAN}>
          <Controller
            name="birthday"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label={"Ngày tháng năm sinh của bạn là gì?"}
                required
                fullWidth
                value={value as unknown as Date}
                onChange={onChange}
                error={!!errors.birthday?.message}
                helperText={errors.birthday?.message as string}
                maxDate={new Date()}
              />
            )}
          />
        </Grid>

        <Grid item {...COL_SPAN}>
          <Controller
            name="phone_number"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={"Số điện thoại của bạn là gì?"}
                required
                fullWidth
                placeholder={"Nhập số điện thoại"}
                value={value}
                onChange={onChange}
                error={!!errors.phone_number?.message}
                helperText={errors.phone_number?.message}
              />
            )}
          />
        </Grid>

        <Grid item {...COL_SPAN}>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={"Email của bạn là gì?"}
                required
                fullWidth
                placeholder={"Nhập email"}
                value={value}
                onChange={onChange}
                error={!!errors.email?.message}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
