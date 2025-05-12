import DonationCard from "./DonationCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container, Stack, Typography, Grid } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import ktcbBackground from "../../../../../../public/posts-background.jpg";

const DonationComponent = ({ }) => {
   const campaigns = [
  {
    id: "1",
    title: "Quyên góp cho trẻ em vùng cao",
    poster: "https://source.unsplash.com/featured/?children,donation",
    description: "Gây quỹ hỗ trợ học tập và sinh hoạt cho các em nhỏ vùng cao Tây Bắc.",
    startDate: "2025-05-01",
    endDate: "2025-06-15",
    progress: 65,
    raisedAmount: 15000000,
    status: "active",
  },
  {
    id: "2",
    title: "Ủng hộ nạn nhân thiên tai miền Trung",
    poster: "https://source.unsplash.com/featured/?flood,donation",
    description: "Chung tay giúp đỡ các hộ dân bị ảnh hưởng bởi lũ lụt tại miền Trung.",
    startDate: "2025-04-15",
    endDate: "2025-05-30",
    progress: 90,
    raisedAmount: 45000000,
    status: "active",
  },
  {
    id: "3",
    title: "Xây giếng nước sạch cho vùng hạn",
    poster: "https://source.unsplash.com/featured/?water,donation",
    description: "Dự án cung cấp nước sạch cho người dân ở các khu vực hạn hán.",
    startDate: "2025-03-10",
    endDate: "2025-04-20",
    progress: 100,
    raisedAmount: 30000000,
    status: "finished",
  },
  {
    id: "4",
    title: "Tặng quà Tết cho người vô gia cư",
    poster: "https://source.unsplash.com/featured/?homeless,donation",
    description: "Chương trình tặng quà Tết, áo ấm và thức ăn cho người vô gia cư tại TP.HCM.",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    progress: 10,
    raisedAmount: 2000000,
    status: "upcoming",
  }
];

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
                    {campaigns.map((event, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <DonationCard event={event} />
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Container>
    );
}

export default DonationComponent;