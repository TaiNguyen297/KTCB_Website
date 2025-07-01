import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';

const DonationSuccess: React.FC = () => {
  const router = useRouter();
  const { orderId, amount } = router.query;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <CardContent>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="success.main">
            Quyên góp thành công!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Cảm ơn bạn đã quyên góp để hỗ trợ các hoạt động từ thiện của chúng tôi.
          </Typography>
          {orderId && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Mã giao dịch: {orderId}
            </Typography>
          )}
          {amount && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Số tiền: {Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Typography>
          )}
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => router.push('/')}
            >
              Về trang chủ
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DonationSuccess;
