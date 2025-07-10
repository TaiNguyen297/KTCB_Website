import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Paper, 
  IconButton, 
  Grid,
  Chip
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

interface MultipleImageUploaderProps {
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({ 
  currentImages = [], 
  onImagesChange,
  maxImages = 10
}) => {
  const [images, setImages] = useState<string[]>(currentImages);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImages(currentImages);
  }, [currentImages]);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dt5gcqfsy";
  const UPLOAD_PRESET = "ktcb_cloudinary";

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url || null;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const addImage = (imageUrl: string) => {
    if (imageUrl && !images.includes(imageUrl) && images.length < maxImages) {
      const newImages = [...images, imageUrl];
      setImages(newImages);
      onImagesChange(newImages);
      setUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const editImage = (index: number) => {
    setEditingIndex(index);
    setEditUrl(images[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editUrl) {
      const newImages = [...images];
      newImages[editingIndex] = editUrl;
      setImages(newImages);
      onImagesChange(newImages);
      setEditingIndex(null);
      setEditUrl('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditUrl('');
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      addImage(urlInput.trim());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (images.length >= maxImages) break;
      
      if (file.type.startsWith('image/')) {
        const url = await uploadToCloudinary(file);
        if (url) {
          addImage(url);
        }
      }
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (images.length >= maxImages) break;
      
      if (file.type.startsWith('image/')) {
        const url = await uploadToCloudinary(file);
        if (url) {
          addImage(url);
        }
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Input URL */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="URL hình ảnh"
          variant="outlined"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Nhập URL hình ảnh"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUrlSubmit();
            }
          }}
        />
      </Box>

      {/* Upload Area */}
      {images.length < maxImages && (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'grey.400',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
            mb: 2,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            Kéo thả hình ảnh vào đây hoặc
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            Chọn hình ảnh
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Có thể chọn nhiều ảnh cùng lúc. Tối đa {maxImages} ảnh.
          </Typography>
        </Box>
      )}

      {/* Current Images */}
      {images.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2">
              Ảnh đã thêm ({images.length}/{maxImages})
            </Typography>
            {images.length >= maxImages && (
              <Chip 
                label="Đã đạt giới hạn" 
                color="warning" 
                size="small" 
              />
            )}
          </Box>
          
          <Grid container spacing={2}>
            {images.map((imageUrl, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 1 }}>
                  {editingIndex === index ? (
                    // Edit mode
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" onClick={saveEdit} variant="contained">
                          Lưu
                        </Button>
                        <Button size="small" onClick={cancelEdit}>
                          Hủy
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // View mode
                    <>
                      <Box
                        component="img"
                        src={imageUrl}
                        alt={`Ảnh ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mb: 1
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => editImage(index)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => removeImage(index)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {images.length === 0 && (
        <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 2 }}>
          Chưa có ảnh nào được thêm
        </Typography>
      )}
    </Box>
  );
};
