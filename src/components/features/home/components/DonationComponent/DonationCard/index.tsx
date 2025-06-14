import React from "react";
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

type Props = {
  event: {
    id: number; // should be number to match Event model
    title: string;
    image: string; // use Event.image
    type: string; // VOLUNTEER | DONATION
    status: string;
    goalAmount?: number;
    currentAmount?: number;
    description: string;
    startDate: string;
    endDate: string;
  };
  onViewPoster?: (poster: string) => void;
  onJoin?: () => void;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");

const DonationCard: React.FC<Props> = ({ event }) => {
  const progress =
    event.goalAmount && event.currentAmount
      ? Math.min(100, Math.round((event.currentAmount / event.goalAmount) * 100))
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
              Đã quyên góp: {(event.currentAmount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              Mục tiêu: {(event.goalAmount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </Typography>
          </>
        )}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            sx={{ mt: 1, borderRadius: 2 }}
          >
            {event.status === "ONGOING" ? (event.type === "DONATION" ? "Quyên góp ngay" : "Tham gia ngay") : "Xem chi tiết"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DonationCard;
