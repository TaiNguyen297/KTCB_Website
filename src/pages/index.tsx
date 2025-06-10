/* eslint-disable @next/next/no-img-element */

import { QQuote } from "@/@types/team";
import {
  HomeContent,
  Intro,
  NewsLoadMore,
  Opportunity,
} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { getQuoteByTeam } from "@/utils/common";
import { Stack, Typography } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";
import prisma from "@/libs/prisma";

interface Props {
  quote: QQuote;
}

const Home: NextPage<Props & { events: any[] }> = ({ quote, events }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <HomeContent events={events} />

      {quote ? (
        <Intro
          title={quote.title}
          content={quote.content}
          banner_url={quote?.banner_url}
        />
      ) : null}
      <Opportunity />

      <Stack py={2} alignItems="center">
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
          KHO ẢNH KỶ NIỆM
        </Typography>
      </Stack>
      <NewsLoadMore />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const quote = getQuoteByTeam();
    const events = await prisma.volunteerEvents.findMany({

    });
    if (!quote?.title || !quote?.content || !quote?.banner_url) {
      return {
        props: {
          quote: null,
        },
      };
    }

    return {
      props: {
        quote,
         events: JSON.parse(JSON.stringify(events)),
      },
    };
  } catch (err) {
    console.log("err", err);

    return {
      props: {
        quote: {},
        events: [],
      },
    };
  }
};
