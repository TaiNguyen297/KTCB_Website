import { CSSProperties } from "react";

export const hoverReadMore = {
  "&:hover": {
    "& .read-more": {
      transform: "translateY(0)",
      opacity: 1,
      visibility: "visible",
      transition: "all 0.3s ease-in-out",
    },
  },
};

export const imageAbsolute: CSSProperties = {
  position: "absolute",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const imageRelative: CSSProperties = {
  display: "block",
  overflow: "hidden",
  position: "relative",
  width: "100%",
  height: "100%",
};
