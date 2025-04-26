import { DefaultSeoProps } from "next-seo";

const SEO: DefaultSeoProps = {
  title: "Khoảng Trời Của Bé",
  description: "Khoảng Trời Của Bé",
  titleTemplate: "%s | Khoảng Trời Của Bé",
  openGraph: {
    type: "website",
    locale: "en",
    // url: 'https://nextjs-core-project.vercel.app',
    // siteName: 'Nextjs Core Project',
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

export { SEO };
