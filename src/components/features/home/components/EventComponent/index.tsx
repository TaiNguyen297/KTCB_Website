import EventCard from "./EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container, Stack, Typography } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import ktcbBackground from "../../../../../../public/posts-background.jpg";

const VolunteerEventComponent = ({ }) => {
    const eventsData = {
        volunteerEvents: [
            {
                id: "1",
                title: "Sự kiện tình nguyện 1",
                poster: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482552zrD/anh-mo-ta.png",
                location: "Địa điểm 1",
                status: "UPCOMING",
                locationLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1234567890123!2d-122.12345678901234!3d37.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085801234567890%3A0x1234567890123456!2sLocation%20Name!5e0!3m2!1sen!2sus!4v1234567890123",
                description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                eventDate: "Ngày 1",
            },
            {
                id: "2",
                title: "Sự kiện tình nguyện 1",
                poster: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482552zrD/anh-mo-ta.png",
                location: "Địa điểm 1",
                status: "UPCOMING",
                locationLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1234567890123!2d-122.12345678901234!3d37.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085801234567890%3A0x1234567890123456!2sLocation%20Name!5e0!3m2!1sen!2sus!4v1234567890123",
                description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                eventDate: "Ngày 1",
            },
            {
                id: "3",
                title: "Sự kiện tình nguyện 1",
                poster: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482552zrD/anh-mo-ta.png",
                location: "Địa điểm 1",
                status: "UPCOMING",
                locationLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1234567890123!2d-122.12345678901234!3d37.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085801234567890%3A0x1234567890123456!2sLocation%20Name!5e0!3m2!1sen!2sus!4v1234567890123",
                description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                eventDate: "Ngày 1",
            },
            {
                id: "4",
                title: "Sự kiện tình nguyện 1",
                poster: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482552zrD/anh-mo-ta.png",
                location: "Địa điểm 1",
                status: "ONGOING",
                locationLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1234567890123!2d-122.12345678901234!3d37.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085801234567890%3A0x1234567890123456!2sLocation%20Name!5e0!3m2!1sen!2sus!4v1234567890123",
                description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                eventDate: "Ngày 1",
            },
            {
                id: "5",
                title: "Sự kiện tình nguyện 1",
                poster: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482552zrD/anh-mo-ta.png",
                location: "Địa điểm 1",
                status: "FINISHED",
                locationLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1234567890123!2d-122.12345678901234!3d37.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085801234567890%3A0x1234567890123456!2sLocation%20Name!5e0!3m2!1sen!2sus!4v1234567890123",
                description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                eventDate: "Ngày 1",
            },
        ],
    };

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
                {eventsData.volunteerEvents.map((event, index) => (
                    <SwiperSlide key={index}>
                        <EventCard event={event} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
}

export default VolunteerEventComponent;