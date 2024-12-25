import Banner from "@/components/LandingPages/Home/Banner";
import Brands from "@/components/LandingPages/Home/Brands";
import NewsletterBanner from "@/components/LandingPages/Home/NewsletterBanner";
import FeaturedProducts from "@/components/LandingPages/Home/Products/FeaturedProducts";
import NewArrivalProducts from "@/components/LandingPages/Home/Products/NewArrivalProducts";

export const metadata = {
  title: "Home | Viscart",
  description: "This is the homepage of Viscart website.",
};

const page = async () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <NewArrivalProducts />
      <FeaturedProducts />
      <Brands />
      <NewsletterBanner />
    </div>
  );
};

export default page;
