import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";
import GlobalCart from "@/components/Shared/Product/GlobalCart";
import Script from "next/script";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      <GlobalCart />
      {children}
      <BackToTop />
      <Script
        id="crisp-chat"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
              window.$crisp=[];window.CRISP_WEBSITE_ID="a716db7a-951a-48d0-823a-79141fe8b539";
              (function(){
                d=document;
                s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
        }}
      />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
