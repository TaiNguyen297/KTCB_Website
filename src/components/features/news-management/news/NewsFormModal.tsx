import { INews } from "@/@types/news";
import { TEAM_NAME } from "@/utils/constants";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
import { FC, useEffect, useState } from "react";

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingNews?: INews | null;
}

export const NewsFormModal: FC<NewsFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingNews,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    banner_url: "",
    author: "",
    tags: [] as string[],
    team: [] as string[],
    is_highlight: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    banner_url: "",
  });

  useEffect(() => {
    if (editingNews) {
      setFormData({
        title: editingNews.title || "",
        description: editingNews.description || "",
        banner_url: editingNews.banner_url || "",
        author: editingNews.author || "",
        tags: editingNews.tags || [],
        team: Array.isArray(editingNews.team)
          ? editingNews.team
          : editingNews.team
          ? [editingNews.team]
          : [],
        is_highlight: editingNews.is_highlight || false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        banner_url: "",
        author: "",
        tags: [],
        team: [],
        is_highlight: false,
      });
    }
    setErrors({
      title: "",
      description: "",
      banner_url: "",
    });
  }, [editingNews, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      banner_url: "",
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
      isValid = false;
    }

    if (!formData.banner_url.trim()) {
      newErrors.banner_url = "Vui lòng nhập URL ảnh bìa";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        slug: editingNews?.slug,
      });
    }
  };

  const teamOptions = [
    { label: "Cùng bé trải nghiệm", value: TEAM_NAME.CUNG_BE_TRAI_NGHIEM },
    { label: "Kiến trúc sư tình nguyện", value: TEAM_NAME.KIEN_TRUC_SU_TINH_NGUYEN },
    { label: "Truyền thông", value: TEAM_NAME.TRUYEN_THONG },
    { label: "Nội dung", value: TEAM_NAME.NOI_DUNG },
    { label: "Quỹ KTCB", value: TEAM_NAME.QUY_KTCB },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "10px",
          padding: "10px",
        },
      }}
    >
      <DialogTitle>
        {editingNews ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextField
            label="Tiêu đề"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
            margin="normal"
          />

          <TextField
            label="Tác giả"
            name="author"
            value={formData.author}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="URL ảnh bìa"
            name="banner_url"
            value={formData.banner_url}
            onChange={handleChange}
            fullWidth
            error={!!errors.banner_url}
            helperText={errors.banner_url}
            margin="normal"
          />

          <Autocomplete
            multiple
            options={teamOptions}
            getOptionLabel={(option) => option.label}
            value={teamOptions.filter(option => formData.team.includes(option.value))}
            onChange={(event, newValue) => {
              setFormData(prev => ({
                ...prev,
                team: newValue.map(item => item.value)
              }));
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Teams"
                margin="normal"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.label}
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
          />

          <div className="md:col-span-2">
            <Autocomplete
              multiple
              freeSolo
              options={formData.tags}
              value={formData.tags}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  tags: newValue
                }));
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Tags (nhập và nhấn Enter để thêm)" 
                  margin="normal"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextField
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              margin="normal"
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_highlight}
                onChange={handleCheckboxChange}
                name="is_highlight"
              />
            }
            label="Đánh dấu là bài viết nổi bật"
          />
        </div>

        {formData.banner_url && (
          <div className="mt-4">
            <p className="mb-2 text-gray-700 font-medium">Xem trước ảnh bìa:</p>
            <img
              src={formData.banner_url}
              alt="Banner preview"
              className="max-h-40 rounded border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Hình+ảnh+không+hợp+lệ";
              }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingNews ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
