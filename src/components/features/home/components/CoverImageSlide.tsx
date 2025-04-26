/* eslint-disable @next/next/no-img-element */
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import logoImg from "../../../../../public/ktcb-logo-512.png";
import React from "react";

const styleBtn = {
  position: "absolute",
  top: "40%",
  width: 50,
  height: 50,
  backgroundColor: "#eee",
  opacity: 0.5,
  "&:hover": {
    backgroundColor: "#eee",
    opacity: 1,
  },
};

type CoverImageSlideType = {
  coverImageData: string[];
};

const renderNextButton = (props: { isDisabled?: boolean }) => (
  <IconButton
    disabled={props.isDisabled}
    sx={{
      ...styleBtn,
      right: 0,
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

const renderPrevButton = (props: { isDisabled?: boolean }) => (
  <IconButton
    disabled={props.isDisabled}
    sx={{
      ...styleBtn,
      left: 0,
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

export const CoverImageSlide: React.FC<CoverImageSlideType> = ({
  coverImageData,
}) => {
  const listImageCard = coverImageData.map((url, index) => (
    <Box className="relative w-full h-[90vh]" key={`${index}${url}`}>
      <Box component="img" width="100%" height="100%" src={url} />

      {/* <img
        className="absolute top-1 left-1 w-12 h-12 object-cover z-10"
        src={logoImg.src}
        alt="banner"
      /> */}
    </Box>
  ));

  return (
    <AliceCarousel
      disableDotsControls
      autoPlay
      infinite
      autoPlayInterval={8000}
      items={listImageCard}
      disableButtonsControls={false}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
    />
  );
};
