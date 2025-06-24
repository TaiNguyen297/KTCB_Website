import React from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, MenuItem, Grid } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export interface DonationFormValues {
  fullName: string;
  email: string;
  amount: number;
  paymentMethod: string;
}

interface DonationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DonationFormValues) => void;
  eventTitle?: string;
}

const paymentMethods = [
  { value: "ZALOPAY", label: "ZaloPay" },
];

const DonationForm: React.FC<DonationFormProps> = ({ open, onClose, onSubmit, eventTitle }) => {
  const { handleSubmit, control, reset, watch } = useForm<DonationFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      amount: 0,
      paymentMethod: "ZALOPAY",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRedirectZaloPay = async (values: DonationFormValues) => {
    // Gọi API backend tạo order ZaloPay, nhận về url thanh toán
    const res = await fetch("/api/zalo_pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.payUrl) {
        window.location.href = data.payUrl;
      }
    } else {
      alert("Không thể tạo giao dịch ZaloPay. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Quyên góp cho {eventTitle || "sự kiện"}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit(async (values) => {
            if (values.paymentMethod === "ZALOPAY") {
              await handleRedirectZaloPay(values);
            } else {
              onSubmit(values);
              handleClose();
            }
          })}
        >
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Vui lòng nhập họ tên" }}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Họ và tên" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{ required: "Vui lòng nhập email" }}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Email" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="amount"
                control={control}
                rules={{ required: "Vui lòng nhập số tiền", min: { value: 1000, message: "Tối thiểu 1.000đ" } }}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Số tiền (VNĐ)" type="number" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                disabled={true}
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Phương thức thanh toán" select fullWidth>
                    {paymentMethods.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={handleClose} color="inherit">Hủy</Button>
              <Button type="submit" variant="contained">Quyên góp</Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;
