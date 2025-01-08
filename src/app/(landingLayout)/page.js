import Banner from "@/components/LandingPages/Home/Banner";
import Brands from "@/components/LandingPages/Home/Brands";
import Categories from "@/components/LandingPages/Home/Categories";
import NewsletterBanner from "@/components/LandingPages/Home/NewsletterBanner";
import CategoryProducts from "@/components/LandingPages/Home/Products/CategoryProducts";
import TopProducts from "@/components/LandingPages/Home/Products/TopProducts";

export const metadata = {
  title: "Home | Viscart",
  description: "This is the homepage of Viscart website.",
};

const page = async () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Categories />
      <CategoryProducts />
      <Brands />
      <TopProducts />
      <NewsletterBanner />
    </div>
  );
};

export default page;
