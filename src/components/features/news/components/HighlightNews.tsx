/* eslint-disable @next/next/no-img-element */
import { ReadMore } from "@/styles/styled";
import { ellipsisText } from "@/utils/common";
import { Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { hoverReadMore } from "@/styles/commonStyles";
import logoImg from "../../../../../public/ktcb-logo-512.png";

interface Props {
  title: string;
  banner_url: string;
  description: string;
  slug: string;
}

export const HighlightNews: React.FC<Props> = ({
  title,
  banner_url,
  description,
  slug,
}) => {
  return (
    <Link href={`/${slug}`}>
      <Grid
        className="relative"
        container
        sx={{
          height: "400px",
          background: `url(${banner_url}) no-repeat center center`,
          borderRadius: "12px",
          overflow: "hidden",

          ...hoverReadMore,
        }}
      >
        {/* <img
          className="absolute top-1 left-1 w-12 h-12 object-cover z-10"
          src={logoImg.src}
          alt="banner"
        /> */}

        <Grid
          item
          md={8}
          sm={5}
          xs={0}
          sx={{
            height: {
              xs: "300px",
              md: "inherit",
            },
          }}
        ></Grid>
        <Grid
          item
          md={4}
          sm={7}
          xs={12}
          sx={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          />
          <Stack
            sx={{
              padding: {
                xs: "40px",
                md: "20px",
              },
              height: "100%",
              backdropFilter: "blur(10px)",
              justifyContent: "space-evenly",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "26px",
                fontWeight: "700",

                ...ellipsisText(2),
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                textAlign: "justify",

                ...ellipsisText(5),

                WebkitLineClamp: {
                  xs: 5,
                  md: 7,
                },
              }}
            >
              {description}
            </Typography>
            <ReadMore
              className="read-more"
              sx={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
              }}
            >
              Đọc tiếp
            </ReadMore>
          </Stack>
        </Grid>
      </Grid>
    </Link>
  );
};
