"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";

const OfferProducts = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive" && item?.offerPrice)
    ?.slice(0, 8);

  return (
    <div className="my-container bg-white shadow-xl p-5 rounded-xl mt-20">
      <ProductCard data={activeProducts} title={"Best Offers"} />
    </div>
  );
};

export default OfferProducts;
