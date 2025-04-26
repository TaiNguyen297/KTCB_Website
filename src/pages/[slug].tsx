/* eslint-disable @next/next/no-img-element */
import { INews } from "@/@types/news";
import { ItemNews } from "@/components/features/news/components/ItemNews";
import { SlideNews } from "@/components/features/news/components/SlideNews";
import { SEO } from "@/configs/seo.config";
import styles from "@/styles/News.module.css";
import {
  getNewsBySlug,
  getNewsByTags,
  getOtherNewWithoutTags,
} from "@/utils/common";
import { Box, Button, Container, Stack } from "@mui/material";
import { format } from "date-fns";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { useEffect } from "react";
import logoImg from "../../public/ktcb-logo-512.png";
import Error404 from "./404";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { ModalConfirm } from "@/components/shared/modals";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";

interface Props {
  news: INews;
  rightOtherNews?: INews[];
  content: string;
}

const innerHtmlStyle = {
  textAlign: "justify",
  fontSize: "20px",

  "& .image-wrapper": {
    background: "#ffffff",
    position: "relative",

    marginTop: "20px",
    marginBottom: "20px",
    maxWidth: "700px",
    width: "100%",
    // maxHeight: "675px",
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",

    "& .logo": {
      position: "absolute",
      top: "10px",
      left: "10px",
      width: "50px",
      height: "50px",
    },
  },

  "& ul": {
    listStyleType: "disc",
    listStylePosition: "inside",

    display: "block",
    marginBlockStart: "0.5em",
    marginBlockEnd: "0.5em",
    marginInlineStart: "0px",
    marginInlineEnd: "0px",
    paddingInlineStart: "40px",
    margin: 0,
    marginBottom: "8px",
  },
  "& ol": {
    listStyleType: "decimal",
    listStylePosition: "inside",

    display: "block",
    marginBlockStart: "1em",
    marginBlockEnd: "1em",
    marginInlineStart: "0px",
    marginInlineEnd: "0px",
    paddingInlineStart: "40px",
  },
  "& ul ul, ol ul": {
    listStyleType: "circle",
    listStylePosition: "inside",
    marginLeft: "15px",
  },
  "& ol ol, ul ol": {
    listStyleType: "lower-latin",
    listStylePosition: "inside",
    marginLeft: "15px",
  },
  "& h2, h3, h4, blockquote": {
    fontWeight: "bold",
    fontSize: "1.3em",
    marginTop: "20px",
    marginBottom: "10px",
  },
  "& p": {
    marginTop: "15px",
  },
  "& em": {
    fontStyle: "italic",
  },
};

const News: NextPage<Props> = ({ news, rightOtherNews, content }) => {
  const slideNewsData = getOtherNewWithoutTags(news?.tags);

  const [openedConfirm, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);

  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const contentEl = document.getElementById("content");

      if (!contentEl) return;

      const images = contentEl.querySelectorAll("img");

      images.forEach((image) => {
        if (
          // @ts-ignore
          !Array.from(image.parentNode?.classList).includes("image-wrapper")
        ) {
          const divWrapper = document.createElement("div");
          divWrapper.classList.add("image-wrapper");

          const logo = document.createElement("img");
          logo.src = logoImg.src;
          logo.classList.add("logo");

          image.parentNode?.insertBefore(divWrapper, image);

          divWrapper.appendChild(image);
          divWrapper.appendChild(logo);
        }
      });
    }
  }, [news]);

  const handleShareViaEmail = async () => {
    console.log("Share via email");

    closeConfirm();

    openSuccess();
  };

  return (
    <>
      <DefaultSeo {...SEO} title={news?.title} />

      {news ? (
        <>
          <Stack>
            <Box className="relative">
              <img
                className={styles.banner}
                src={news?.banner_url}
                alt="banner"
              />

              <img
                className="absolute top-3 left-3 w-12 h-12 object-cover"
                src={logoImg.src}
                alt="banner"
              />
            </Box>

            <Container maxWidth="xl">
              <section className="news lg:pt-4 pt-4 mb-5">
                <div className="flex flex-wrap">
                  <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-6 lg:w-3/4 pr-4 pl-4 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="news-posted">
                        {news?.time &&
                          format(new Date(news?.time), "dd/MM/yyyy")}
                      </span>
                      <strong>{news?.author}</strong>
                    </div>
                    <h1 className="news-title text-4xl">{news?.title}</h1>
                    {content ? (
                      <Box
                        id="content"
                        sx={innerHtmlStyle}
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(content),
                        }}
                      />
                    ) : null}

                    <Button
                      variant="contained"
                      sx={{
                        alignSelf: "flex-end",
                        width: "fit-content",
                      }}
                      color="secondary"
                      onClick={openConfirm}
                    >
                      Chia sẻ bài viết qua Email
                    </Button>
                  </div>

                  <div className="flex flex-col align-center justify-start gap-4 lg:px-6 lg:w-1/4 pr-4 pl-4 w-full lg:mt-0 mt-4">
                    <Stack>
                      <h3 className="news-title">Tin liên quan</h3>
                      {rightOtherNews?.map((news, index) => (
                        <ItemNews
                          banner_url={news?.banner_url}
                          description={news?.description}
                          slug={news?.slug}
                          title={news?.title}
                          key={index}
                        />
                      ))}
                    </Stack>
                  </div>
                </div>
              </section>
            </Container>
          </Stack>
          <Stack alignItems="center" px={7}>
            <SlideNews slideNewsData={slideNewsData} />
          </Stack>

          <ModalConfirm
            title={`Chia sẻ bài viết qua Email`}
            open={openedConfirm}
            onClose={closeConfirm}
            content={`Bạn xác nhận sẽ chia sẽ bài viết qua Email?`}
            onConfirm={handleShareViaEmail}
          />

          <ToastSuccess
            open={openedSuccess}
            onClose={closeSuccess}
            heading="Xác nhận thành công"
            content="Chia sẻ bài viết qua Email thành công"
          />
        </>
      ) : (
        <Error404 />
      )}
    </>
  );
};

export default News;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    let rightOtherNews = null;

    const news = getNewsBySlug(params?.slug as string);

    if (news) {
      rightOtherNews = getNewsByTags(news?.title, news?.tags);
    }

    const content = await import(`@/utils/data/html/${params?.slug}`)
      .then((response) => JSON.stringify(response?.default))
      .catch((err) => {
        return "";
      });

    return {
      props: {
        news,
        rightOtherNews: rightOtherNews?.slice(0, 6) || [],
        content: content,
      },
    };
  } catch (err) {
    console.log("err", err);

    return {
      props: {
        news: {},
        rightOtherNews: [],
      },
    };
  }
};
