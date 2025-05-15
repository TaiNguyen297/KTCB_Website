import React, { useState, useRef } from 'react';
import { Box, Button, Typography, TextField, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentImage = '', 
  onImageChange 
}) => {
  const [urlInput, setUrlInput] = useState(currentImage);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlInput(newUrl);
    if (newUrl) {
      setPreviewUrl(newUrl);
      onImageChange(newUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Trong thực tế, bạn sẽ cần uploading file lên server và lấy URL
      // Ở đây chúng ta chỉ tạo một URL local để preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Giả lập upload file và nhận URL từ server sau 1 giây
      setTimeout(() => {
        // Trong ứng dụng thực tế, đây sẽ là URL trả về từ server sau khi upload
        const fakeServerUrl = objectUrl;
        setUrlInput(fakeServerUrl);
        onImageChange(fakeServerUrl);
      }, 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Tương tự như handleFileChange
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        setTimeout(() => {
          const fakeServerUrl = objectUrl;
          setUrlInput(fakeServerUrl);
          onImageChange(fakeServerUrl);
        }, 1000);
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
      <TextField
        fullWidth
        label="URL hình ảnh"
        variant="outlined"
        value={urlInput}
        onChange={handleUrlChange}
        sx={{ mb: 2 }}
        placeholder="Nhập URL hình ảnh hoặc tải lên"
      />
      
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
      </Box>
      
      {previewUrl && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 1, 
            mt: 2, 
            backgroundColor: 'background.default',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Xem trước hình ảnh:
          </Typography>
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              maxWidth: '100%',
              maxHeight: '200px',
              objectFit: 'contain',
            }}
            onError={() => {
              setPreviewUrl('');
            }}
          />
        </Paper>
      )}
    </Box>
  );
}; 