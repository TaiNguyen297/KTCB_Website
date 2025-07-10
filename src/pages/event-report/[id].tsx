import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Chip, LinearProgress, Grid, Avatar, Stack, Modal, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import Image from "next/image";

const sectionTitleStyle = { fontWeight: "bold", mb: 1, mt: 2, fontSize: 18 };

const EventReportDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/event_management?type=event&id=${id}`)
        .then(res => res.json())
        .then(data => setEvent(data));
    }
  }, [id]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && event.eventResult?.resultImages) {
      setSelectedImageIndex((selectedImageIndex - 1 + event.eventResult.resultImages.length) % event.eventResult.resultImages.length);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && event.eventResult?.resultImages) {
      setSelectedImageIndex((selectedImageIndex + 1) % event.eventResult.resultImages.length);
    }
  };

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
          <Grid container spacing={2} mb={2}>
            {event.eventResult.resultImages.map((img: string, i: number) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 200, 
                    position: 'relative', 
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                      transform: 'scale(1.02)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                  onClick={() => handleImageClick(i)}
                >
                  <Image src={img} alt={`Ảnh sự kiện ${i + 1}`} fill style={{ objectFit: 'cover', borderRadius: 8 }} />
                </Box>
              </Grid>
            ))}
          </Grid>
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
            <Typography mt={2}>Thành tựu:</Typography>
            {event.eventResult.achievements && event.eventResult.achievements.length > 0 ? (
              event.eventResult.achievements.map((item: string, idx: number) => (
                <Typography key={idx} component="li" sx={{ ml: 2, mb: 0.5 }}>• {item}</Typography>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ ml: 2 }}>Chưa có thông tin thành tựu</Typography>
            )}
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
            <Typography mt={2}>Thành tựu:</Typography>
            {event.eventResult.achievements && event.eventResult.achievements.length > 0 ? (
              event.eventResult.achievements.map((item: string, idx: number) => (
                <Typography key={idx} component="li" sx={{ ml: 2, mb: 0.5 }}>• {item}</Typography>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ ml: 2 }}>Chưa có thông tin thành tựu</Typography>
            )}
          </>
        )}
      </Paper>

      {/* Modal hiển thị ảnh lớn */}
      <Modal
        open={selectedImageIndex !== null}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {selectedImageIndex !== null && event.eventResult?.resultImages && (
            <>
              {/* Nút đóng */}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                }}
              >
                <Close />
              </IconButton>

              {/* Ảnh lớn */}
              <Box sx={{ position: 'relative', width: '80vw', height: '70vh', maxWidth: 800, maxHeight: 600 }}>
                <Image
                  src={event.eventResult.resultImages[selectedImageIndex]}
                  alt={`Ảnh sự kiện ${selectedImageIndex + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>

              {/* Nút điều hướng */}
              {event.eventResult.resultImages.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}

              {/* Chỉ số ảnh */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1
                }}
              >
                <Typography variant="body2">
                  {selectedImageIndex + 1} / {event.eventResult.resultImages.length}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default EventReportDetail;
