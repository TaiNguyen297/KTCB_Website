import { INews } from "@/@types/news";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { CardNews } from "./CardNews";

type SlideNewsProps = {
  slideNewsData: INews[];
};

const responsive = {
  0: {
    items: 1,
  },
  600: {
    items: 2,
  },
  1024: {
    items: 3,
  },
  1200: {
    items: 3,
  },
};

const styleIcon = {
  position: "absolute",
  top: "40%",
  width: 50,
  height: 50,
  backgroundColor: "#eee",
  "&:hover": {
    backgroundColor: "#eee",
  },
};

const renderNextButton = (props: { isDisabled?: boolean }) => (
  <IconButton
    disabled={props.isDisabled}
    sx={{
      ...styleIcon,
      right: -55,
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

const renderPrevButton = (props: { isDisabled?: boolean }) => (
  <IconButton
    disabled={props.isDisabled}
    sx={{
      ...styleIcon,
      left: -55,
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

export const SlideNews: React.FC<SlideNewsProps> = ({ slideNewsData }) => {
  const listCard = slideNewsData.map((newsData) => (
    <Box
      key={newsData.title}
      p={2}
      sx={{
        borderRadius: "10px",
        "&:hover": {
          backgroundColor: "lightblue",
        },
      }}
    >
      <CardNews
        title={newsData.title}
        banner_url={newsData.banner_url}
        slug={newsData.slug}
        description={newsData.description}
      />
    </Box>
    // <NewsCard key={newsData.title} newsData={newsData} />
  ));

  return (
    <AliceCarousel
      disableDotsControls
      responsive={responsive}
      items={listCard}
      disableButtonsControls={false}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
    />
  );
};
