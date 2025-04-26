import ScrollToTop from "react-scroll-to-top";
import { MaterialSymbolsKeyboardArrowUp } from "../shared/icons/ChevronUpIcon";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />
      <div id="primary" className="content-area pt-0">
        <main
          id="main"
          className="site-main mt-[0px] min-h-[calc(100vh-74px-290px)]"
          role="main"
        >
          {children}
        </main>
      </div>
      <Footer />
      <ScrollToTop
        smooth
        component={<MaterialSymbolsKeyboardArrowUp width={24} height={24} />}
        style={{
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        }}
      />
    </>
  );
};

export default Layout;
