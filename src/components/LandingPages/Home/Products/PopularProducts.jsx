"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";

const PopularProducts = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive")
    ?.sort((a, b) => (b?.ratings?.average || 0) - (a?.ratings?.average || 0))
    ?.slice(0, 8);

  return (
    <div className="my-container bg-white shadow-xl p-5 rounded-xl mt-20">
      <ProductCard data={activeProducts} title={"Popular Products"} />
    </div>
  );
};

export default PopularProducts;
