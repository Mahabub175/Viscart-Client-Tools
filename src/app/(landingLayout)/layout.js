import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      <div className="mt-20 lg:mt-36">{children}</div>
      <BackToTop />
      <BottomNavigation />

      <LandingFooter />
    </>
  );
};

export default LandingLayout;
