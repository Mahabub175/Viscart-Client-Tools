import Banner from "@/components/LandingPages/Home/Banner";
import BottomBanner from "@/components/LandingPages/Home/BottomBanner";
import Brands from "@/components/LandingPages/Home/Brands";
import Categories from "@/components/LandingPages/Home/Categories";
import NewsletterBanner from "@/components/LandingPages/Home/NewsletterBanner";
import CategoryProducts from "@/components/LandingPages/Home/Products/CategoryProducts";
import OfferProducts from "@/components/LandingPages/Home/Products/OfferProducts";
import TopProducts from "@/components/LandingPages/Home/Products/TopProducts";

export const metadata = {
  title: "Home | Viscart",
  description: "This is the homepage of Viscart",
};

const page = async () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Categories />
      <CategoryProducts />
      <OfferProducts />
      <Brands />
      <BottomBanner />
      <TopProducts />
      <NewsletterBanner />
    </div>
  );
};

export default page;
