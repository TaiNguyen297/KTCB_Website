import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { Box, Button, DialogActions, Grid, TextField, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { ImageUploader } from "../event-management/event/ImageUploader";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export interface PostFormValues {
  id?: number;
  title: string;
  slug: string;
  summary: string;
  image?: string;
  author?: string;
  published?: boolean;
  isHighlight?: boolean;
  content?: string;
}

interface PostFormProps {
  open: boolean;
  initialValues?: Partial<PostFormValues>;
  onSuccess: (values: PostFormValues) => void;
  onCancel?: () => void;
}

export default function PostForm({open, initialValues, onSuccess, onCancel }: PostFormProps) {
  const { handleSubmit, control, reset, watch, setValue } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      image: "",
      author: "",
      published: false,
      isHighlight: false,
      content: "",
      ...initialValues,
    },
  });

  useEffect(() => {
    reset({
      title: "",
      slug: "",
      summary: "",
      image: "",
      author: "",
      published: false,
      isHighlight: false,
      content: "",
      ...initialValues,
    });
  }, [initialValues, reset]);

  const handleImageChange = (imageUrl: string) => {
    setValue("image", imageUrl);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onCancel} 
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
      <DialogTitle sx={{ paddingBottom: 1 }}>
        {initialValues?.id ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1, mb: 1 }}>
          <form onSubmit={handleSubmit(onSuccess)}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Vui lòng nhập tiêu đề" }}
                  render={({ field, fieldState }) => (
                    <TextField 
                      {...field} 
                      label="Tiêu đề" 
                      fullWidth 
                      required 
                      variant="outlined"
                      margin="dense"
                      placeholder="Nhập tiêu đề bài viết"
                      error={!!fieldState.error} 
                      helperText={fieldState.error?.message} 
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="slug"
                  control={control}
                  rules={{ required: "Vui lòng nhập slug" }}
                  render={({ field, fieldState }) => (
                    <TextField 
                      {...field} 
                      label="Slug (URL)" 
                      fullWidth 
                      required 
                      variant="outlined"
                      margin="dense"
                      placeholder="viet-tat-khong-dau"
                      error={!!fieldState.error} 
                      helperText={fieldState.error?.message || "Không dấu, cách nhau bằng dấu gạch ngang"} 
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <TextField 
                      {...field} 
                      label="Tác giả" 
                      fullWidth 
                      variant="outlined"
                      margin="dense"
                      placeholder="Nhập tên tác giả"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="summary"
                  control={control}
                  rules={{ required: "Vui lòng nhập mô tả ngắn" }}
                  render={({ field, fieldState }) => (
                    <TextField 
                      {...field} 
                      label="Mô tả ngắn" 
                      fullWidth 
                      required 
                      multiline 
                      rows={2}
                      variant="outlined"
                      margin="dense"
                      placeholder="Nhập mô tả ngắn cho bài viết"
                      error={!!fieldState.error} 
                      helperText={fieldState.error?.message} 
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>
                  Hình ảnh bài viết
                </Typography>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader 
                      currentImage={field.value} 
                      onImageChange={handleImageChange}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Vui lòng nhập nội dung" }}
                  render={({ field }) => (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>
                        Nội dung chi tiết
                      </Typography>
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Viết nội dung chi tiết cho bài viết của bạn..."
                        style={{ height: '300px', marginBottom: '3rem' }}
                      />
                    </Box>
                  )}
                />
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Controller
                  name="published"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel 
                      control={<Switch {...field} checked={!!field.value} />} 
                      label="Đã đăng" 
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Controller
                  name="isHighlight"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel 
                      control={<Switch {...field} checked={!!field.value} />} 
                      label="Nổi bật" 
                    />
                  )}
                />
              </Grid>
            </Grid>
            
            <DialogActions sx={{ mt: 2, px: 0 }}>
              <Button onClick={onCancel} color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained">
                Lưu
              </Button>
            </DialogActions>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
