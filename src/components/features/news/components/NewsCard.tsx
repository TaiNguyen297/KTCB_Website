import { INews } from "@/@types/news";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

type NewsCardProps = {
  newsData: INews;
};

export const NewsCard: React.FC<NewsCardProps> = ({ newsData }) => {
  const router = useRouter();
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const descriptionElement = descriptionRef.current;

    if (descriptionElement) {
      const descriptionHeight = descriptionElement.clientHeight;
      setIsTextOverflow(descriptionHeight > 90);
    }
  }, []);

  return (
    <Stack sx={{ cursor: "pointer" }}>
      <Box
        sx={{
          padding: 2,
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "lightblue",
          },
        }}
        onClick={() => router.push(newsData.slug)}
      >
        <Box
          borderRadius="5px"
          component="img"
          src={newsData.banner_url}
          sx={{ width: "100%", height: "200px", objectFit: "cover" }}
        ></Box>
        <Typography
          variant="h5"
          mt={2}
          fontWeight="bold"
          sx={{
            minHeight: "35px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: isTextOverflow ? 1 : "unset",
            WebkitBoxOrient: "vertical",
            textAlign: "justify",
          }}
        >
          {newsData.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            minHeight: "90px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: isTextOverflow ? 5 : "unset",
            WebkitBoxOrient: "vertical",
            textAlign: "justify",
          }}
          ref={descriptionRef}
        >
          {newsData.description}
        </Typography>
        {isTextOverflow && (
          <Typography
            variant="body1"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Đọc tiếp
          </Typography>
        )}
      </Box>
    </Stack>
  );
};
