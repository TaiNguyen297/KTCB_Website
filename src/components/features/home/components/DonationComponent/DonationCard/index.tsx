import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
} from "@mui/material";
import DonationForm from "../DonationForm";

type Props = {
  event: {
    id: number; // should be number to match Event model
    title: string;
    image: string; // use Event.image
    type: string; // VOLUNTEER | DONATION
    status: string;
    goalAmount?: number;
    currentAmount?: number;
    amount?: number; // Tổng tiền từ bảng Donation
    description: string;
    startDate: string;
    endDate: string;
    postId?: number; // Thêm trường postId
  };
  onViewPoster?: (poster: string) => void;
  onJoin?: () => void;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");

const DonationCard: React.FC<Props> = ({ event }) => {
  const [openForm, setOpenForm] = useState(false);

  const progress =
    event.goalAmount && (event.amount || 0) > 0
      ? Math.min(100, Math.round(((event.amount || 0) / event.goalAmount) * 100))
      : 0;
  return (
    <Card key={event.id} sx={{ width: "100%", maxWidth: 650, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ position: "relative", width: "100%", height: 350 }}>
        <Image
          src={event.image}
          alt={event.title}
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", mb: 1, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 2 }}>
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 3 }}>
          {event.description}
        </Typography>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1, mb: 1, color: "text.secondary" }}>
          <Typography variant="body2">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </Typography>
        </Box>
        {event.type === "DONATION" && (
          <>
            {/* Thẻ trạng thái quyên góp */}
            <Box sx={{ mb: 1 }}>
              {(event.amount || 0) >= (event.goalAmount || 0) && event.goalAmount ? (
                <Box sx={{ display: 'inline-block', px: 2, py: 0.5, borderRadius: 2, bgcolor: 'success.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
                  Đã hoàn thành
                </Box>
              ) : (
                <Box sx={{ display: 'inline-block', px: 2, py: 0.5, borderRadius: 2, bgcolor: 'warning.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
                  Đang huy động
                </Box>
              )}
            </Box>
            <Box sx={{ mt: 2, alignItems: "center", gap: 1, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(to right, #4ade80, #16a34a)",
                  },
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight={500}>
              Đã quyên góp: {(event.amount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              Mục tiêu: {(event.goalAmount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </Typography>
          </>
        )}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, flex: 1 }}
            onClick={() => setOpenForm(true)}
            disabled={event.type !== "DONATION" || event.status === "FINISHED"}
          >
            Quyên góp ngay
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 2, flex: 1 }}
            onClick={() => event.postId ? window.location.href = `/event-detail/${event.postId}` : window.location.href = "/404"}
            disabled={!event.postId}
          >
            Xem chi tiết
          </Button>
          {event.status === "FINISHED" && (
            <Button
              variant="outlined"
              color="info"
              sx={{ borderRadius: 2, flex: 1 }}
              onClick={() => window.location.href = `/event-report/${event.id}`}
            >
              Xem báo cáo
            </Button>
          )}
        </Box>
        <DonationForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          eventTitle={event.title}
          eventId={event.id} 
          onSubmit={(values) => {
            setOpenForm(false);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DonationCard;
