import React from "react";
import Image from "next/image";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { Box, Card, CardContent, Button, Typography, Chip } from "@mui/material";

type Props = {
  event: {
    id: string;
    title: string;
    poster: string;
    location: string;
    status: string; 
    locationLink?: string;
    description: string;
    eventDate: string;
  };
  onViewPoster?: (poster: string) => void;  
  onJoin?: () => void;
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "UPCOMING":
      return { label: "Sắp diễn ra", color: "info" };
    case "ONGOING":
      return { label: "Đang diễn ra", color: "success" };
    case "FINISHED":
      return { label: "Đã kết thúc", color: "error" };
    default:
      return { label: "Không xác định", color: "default" };
  }
};

const EventCard: React.FC<Props> = ({ event}) => {
  return (
    <Card key={event.id} sx={{ width: "100%", maxWidth: 650, mx: "auto", borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ position: "relative", width: "100%", height: 350 }}>
        <Image
          src={event.poster}
          alt={event.title}
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", mb: 1, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 2 }}>
          {event.title}
        </Typography>
        <Chip
          label={getStatusLabel(event.status).label}
          color={getStatusLabel(event.status).color as any}
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" sx={{ color: "text.secondary", display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", WebkitLineClamp: 3 }}>
          {event.description}
        </Typography>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
          <Typography variant="body2">
            {format(new Date(event.eventDate), "dd/MM/yyyy")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary", mt: 1 }}>
          <Typography variant="body2">{event.location}</Typography>
        </Box>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ fontSize: "0.875rem" }}
          >
            Xem poster
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ fontSize: "0.875rem" }}
          >
            Tham gia
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
