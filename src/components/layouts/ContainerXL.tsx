import { Container, SxProps, Theme } from "@mui/material";
import React from "react";

export const ContainerXL = ({
  children,
  sx,
}: {
  children: React.ReactElement;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        ...sx,
      }}
    >
      <div className="lg:ps-6 lg:pe-6 pr-4 pl-4">{children}</div>
    </Container>
  );
};
