"use client";

import BackToTop from "@/components/Shared/BackToTop";
import FloatingContact from "@/components/Shared/FloatingContact";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";
import PopupBanner from "@/components/Shared/PopupBanner";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const LandingLayout = ({ children }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <>
      <LandingHeader />
      <div
        className={`${
          globalData?.results?.announcement
            ? "mt-[8rem] md:mt-[7rem] lg:mt-[11.5rem] xl:mt-[12rem] xxl:mt-[12.5rem]"
            : "mt-[4.5rem] md:mt-[5rem] lg:mt-[8.5rem] xl:mt-[9rem] xxl:mt-[9.5rem]"
        }`}
      >
        {children}
      </div>
      <PopupBanner />
      <FloatingContact />
      <BackToTop />
      <BottomNavigation />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
