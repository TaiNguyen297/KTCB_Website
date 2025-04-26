import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layouts";
import createEmotionCache from "@/libs/mui/createEmotionCache";
import theme from "@/libs/mui/theme";
import { queryClient } from "@/libs/react-query";
import "@/styles/globals.css";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalModal } from "@/components/features/global-modal/GlobalModal";

const clientSideEmotionCache = createEmotionCache();
export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;

  const [hydrated, seHydrated] = useState(false);

  useEffect(() => {
    seHydrated(true);
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <ToastContainer />
              <CssBaseline />
              {hydrated && (
                <SessionProvider session={session}>
                  <GlobalModal>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </GlobalModal>
                </SessionProvider>
              )}
            </ThemeProvider>
          </LocalizationProvider>
        </Hydrate>
      </QueryClientProvider>
      <Analytics />
      <SpeedInsights />
    </CacheProvider>
  );
}
