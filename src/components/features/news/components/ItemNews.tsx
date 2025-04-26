/* eslint-disable @next/next/no-img-element */

import { imageAbsolute, imageRelative } from "@/styles/commonStyles";
import { ellipsisText } from "@/utils/common";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import logoImg from "../../../../../public/ktcb-logo-512.png";

interface Props {
  title: string;
  banner_url: string;
  description: string;
  slug: string;
  hideBorder?: boolean;
}

export const ItemNews: React.FC<Props> = ({
  title,
  banner_url,
  description,
  slug,
  hideBorder,
}) => {
  return (
    <Stack
      sx={{
        ...(!hideBorder && {
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "12px",
          paddingBottom: "20px",
        }),
      }}
    >
      <Link href={`/${slug}`}>
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            marginBottom: "4px",
            ...ellipsisText(),
          }}
        >
          {title}
        </Typography>
      </Link>

      <Box>
        <Box
          sx={{
            width: "120px",
            height: "87px",
            float: "left",
            marginRight: "10px",
            marginTop: "4px",
          }}
        >
          <Link
            href={`/${slug}`}
            style={{
              ...imageRelative,
              background: "#f4f4f4",
              paddingBottom: "60%",
            }}
          >
            <img
              className="absolute top-0.5 left-0.5 w-6 h-6 object-cover z-10"
              src={logoImg.src}
              alt="banner"
            />

            <Box
              component="img"
              alt="banner_url"
              src={banner_url}
              sizes="100vw"
              sx={{
                ...imageAbsolute,

                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            />
          </Link>
        </Box>

        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "140%",
            color: "#4f4f4f",
            textAlign: "justify",
            ...ellipsisText(5),
          }}
        >
          <Link href={`/${slug}`}>{description}</Link>
        </Typography>
      </Box>
    </Stack>
  );
};
