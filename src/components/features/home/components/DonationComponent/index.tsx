import DonationCard from "./DonationCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container, Stack, Typography, Grid } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import ktcbBackground from "../../../../../../public/posts-background.jpg";

interface Event {
  id: string | number;
  type: string;
  // Add other properties of event as needed
}

interface DonationComponentProps {
  events: Event[];
}

const DonationComponent = ({ events }: DonationComponentProps) => {

  // Lọc chỉ lấy các event gây quỹ (DONATION)
  const donationCampaigns = events.filter((event: any) => event.type === "DONATION");

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
          DANH SÁCH CHIẾN DỊCH GÂY QUỸ
        </Typography>
      </Stack>
      <Stack
        sx={{
          paddingTop: "60px",
          paddingBottom: "60px",
          gap: "30px",
        }}
      >
        <Grid container spacing={2}>
          {donationCampaigns.map((event: any, index: any) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <DonationCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}

export default DonationComponent;