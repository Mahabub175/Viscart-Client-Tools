import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";
import GlobalCart from "@/components/Shared/Product/GlobalCart";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      {children}
      <GlobalCart />
      <BackToTop />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
