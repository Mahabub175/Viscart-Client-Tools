import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      <div className="mt-[5.7rem] md:mt-[6.4rem] lg:mt-[11.4rem] xl:mt-[11rem] xxl:mt-[11.4rem]">
        {children}
      </div>
      <BackToTop />
      <BottomNavigation />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
