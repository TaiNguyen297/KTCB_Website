import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Grid } from "@mui/material";
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
  eventId?: number; // Thêm prop eventId nếu cần truyền
}

const DonationForm: React.FC<DonationFormProps> = ({ open, onClose, onSubmit, eventTitle, eventId }) => {
  const { handleSubmit, control, reset, watch, setValue } = useForm<DonationFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      amount: 0,
      paymentMethod: "MOMO",
    },
  });

  // Đảm bảo luôn set paymentMethod là MOMO khi mở form
  useEffect(() => {
    if (open) {
      setValue("paymentMethod", "MOMO");
    }
  }, [open, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRedirectMomo = async (values: DonationFormValues) => {
    // Tạo orderId duy nhất cho giao dịch (MoMo yêu cầu chúng ta gửi orderId)
    const orderId = `ORDER_${Date.now()}`;
    console.log('orderId tạo bởi FE:', orderId, values); // Log orderId FE
    
    // Gọi API backend tạo order MoMo, nhận về url thanh toán
    // Truyền thông tin form để lưu sau khi thanh toán thành công
    const res = await fetch("/api/create_momo_payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: values.amount,
        orderInfo: `Ủng hộ sự kiện: ${eventTitle || ''}`,
        orderId,
        // Truyền thông tin form để lưu sau khi thanh toán thành công
        donorInfo: {
          fullName: values.fullName,
          email: values.email,
          paymentMethod: values.paymentMethod,
          eventId: eventId,
        }
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert("Không thể tạo giao dịch MoMo. Vui lòng thử lại.");
      }
    } else {
      alert("Không thể tạo giao dịch MoMo. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Quyên góp cho {eventTitle || "sự kiện"}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit(async (values) => {
            await handleRedirectMomo(values);
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
              {/* Không dùng input hidden nữa, chỉ hiển thị readonly */}
              <TextField
                label="Phương thức thanh toán"
                value="MoMo"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={handleClose} color="inherit">Hủy</Button>
              <Button
                type="submit"
                variant="contained"
              >
                Quyên góp
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;
