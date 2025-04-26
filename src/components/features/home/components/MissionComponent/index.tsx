import { Container, Grid, Stack, Typography } from "@mui/material";
import { MissionCard } from "./MissionCard";
import ktcbBackground from "../../../../../../public/mission-background.jpg";

type MissionProps = {
  missionCartData: {
    title: string;
    imageUrl: string;
    description: string;
  }[];
};

export const MissionComponent: React.FC<MissionProps> = ({
  missionCartData,
}) => {
  return (
    <Container
      sx={{
        maxWidth: "1900px !important",
        paddingTop: 7,
        paddingBottom: 12,
        backgroundImage: `url(${ktcbBackground.src})`,
        backgroundSize: "100% 100%;",
        backgroundPosition: "center",
      }}
    >
      <Stack alignItems="center">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "3rem",
            },
          }}
        >
          SỨ MỆNH RA ĐỜI VÀ HOẠT ĐỘNG
        </Typography>
      </Stack>

      <Grid container spacing={5} my={1} sx={{ justifyContent: "center" }}>
        {missionCartData.map((mission, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <MissionCard key={mission.title} missionCard={mission} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
