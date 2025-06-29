import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";

const getStatusMessage = (resultCode?: string) => {
  switch (resultCode) {
    case "0":
      return { color: "success.main", text: "Thanh toán thành công!" };
    case "49":
      return { color: "warning.main", text: "Bạn đã hủy giao dịch." };
    default:
      return { color: "error.main", text: "Thanh toán thất bại hoặc bị từ chối." };
  }
};

export default function PaymentSuccess() {
  const router = useRouter();
  const { resultCode, message, orderId, amount } = router.query;

  const status = useMemo(() => getStatusMessage(resultCode as string), [resultCode]);

  useEffect(() => {
    // Có thể xử lý thêm, ví dụ: gửi thông báo, lưu DB, ...
  }, [resultCode]);

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" sx={{ color: status.color, mb: 2 }}>
        {status.text}
      </Typography>
      {message && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      {orderId && (
        <Typography variant="body2">Mã giao dịch: {orderId}</Typography>
      )}
      {amount && (
        <Typography variant="body2">Số tiền: {amount} VNĐ</Typography>
      )}
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => router.push("/")}>Về trang chủ</Button>
    </Box>
  );
}
