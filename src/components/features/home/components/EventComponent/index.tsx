import EventCard from "./EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container, Stack, Typography } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import ktcbBackground from "../../../../../../public/posts-background.jpg";

const VolunteerEventComponent =  ({ events }: { events: any[] }) => {
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
                    mb={10}
                    sx={{
                        fontSize: {
                            xs: "1.5rem",
                            sm: "2rem",
                            md: "3rem",
                        },
                    }}
                >
                    SỰ KIỆN TÌNH NGUYỆN
                </Typography>
            </Stack>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                navigation={true}
                slidesPerView={1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1280: { slidesPerView: 3 },
                    1530: { slidesPerView: 4 },
                }}
            >
                {events.map((event, index) => (
                    <SwiperSlide key={index}>
                        <EventCard event={event} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
}

export default VolunteerEventComponent;