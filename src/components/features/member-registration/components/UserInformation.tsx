import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { MemberRegistrationInputType } from "../types";
import { Stack, Typography, Grid } from "@mui/material";
import { Input } from "@/components/shared/inputs";
import { DatePicker } from "@/components/shared/inputs/time-picker";

interface Props {
  control: Control<MemberRegistrationInputType>;
  errors: FieldErrors<MemberRegistrationInputType>;
}

const COL_SPAN = {
  xs: 12,
  sm: 6,
  md: 4,
};

export const UserInformation: React.FC<Props> = ({ control, errors }) => {
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

        <Grid item {...COL_SPAN}>
          <Controller
            name="work_place"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={"Bạn đang học tập hay công tác ở đâu?"}
                required
                fullWidth
                placeholder={"Nhập nơi làm việc"}
                value={value}
                onChange={onChange}
                error={!!errors.work_place?.message}
                helperText={errors.work_place?.message}
              />
            )}
          />
        </Grid>

        <Grid item {...COL_SPAN}>
          <Controller
            name="address"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                label={"Bạn đang sống ở khu vực nào?"}
                required
                fullWidth
                placeholder={"Nhập khu vực đang sinh sống"}
                value={value}
                onChange={onChange}
                error={!!errors.address?.message}
                helperText={errors.address?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
