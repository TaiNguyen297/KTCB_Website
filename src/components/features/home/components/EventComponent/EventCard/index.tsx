import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  EventInputSchema,
  EventInputType,
} from "../types";
import { EventInformation } from "../EventInfomation";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { Box, Card, CardContent, Button, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { MODAL_TYPES, useGlobalModalContext } from "@/components/features/global-modal/GlobalModal";

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

const EventCard: React.FC<any> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventInputType>({
    resolver: zodResolver(EventInputSchema),
    defaultValues: {
      full_name: "",
      birthday: Date.now(),
      phone_number: "",
      email: "",
      address: "",
      work_place: "",
    },
  });

  const handleJoin = () => {
    if (event.status === "UPCOMING" || event.status === "ONGOING") {
      setOpen(true);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitted(true);
    try {
      const response = await fetch('/api/volunteer_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,        
          eventId: event.id, 
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      reset();
      setOpenModal(true);
    } catch (err) {
      console.error(err);
    }
  });

  const handleClose = () => setOpen(false);

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
            {format(new Date(event.date), "dd/MM/yyyy")}
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
            Xem thông tin
          </Button>
          <Button
            onClick={handleJoin}
            variant="contained"
            color="success"
            sx={{ fontSize: "0.875rem" }}
          >
            Tham gia
          </Button>
        </Box>
      </CardContent>

      {/* Modal form */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Đăng ký tham gia sự kiện</DialogTitle>
        <DialogContent dividers>
          <EventInformation control={control} errors={errors} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={onSubmit} disabled={isSubmitted}>Gửi</Button>
        </DialogActions>
      </Dialog>

      <ToastSuccess
        open={openModal}
        onClose={() => setOpenModal(false)}
        heading="Xác nhận đăng ký thành công"
        content="Cảm ơn bạn đã gửi thông tin"
      />
    </Card>
  );
};

export default EventCard;