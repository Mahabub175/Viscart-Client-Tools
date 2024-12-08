import Banner from "@/components/LandingPages/Home/Banner";
import SmallFeature from "@/components/LandingPages/Home/SmallFeature";
import Categories from "@/components/LandingPages/Home/Categories";
import ProductTab from "@/components/LandingPages/Home/Products/ProductTab";
import Brands from "@/components/LandingPages/Home/Brands";
import FeatureProduct from "@/components/LandingPages/Home/Products/FeatureProduct";

export const metadata = {
  title: "Home | Viscart",
  description: "This is the homepage of Viscart website.",
};

const page = async () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Categories />
      <ProductTab />
      <FeatureProduct />
      <Brands />
      <SmallFeature />
    </div>
  );
};

export default page;
