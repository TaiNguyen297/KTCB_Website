import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import logoNoBackground from "../../../public/ktcb_logo_no_background.png";
import footerData from "../../utils/data/json/footer.json";
import { COLORS } from "@/utils/constants";

const TikTokIcon = ({ color = "#000000" }) => {
  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="100%"
      height="100%"
    >
      <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
    </svg>
  );
};

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "100%",
  backgroundColor: theme.palette.common.white,
}));

const Footer = () => {
  return (
    <Stack px={[5, 10, 20]} bgcolor={COLORS.BLUE} width="100%" py={4} mt={2}>
      <Stack
        direction={["column", "row"]}
        justifyContent={["flex-start", "space-between"]}
        flexWrap={["wrap"]}
        alignItems={["flex-start", "center"]}
        bgcolor={COLORS.BLUE}
        py={2}
      >
        <Stack direction={["column", "column", "row"]} flexWrap="wrap">
          <Stack spacing={2} mr={[0, 0, 0, 20]}>
            <Typography variant="h5" fontWeight="bold">
              {footerData.title1}
            </Typography>
            <Typography color="GrayText">{footerData.content1}</Typography>
          </Stack>
          <Stack spacing={2} ml={[0, 0, 4]} mt={[4, 4, 0]}>
            <Typography variant="h5" fontWeight="bold">
              {footerData.title2}
            </Typography>
            <Typography color="GrayText">
              {footerData.content2.mail} <br />
              {footerData.content2.phone}
            </Typography>
          </Stack>
        </Stack>

        <Stack mt={[4, 0, 0]} spacing={2} alignItems="center">
          <Link href="/">
            <Box
              component="img"
              height={50}
              src={logoNoBackground.src}
              alt="Logo"
            ></Box>
          </Link>
          <Stack direction="row" spacing={2}>
            <Link href={footerData.facebookLink} target="_blank">
              <StyledIconButton>
                <FacebookIcon sx={{ fontSize: 30, color: "blue" }} />
              </StyledIconButton>
            </Link>
            <Link href={footerData.youtubeLink} target="_blank">
              <StyledIconButton>
                <YouTubeIcon sx={{ fontSize: 30, color: "red" }} />
              </StyledIconButton>
            </Link>
            <Link href={footerData.tiktokLink} target="_blank">
              <StyledIconButton>
                <div style={{ width: "40px" }}>
                  <TikTokIcon color="black" />
                </div>
              </StyledIconButton>
            </Link>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        direction="row"
        justifyContent={["center", "center", "center", "space-between"]}
        pt={2}
      >
        <Typography color="GrayText">
          © Copyright 2023. All Rights Reserved.
        </Typography>
        <Box display={["none", "none", "none", "block"]}>
          <Stack direction={"row"} spacing={2}>
            {footerData.optionFooter.map((option, index) => (
              <Link key={index} href={option.link}>
                <Typography color="GrayText">{option.text}</Typography>
              </Link>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Footer;
