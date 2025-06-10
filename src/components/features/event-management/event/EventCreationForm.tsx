import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { EventStatus } from "@prisma/client";
import { useCreateEvent } from "./hooks/useCreateEvent";
import { MODAL_TYPES, useGlobalModalContext } from "../../global-modal/GlobalModal";
import { ImageUploader } from "./ImageUploader";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";

interface StatusOption {
  label: string;
  value: EventStatus;
}

const StatusEvent: StatusOption[] = [
  { label: "Sắp diễn ra", value: EventStatus.UPCOMING },
  { label: "Đang diễn ra", value: EventStatus.ONGOING },
  { label: "Đã kết thúc", value: EventStatus.FINISHED },
];

interface EventCreationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { showModal } = useGlobalModalContext();
  const { mutateAsync: createEvent, isLoading } = useCreateEvent();
  
  const EventFormState = {
    title: "",
    status: EventStatus.UPCOMING,
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    mapLink: "",
    image: "",
    description: "",
  };
  
  const [formData, setFormData] = useState(EventFormState);

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

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        startDate: date,
      });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        endDate: date,
      });
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({
      ...formData,
      image: imageUrl,
    });
  };

  const handleReset = () => {
    setFormData(EventFormState);
  };

  const handleSubmit = async () => {
    try {
      await createEvent(
        {
          title: formData.title,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          mapLink: formData.mapLink,
          image: formData.image,
          description: formData.description,
        }
      );
      
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: "Tạo sự kiện thành công",
      });
      
      setFormData(EventFormState);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi tạo sự kiện:", error);
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
      <DialogTitle sx={{ paddingBottom: 1 }}>Tạo mới sự kiện</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1, mb: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Tên sự kiện"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
                margin="dense"
                placeholder="Nhập tên sự kiện"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="status-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
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
                  label="Ngày bắt đầu"
                  value={formData.startDate}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      margin: 'dense',
                      placeholder: "Chọn ngày bắt đầu"
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={formData.endDate}
                  onChange={handleEndDateChange}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      margin: 'dense',
                      placeholder: "Chọn ngày kết thúc"
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
                value={formData.location}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
                placeholder="Nhập địa điểm tổ chức"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="mapLink"
                label="Link bản đồ"
                fullWidth
                value={formData.mapLink}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
                placeholder="Nhập đường dẫn Google Maps"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Hình ảnh sự kiện
              </Typography>
              <ImageUploader 
                currentImage={formData.image} 
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
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
                placeholder="Nhập mô tả chi tiết về sự kiện"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleReset} 
          color="inherit" 
          startIcon={<RefreshIcon />}
        >
          Làm mới
        </Button>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isLoading || !formData.title || !formData.location}
          startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {isLoading ? "Đang xử lý..." : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { EventCreationForm };