/* eslint-disable @next/next/no-img-element */

import { CardNews, HighlightNews } from "@/components/features/news";
import { ListSmallNews } from "@/components/features/news/ListSmallNews";
import { SEO } from "@/configs/seo.config";
import { getHighlightNews, getMediumNews } from "@/utils/common";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { DefaultSeo } from "next-seo";
import logoImg from "../../../public/ktcb-logo-512.png";
import styles from "@/styles/News.module.css";
import { useRouter } from "next/router";
import { CoverImageBrand } from "@/components/features/home/components/CoverImageBrand";

const ListNews = () => {
  const route = useRouter();
  const { team } = route.query;
  const teamParam = team as string | undefined;

  const highlightNews = getHighlightNews(team as string | undefined);
  const mediumNews = getMediumNews(team as string | undefined);

  return (
    <>
      <DefaultSeo {...SEO} title={"Danh sách bài viết"} />

      <Stack>
        <Box className="relative">
          {/* <img
            className="absolute top-1 left-1 w-12 h-12 object-cover z-10"
            src={logoImg.src}
            alt="banner"
          /> */}

          <CoverImageBrand team={teamParam} />
        </Box>

        {highlightNews || mediumNews ? (
          <Container maxWidth="xl">
            <Stack
              sx={{
                paddingTop: "40px",
                paddingBottom: "40px",
                gap: "30px",
              }}
            >
              {highlightNews ? (
                <HighlightNews
                  banner_url={highlightNews?.banner_url}
                  description={highlightNews?.description}
                  slug={highlightNews?.slug}
                  title={highlightNews?.title}
                />
              ) : null}

              {mediumNews && mediumNews.length > 0 ? (
                <Grid container spacing={2}>
                  {mediumNews.map((news, index) => (
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
              ) : null}

              <ListSmallNews />
            </Stack>
          </Container>
        ) : null}
      </Stack>
    </>
  );
};

export default ListNews;
