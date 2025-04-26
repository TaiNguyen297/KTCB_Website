import styled from "@emotion/styled";
import { Skeleton, Typography } from "@mui/material";

export const ReadMore = styled(Typography)({
  color: "#fff",
  textAlign: "right",
  fontSize: "14px",
  fontWeight: 600,
  transition: "all 0.3s ease-in-out",
  transform: "translateY(100%)",
  opacity: 0,
  visibility: "hidden",
});

export const ImageLoader = styled(Skeleton)({
  transform: "unset",
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: "unset",
});
