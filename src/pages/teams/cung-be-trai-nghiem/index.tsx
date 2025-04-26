import { CbtnTeamContent } from "@/components/features/home/teams/cung-be-trai-nghiem";
import { Intro, Opportunity } from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { GetStaticProps, NextPage } from "next";
import { getQuoteByTeam } from "@/utils/common";
import { QQuote, TeamName } from "@/@types/team";
import { TEAM_NAME } from "@/utils/constants";

interface Props {
  quote: QQuote;
}

const CbtnTeam: NextPage<Props> = ({ quote }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <CbtnTeamContent />
      {quote ? (
        <Intro
          title={quote.title}
          content={quote.content}
          banner_url={quote?.banner_url}
        />
      ) : null}
      <Opportunity />
    </>
  );
};

export default CbtnTeam;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const quote = getQuoteByTeam(TEAM_NAME["CUNG_BE_TRAI_NGHIEM"] as TeamName);

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
      },
    };
  } catch (err) {
    console.log("err", err);

    return {
      props: {
        quote: {},
      },
    };
  }
};
