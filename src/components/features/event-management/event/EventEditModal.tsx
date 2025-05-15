import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Box,
  Grid,
  Divider,
  Typography,
  styled,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { EventStatus } from "@prisma/client";
import { useUpdateEvent } from "./hooks/useUpdateEvent";
import { MODAL_TYPES, useGlobalModalContext } from "../../global-modal/GlobalModal";
import { IEventManagement } from "./EventManagementTable";
import { ImageUploader } from "./ImageUploader";

interface StatusOption {
  label: string;
  value: EventStatus;
}

const StatusEvent: StatusOption[] = [
  { label: "Sắp diễn ra", value: EventStatus.UPCOMING },
  { label: "Đang diễn ra", value: EventStatus.ONGOING },
  { label: "Đã kết thúc", value: EventStatus.FINISHED },
];

interface EventEditModalProps {
  open: boolean;
  onClose: () => void;
  event: IEventManagement | null;
  onSuccess?: () => void;
}
  
const EventEditModal: React.FC<EventEditModalProps> = ({
  open,
  onClose,
  event,
  onSuccess,
}) => {
  const { showModal } = useGlobalModalContext();
  const { mutateAsync: updateEvent, isLoading } = useUpdateEvent();
  
  interface EventFormData {
    id?: number;
    title: string;
    status: EventStatus;
    date: Date;
    location: string;
    mapLink: string;
    image: string;
    description: string;
  }
  
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    status: EventStatus.UPCOMING,
    date: new Date(),
    location: "",
    mapLink: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id,
        title: event.title,
        status: event.status,
        date: new Date(event.date),
        location: event.location,
        mapLink: event.mapLink || "",
        image: event.image || "",
        description: event.description || "",
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        date: date,
      });
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({
      ...formData,
      image: imageUrl,
    });
  };

  const handleSubmit = async () => {
    if (!formData.id) return;
    
    try {
      await updateEvent({
        id: formData.id,
        title: formData.title || "",
        status: formData.status as EventStatus,
        date: formData.date || new Date(),
        location: formData.location || "",
        mapLink: formData.mapLink || "",
        image: formData.image || "",
        description: formData.description || "",
      });
      
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: "Cập nhật sự kiện thành công",
      });
      
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: "Có lỗi xảy ra khi cập nhật sự kiện",
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '80vh',
        },
        '& .MuiDialogContent-root': {
          padding: '12px 24px',
        },
        '& .MuiDialogActions-root': {
          padding: '8px 24px',
        }
      }}
    >
      <DialogTitle sx={{ paddingBottom: 1 }}>Chỉnh sửa sự kiện</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1, mb: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Tên sự kiện"
                fullWidth
                value={formData.title || ""}
                onChange={handleChange}
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="status-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status || ""}
                  label="Trạng thái"
                  onChange={handleSelectChange}
                >
                  {StatusEvent.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày tổ chức"
                  value={formData.date ? new Date(formData.date) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      margin: 'dense'
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Địa điểm"
                fullWidth
                value={formData.location || ""}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="mapLink"
                label="Link bản đồ"
                fullWidth
                value={formData.mapLink || ""}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Hình ảnh sự kiện
              </Typography>
              <ImageUploader 
                currentImage={formData.image || ''} 
                onImageChange={handleImageChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Mô tả"
                multiline
                rows={3}
                fullWidth
                value={formData.description || ""}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isLoading || !formData.title || !formData.location}
        >
          {isLoading ? "Đang xử lý..." : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { EventEditModal }; 