import React from "react";
import { Container as MUIContainer, SxProps, Theme } from "@mui/material";

export const Container = ({
  children,
  sx,
}: {
  children: React.ReactElement;
  sx?: SxProps<Theme>;
}) => {
  return (
    <MUIContainer
      sx={{
        maxWidth: "1900px !important",
        ...sx,
      }}
    >
      {children}
    </MUIContainer>
  );
};
