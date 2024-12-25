import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      {children}
      <BackToTop />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
