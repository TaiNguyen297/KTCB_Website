import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { ImageUploader } from "./ImageUploader";
import { MultipleImageUploader } from "./MultipleImageUploader";

interface EventReportFormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  eventId?: number;
  loading?: boolean;
  type?: string;
  initialValues?: any; // Thêm prop này để truyền dữ liệu khi sửa
}

interface EventReportFormState {
  totalDonation: string;
  totalParticipant: string;
  totalHour: string;
  summary: string;
  resultImages: string[];
  achievements: string;
}

const ReportFormState: EventReportFormState = {
  totalDonation: "",
  totalParticipant: "",
  totalHour: "",
  summary: "",
  resultImages: [],
  achievements: "",
};

const EventReportForm: React.FC<EventReportFormProps> = ({ onSubmit, onCancel, eventId, loading, type, initialValues }) => {
  const [form, setForm] = useState<EventReportFormState>({ ...ReportFormState });

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...ReportFormState,
        ...initialValues,
        // convert array to string for achievements and handle resultImages as array
        achievements: Array.isArray(initialValues.achievements) ? initialValues.achievements.join("\n") : initialValues.achievements || "",
        resultImages: Array.isArray(initialValues.resultImages) ? initialValues.resultImages : (initialValues.resultImages ? [initialValues.resultImages] : []),
      });
    } else {
      setForm({ ...ReportFormState });
    }
  }, [eventId, initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({ ...ReportFormState });
  };

  const handleImageChange = (images: string[]) => {
    setForm((prev) => ({
      ...prev,
      resultImages: images,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      eventId,
      resultImages: form.resultImages, // Already an array
      achievements: form.achievements.split("\n").map((s) => s.trim()).filter(Boolean),
      totalDonation: Number(form.totalDonation),
      totalParticipant: Number(form.totalParticipant),
      totalHours: Number(form.totalHour),
    });
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Báo cáo sự kiện</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Grid container spacing={2}>
              {type === "DONATION" && (
                <Grid item xs={12} >
                  <TextField
                    name="totalDonation"
                    label="Tổng số tiền quyên góp"
                    value={form.totalDonation}
                    onChange={handleChange}
                    required
                    fullWidth
                    type="number"
                    margin="dense"
                    placeholder="Nhập tổng số tiền quyên góp"
                  />
                </Grid>
              )}
              {type === "VOLUNTEER" && (
                <Grid item xs={12} >
                  <TextField
                    name="totalParticipant"
                    label="Tổng số tình nguyện viên"
                    value={form.totalParticipant}
                    onChange={handleChange}
                    required
                    fullWidth
                    type="number"
                    margin="dense"
                    placeholder="Nhập tổng số tình nguyện viên"
                  />
                </Grid>
              )}
               {type === "VOLUNTEER" && (
                <Grid item xs={12} >
                  <TextField
                    name="totalHour"
                    label="Tổng thời gian tình nguyện (giờ)"
                    value={form.totalHour}
                    onChange={handleChange}
                    required
                    fullWidth
                    type="number"
                    margin="dense"
                    placeholder="Nhập tổng thời gian tình nguyện (giờ)"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="summary"
                  label="Tóm tắt sự kiện"
                  value={form.summary}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={2}
                  margin="dense"
                  placeholder="Nhập tóm tắt sự kiện"
                />
              </Grid>
               {type === "VOLUNTEER" && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Ảnh kết quả sự kiện tình nguyện
                </Typography>
                <MultipleImageUploader
                  currentImages={form.resultImages}
                  onImagesChange={handleImageChange}
                  maxImages={8}
                />
              </Grid>
               )}
               {type === "DONATION" && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Ảnh kết quả sự kiện quyên góp
                </Typography>
                <MultipleImageUploader
                  currentImages={form.resultImages}
                  onImagesChange={handleImageChange}
                  maxImages={8}
                />
              </Grid>
               )}
              <Grid item xs={12}>
                <TextField
                  name="achievements"
                  label="Thành tích nổi bật "
                  value={form.achievements}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  margin="dense"
                  placeholder="Nhập thành tích nổi bật"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset} color="inherit" startIcon={<RefreshIcon />}>Làm mới</Button>
          <Button onClick={onCancel} color="inherit">Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? "Đang xử lý..." : "Lưu báo cáo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventReportForm;
