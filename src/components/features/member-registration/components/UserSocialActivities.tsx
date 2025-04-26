import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { MemberRegistrationInputType } from "../types";
import { Stack, Typography, Grid } from "@mui/material";
import { Input, Radio } from "@/components/shared/inputs";

interface Props {
  control: Control<MemberRegistrationInputType>;
  errors: FieldErrors<MemberRegistrationInputType>;
}

export const UserSocialActivities: React.FC<Props> = ({ control, errors }) => {
  return (
    <Stack mt={1}>
      <Typography variant="h5" mb={2}>
        Bạn hãy chia sẻ một số kinh nghiệm hoạt động xã hội nhé…
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Controller
            name="has_social_activities"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Radio
                label={"Bạn đã từng tham gia hoạt động xã hội chưa?"}
                required
                fullWidth
                value={value}
                onChange={onChange}
                error={!!errors.has_social_activities?.message}
                helperText={errors.has_social_activities?.message}
                options={[
                  {
                    value: 0,
                    label: "Chưa từng",
                  },
                  {
                    value: 1,
                    label: "Đã từng",
                  },
                ]}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Controller
            name="memories"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <Input
                  label={
                    "Nếu bạn đã từng tham gia hoạt động xã hội, hãy chia sẻ với chúng mình một số kỷ niệm của bạn nhé."
                  }
                  required
                  multiline
                  rows={4}
                  fullWidth
                  placeholder={"Nhập kỷ niệm của bạn"}
                  value={value}
                  onChange={(e) => {
                    // Giới hạn số ký tự được nhập
                    if (e.target.value.length <= 100) { // Giả sử giới hạn là 500 ký tự
                      onChange(e);
                    }
                  }}
                  error={!!errors.memories?.message}
                  helperText={errors.memories?.message}
                />
                <Typography variant="caption" display="block" gutterBottom >
                  {value.length}/100
                </Typography>
              </>
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
