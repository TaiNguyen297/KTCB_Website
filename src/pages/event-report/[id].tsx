import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Chip, LinearProgress, Grid, Avatar, Stack } from "@mui/material";
import Image from "next/image";

const sectionTitleStyle = { fontWeight: "bold", mb: 1, mt: 2, fontSize: 18 };

const EventReportDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/event_management?type=event&id=${id}`)
        .then(res => res.json())
        .then(data => setEvent(data));
    }
  }, [id]);

  if (!event) return <Typography>Đang tải dữ liệu...</Typography>;

  return (
    <Box maxWidth={900} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">Báo cáo chi tiết sự kiện</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        {/* 1. Thông tin chung */}
        <Typography sx={sectionTitleStyle}>1. Thông tin sự kiện</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold" mb={1}>{event.title}</Typography>
            <Typography color="text.secondary" mb={0.5}>
              Thời gian: {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}
            </Typography>
            {event.location && (
              <Typography mb={0.5}>Địa điểm: {event.location}</Typography>
            )}
            <Typography mb={0.5}>
              Loại sự kiện: <Chip label={event.type === "VOLUNTEER" ? "Tình nguyện" : "Quyên góp"} color={event.type === "VOLUNTEER" ? "primary" : "success"} size="small" />
            </Typography>
            <Typography mb={0.5}>Trạng thái: <b>{event.status === "FINISHED" ? "Đã kết thúc" : event.status === "ONGOING" ? "Đang diễn ra" : "Sắp diễn ra"}</b></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            {event.image && (
              <Box sx={{ width: 160, height: 100, position: 'relative', mx: 'auto' }}>
                <Image src={event.image} alt="Ảnh đại diện sự kiện" fill style={{ objectFit: 'cover', borderRadius: 8 }} />
              </Box>
            )}
          </Grid>
        </Grid>
        {/* 2. Mô tả chi tiết */}
        <Divider sx={{ my: 2 }} />
        <Typography sx={sectionTitleStyle}>2. Tóm tắt sự kiện</Typography>
        {event.eventResult.summary && (
          <Typography color="text.secondary" mb={1}>{event.eventResult.summary}</Typography>
        )}
        {/* Có thể bổ sung mục tiêu, hoạt động chính, đối tượng tham gia, bên tổ chức nếu có */}
        {/* 3. Ảnh/video */}
        <Divider sx={{ my: 2 }} />
        <Typography sx={sectionTitleStyle}>3. Ảnh / video</Typography>
        {event.eventResult?.resultImages && event.eventResult.resultImages.length > 0 ? (
          <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
            {event.eventResult.resultImages.map((img: string, i: number) => (
              <Box key={i} sx={{ width: 140, height: 90, position: 'relative' }}>
                <Image src={img} alt={`Ảnh sự kiện ${i + 1}`} fill style={{ objectFit: 'cover', borderRadius: 8 }} />
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">Chưa có album ảnh sự kiện</Typography>
        )}
        {event.eventResult?.videoRecap && (
          <Box mb={2}>
            <video width="360" height="200" controls src={event.eventResult.videoRecap} style={{ borderRadius: 8 }} />
          </Box>
        )}
        {/* 4. Thống kê kết quả */}
        <Divider sx={{ my: 2 }} />
        <Typography sx={sectionTitleStyle}>4. Thống kê kết quả</Typography>
        {event.type === "VOLUNTEER" ? (
          <>
            <Typography>Số người đăng ký/tham gia: <b>{event.eventResult.totalParticipant} tình nguyện viên</b></Typography>
            <Typography>Tổng thời gian tình nguyện: <b>{event.eventResult.totalHour} giờ</b></Typography>
            <Typography>Thành tựu:</Typography>
            {event.eventResult.achievements?.map((item: string, idx: number) => (
              <p key={idx}>{item}</p>
            ))}
          </>
        ) : (
          <>
            <Typography>Mục tiêu quyên góp: <b>{event.goalAmount?.toLocaleString("vi-VN") ?? 0} VNĐ</b></Typography>
            <Typography>Số tiền đã quyên góp: <b>{event.eventResult?.totalDonation?.toLocaleString("vi-VN") ?? 0} VNĐ</b></Typography>
            {event.goalAmount && event.eventResult?.totalDonation && (
              <Box sx={{ width: 300, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">Tiến độ quyên góp</Typography>
                <LinearProgress variant="determinate" value={Math.min(100, (event.eventResult.totalDonation / event.goalAmount) * 100)} sx={{ height: 10, borderRadius: 5 }} />
                <Typography variant="caption">{Math.round((event.eventResult.totalDonation / event.goalAmount) * 100)}%</Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default EventReportDetail;
