import { KtstnTeamContent } from "@/components/features/home/teams/kien-truc-su-tinh-nguyen";
import { Intro, Opportunity } from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { GetStaticProps, NextPage } from "next";
import { getQuoteByTeam } from "@/utils/common";
import { TEAM_NAME } from "@/utils/constants";
import { QQuote, TeamName } from "@/@types/team";

interface Props {
  quote: QQuote;
}

export const KtstnTeam: NextPage<Props> = ({ quote }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <KtstnTeamContent />
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

export default KtstnTeam;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const quote = getQuoteByTeam(
      TEAM_NAME["KIEN_TRUC_SU_TINH_NGUYEN"] as TeamName
    );

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
