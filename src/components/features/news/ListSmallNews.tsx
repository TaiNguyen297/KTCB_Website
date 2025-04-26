import { DataResponseInfinite } from "@/@types/common";
import { INews } from "@/@types/news";
import { loadMoreSmallNews } from "@/utils/common";
import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { SmallNews } from "./components/SmallNews";

const ListSmallNews = () => {
  const { ref, inView } = useInView();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<DataResponseInfinite<INews[]>>(
      ["smallNews"],
      async ({ pageParam = null }) => {
        const res = await loadMoreSmallNews(pageParam);

        return res;
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

  useEffect(() => {
    if (inView && hasNextPage) {
      handleLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage]);

  return (
    <>
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <Grid container spacing={2}>
          {dataFlat?.map((news, index) => (
            <Grid item xs={12} md={6} key={index}>
              <SmallNews
                banner_url={news?.banner_url}
                description={news?.description}
                slug={news?.slug}
                title={news?.title}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          ref={ref}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 0px",
          }}
        >
          {isFetchingNextPage ? <CircularProgress size={24} /> : null}
        </Box>
      </Stack>
    </>
  );
};

export { ListSmallNews };
