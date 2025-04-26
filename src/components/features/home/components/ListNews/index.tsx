/* eslint-disable @next/next/no-img-element */

import { INews } from "@/@types/news";
import { getHighlightNews, getMediumNews } from "@/utils/common";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { CardNews } from "./CardNews";
import { useMemo } from "react";
import ktcbBackground from "../../../../../../public/posts-background.jpg";

interface Props {
  team: string;
}

const ListNewsHome: NextPage<Props> = ({ team }) => {
  const highlightNews = getHighlightNews(team);
  const mediumNews = getMediumNews(team);
  const listNew = useMemo(() => {
    return [highlightNews, ...mediumNews.slice(0, 5)].filter((x) => x);
  }, [highlightNews, mediumNews]);

  return listNew && listNew?.length > 0 ? (
    <Container
      sx={{
        maxWidth: "1900px !important",
        paddingTop: 0,
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
          TIN TỨC GẦN ĐÂY
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
          {listNew.map((news, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <CardNews
                banner_url={news?.banner_url}
                slug={news?.slug}
                title={news?.title}
                description={news?.description}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  ) : null;
};

export default ListNewsHome;
