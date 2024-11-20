import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";
import GlobalCart from "@/components/Shared/Product/GlobalCart";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      {children}
      <GlobalCart />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
