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
import { updateEventsStatus } from "@/utils/eventStatus";
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
    const events = await prisma.event.findMany({
      include: {
        donations: true, // Include donations để tính tổng
      }
    });
    
    // Tính tổng amount từ donations cho mỗi event
    const eventsWithAmount = events.map(event => ({
      ...event,
      amount: event.donations.reduce((sum, donation) => sum + donation.amount, 0),
      // Loại bỏ donations array để giảm kích thước
      donations: undefined
    }));
    
    // Tự động cập nhật trạng thái dựa theo thời gian
    const eventsWithUpdatedStatus = updateEventsStatus(eventsWithAmount);
    
    console.log("Events with amount and status:", eventsWithUpdatedStatus.map(e => ({ 
      id: e.id, 
      title: e.title, 
      amount: e.amount, 
      status: e.status,
      startDate: e.startDate,
      endDate: e.endDate
    })));
    
    if (!quote?.title || !quote?.content || !quote?.banner_url) {
      return {
        props: {
          quote: null,
          events: JSON.parse(JSON.stringify(eventsWithUpdatedStatus)),
        },
      };
    }

    return {
      props: {
        quote,
        events: JSON.parse(JSON.stringify(eventsWithUpdatedStatus)),
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
