/* eslint-disable @next/next/no-img-element */

import CloseGraySvg from "@public/svgs/close-gray.svg";
import { Box, Skeleton, Typography } from "@mui/material";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FilePreviewType, FileType } from "../upload";

interface PreviewFileProps {
  file: FilePreviewType;
  type: FileType;
  handleDeleteFile: (
    file: FilePreviewType,
    event: React.MouseEvent<HTMLElement>
  ) => void;
}

export const PreviewFile: React.FC<PreviewFileProps> = ({
  file,
  type,
  handleDeleteFile,
}) => {
  const [loadedFile, setLoadedFile] = useState(false);

  const previewItem = useMemo(() => {
    switch (type) {
      case "image":
        return (
          <Box
            component={"div"}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",

              zIndex: 10,
              borderRadius: "4px",
            }}
          >
            {!loadedFile && (
              <Skeleton
                width={"100%"}
                height={"100%"}
                animation="wave"
                sx={{
                  transform: "unset",
                  borderRadius: "4px",
                }}
              />
            )}
            <img
              src={file.preview as string}
              style={{
                width: loadedFile ? "100%" : "0%",
                height: loadedFile ? "100%" : "0%",
                cursor: "pointer",
                objectFit: "contain",
              }}
              alt="file not found"
              onLoad={() => setLoadedFile(true)}
              onError={() => {
                setLoadedFile(true);
              }}
            />
            <Box>
              <Image
                src={CloseGraySvg}
                alt="close-icon"
                width={32}
                height={32}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  transform: "translate(50%, -50%)",
                  padding: "4px",
                  cursor: "pointer",
                  zIndex: 9,
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                }}
                onClick={(event) => handleDeleteFile(file, event)}
              />
            </Box>
          </Box>
        );

      default:
        return <Typography>File không được hỗ trợ</Typography>;
    }
  }, [file, handleDeleteFile, loadedFile, type]);

  return <>{previewItem}</>;
};
