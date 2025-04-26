import { Box, Button, Modal } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";
import { FieldError, FieldValues, UseFormSetError } from "react-hook-form";
import { PreviewFile } from "../components/PreviewFile";
import { InputControl } from "../components/InputControl";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDisclosure } from "@/libs/hooks/useDisclosure";

const MAX_SIZE = 200;

type UploadFileProps<T extends FieldValues> = {
  onChange?: (file: File | null) => void;
  fullWidth?: boolean;
  helperText?: string;
  error?: FieldError | boolean;
  setError?: UseFormSetError<T>;
  name: keyof T;
  label?: string;
  previewUrl?: string;
  hasPreviewUrl?: boolean;
  required?: boolean;
  notShowText?: boolean;
} & DropzoneOptions;

export type FilePreviewType = {
  preview: string;
} & File;

export type FileType = "image";

export const UploadFile = <T extends FieldValues>({
  fullWidth,
  onChange,
  helperText,
  error,
  setError,
  name,
  label,
  previewUrl,
  hasPreviewUrl,
  required,
  notShowText,
  ...props
}: UploadFileProps<T>) => {
  const [files, setFiles] = useState<FilePreviewType[]>([]);
  const [typeFile, setTypeFile] = useState<FileType>("image");
  const [firstHasPreview, setFirstHasPreview] = useState(false);
  const [openedPreview, { open: openPreview, close: closePreview }] =
    useDisclosure(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length) {
        setError?.(name as never, {
          type: "manual",
          message: fileRejections[0].errors[0].message,
        });
      }

      if (acceptedFiles.length) {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );

        const type = acceptedFiles[0].type.split("/")[0] as FileType;
        if (type && type.length > 0) {
          setTypeFile(type);
        } else {
          const type = acceptedFiles[0].name.split(".")[1] as FileType;
          setTypeFile(type);
        }

        onChange?.(acceptedFiles[0]);
      }
    },
    [name, onChange, setError]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    validator: (file) => {
      const fileSize = file?.size;
      const maxSize = MAX_SIZE * 1024 * 1024;

      if (fileSize > maxSize) {
        return {
          code: "file-too-large",
          message: "File quá lớn",
        };
      }

      return null;
    },
    multiple: false,
    ...props,
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleDeleteFile = (
    file: FilePreviewType,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();

    const newFiles = files.filter((f) => f.preview !== file.preview);

    setFiles(newFiles);
    setTypeFile("image");
    onChange?.(newFiles.length ? newFiles[0] : null);

    closePreview();
  };

  useEffect(() => {
    if (previewUrl && hasPreviewUrl && !firstHasPreview) {
      setFiles([{ preview: previewUrl }] as FilePreviewType[]);
      setFirstHasPreview(true);
    }
  }, [previewUrl, firstHasPreview, hasPreviewUrl]);

  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      required={required}
      helperText={helperText}
    >
      <div {...getRootProps()} className="flex flex-1 justify-center gap-3">
        <input {...getInputProps()} />

        <Button
          variant="contained"
          sx={{
            width: "fit-content",
          }}
          color="secondary"
          onClick={open}
        >
          <FileUploadIcon /> {notShowText ? null : "Tải lên"}
        </Button>

        {files.length > 0 ? (
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
            }}
            color="secondary"
            onClick={openPreview}
          >
            <VisibilityIcon /> {notShowText ? null : "Xem ảnh"}
          </Button>
        ) : null}
      </div>
      {files.length > 0 && (
        <Modal open={openedPreview} onClose={closePreview}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80vw",
              height: {
                xs: "auto",
                md: "80vh",
              },
              backgroundColor: "#000",
            }}
          >
            <PreviewFile
              file={files[0]}
              type={typeFile}
              handleDeleteFile={handleDeleteFile}
            />
          </Box>
        </Modal>
      )}
    </InputControl>
  );
};
