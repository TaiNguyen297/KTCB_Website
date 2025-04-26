/* eslint-disable @next/next/no-img-element */
import { Box, Paper, Stack, Typography } from "@mui/material";
import logoImg from "../../../../../../../public/ktcb-logo-512.png";

type MissionCardProps = {
  missionCard: { title: string; imageUrl: string; description: string };
};

export const MissionCard: React.FC<MissionCardProps> = ({ missionCard }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: "10px",
        boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.1)",
        height: "100%",
        position: "relative",
      }}
    >
      <Stack
        sx={{
          px: {
            xs: 4,
            md: 8,
          },
          py: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Stack className="relative" alignItems="center">
          {/* <img
            className="absolute top-1 left-1 w-12 h-12 object-cover z-10"
            src={logoImg.src}
            alt="banner"
          /> */}
          <Box
            height="170px"
            component="img"
            src={missionCard.imageUrl}
            alt="mission-image"
            sx={{
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </Stack>

        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            {missionCard.title}
          </Typography>
          <Typography
            mt={1}
            fontSize="22px"
            textAlign="center"
            color="GrayText"
          >
            {missionCard.description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
