/* eslint-disable @next/next/no-img-element */
import { DataResponseInfinite } from "@/@types/common";
import { INews } from "@/@types/news";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { imageAbsolute, imageRelative } from "@/styles/commonStyles";
import { ellipsisText, loadMoreNews } from "@/utils/common";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";
import logoImg from "../../../../public/ktcb-logo-512.png";

export const NewsLoadMore = () => {
  const [newsSelected, setNewsSelected] = useState<INews>();

  const [opened, { open, close }] = useDisclosure(false);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery<DataResponseInfinite<INews[]>>(
      ["smallNews"],
      async ({ pageParam = null }) => {
        const res = await loadMoreNews(pageParam);

        const data = res.data.map((item) => ({
          ...item,
          src: item.banner_url,
        }));

        return {
          ...res,
          data,
        };
      },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage?.pageKey) {
            return lastPage.pageKey;
          }

          return undefined;
        },
      }
    );

  const dataFlat = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data)?.filter((d) => d);
  }, [data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <Container
      sx={{
        maxWidth: "1900px !important",
      }}
    >
      <Stack
        sx={{
          gap: {
            xs: "20px",
            sm: "25px",
            md: "30px",
          },
        }}
      >
        {!(isFetching && !isFetchingNextPage) ? (
          <Grid container spacing={1}>
            {dataFlat && dataFlat?.length > 0
              ? dataFlat.map((item, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        ...imageRelative,

                        background: "#f4f4f4",
                        paddingTop: "60%",
                        borderRadius: "10px",
                      }}
                    >
                      {/* <img
                        className="absolute top-1 left-1 w-12 h-12 object-cover z-10"
                        src={logoImg.src}
                        alt="banner"
                      /> */}

                      <Box
                        component="img"
                        src={item.banner_url}
                        alt="banner_url"
                        sx={{
                          ...imageAbsolute,

                          cursor: "pointer",
                          transform: "scale(1)",
                          transition: "transform 0.3s ease-in-out",
                          overflow: "hidden",

                          "&:hover": {
                            transform: "scale(1.1) !important",
                            transition: "transform 0.3s ease-in-out !important",
                          },
                        }}
                        onClick={() => {
                          setNewsSelected(item);
                          open();
                        }}
                        loading="lazy"
                      />
                    </Box>
                  </Grid>
                ))
              : null}
          </Grid>
        ) : (
          <Box sx={{ display: "flex" }}>
            <CircularProgress
              size={"16px"}
              sx={{
                color: "#fff",
              }}
            />
          </Box>
        )}

        {hasNextPage && (
          <LoadingButton
            variant="outlined"
            onClick={handleLoadMore}
            disabled={!hasNextPage || isFetchingNextPage}
            loading={isFetchingNextPage}
            sx={{
              alignSelf: "center",
              width: "fit-content",
            }}
          >
            Xem thêm
          </LoadingButton>
        )}
      </Stack>

      <Modal open={opened} onClose={close}>
        {newsSelected ? (
          <Grid
            container
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "94vw",
              width: "100%",
              height: "auto",
              minHeight: "700px",
              bgcolor: "background.paper",
            }}
          >
            <Grid
              item
              md={9}
              xs={12}
              sx={{
                position: "relative",
                paddingTop: "50%",
                backgroundColor: "#000",
                paddingRight: "16px",
                paddingLeft: "16px",
              }}
            >
              {/* <img
                className="logo absolute opacity-0 w-12 h-12 object-cover z-10"
                src={logoImg.src}
                alt="banner"
              /> */}

              <Box
                component="img"
                src={newsSelected.banner_url}
                alt="news"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  height: "auto",
                  objectFit: "contain",

                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement as HTMLDivElement;

                  const top = (parent.offsetHeight - target.height) / 2;
                  const left = (parent.offsetWidth - target.width) / 2;

                  const logo = parent.querySelector(
                    ".logo"
                  ) as HTMLImageElement;

                  if (logo) {
                    logo.style.top = `${top + 8}px`;
                    logo.style.left = `${left + 8}px`;
                    logo.style.opacity = "1";
                  }
                }}
              />
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
              p={2}
              sx={{
                backgroundColor: "#242526",
              }}
            >
              <Typography
                sx={{
                  color: "#e4e6eb",
                  fontSize: "26px",
                  fontWeight: "700",
                  ...ellipsisText(1),
                }}
              >
                {newsSelected.title}
              </Typography>

              <Typography
                sx={{
                  color: "#e4e6eb",
                  textAlign: "justify",
                  ...ellipsisText(5),
                  mt: 2,
                  WebkitLineClamp: {
                    xs: 5,
                    md: 7,
                  },
                }}
              >
                {newsSelected.description}
              </Typography>

              <Typography sx={{ mt: 1, color: "#e4e6eb" }}>
                {newsSelected.time}
              </Typography>

              <Link href={`/${newsSelected.slug}`}>
                <Typography
                  sx={{
                    cursor: "pointer",
                    color: "#e4e6eb",
                    mt: 1,
                    fontWeight: "600",
                  }}
                >
                  Đọc tiếp
                </Typography>
              </Link>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Modal>
    </Container>
  );
};
