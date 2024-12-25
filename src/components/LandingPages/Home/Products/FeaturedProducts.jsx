"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive" && item?.isFeatured)
    ?.slice(0, 12);

  return (
    <section className="my-container relative border p-2 rounded-xl mt-10">
      <h2 className="my-5 lg:my-10 text-2xl lg:text-3xl font-semibold lg:font-bold text-center lg:text-start">
        Featured Products
      </h2>
      {activeProducts?.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-7 gap-10">
          {activeProducts?.map((product) => (
            <div key={product?._id}>
              <ProductCard item={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl font-semibold my-10">
          No products found.
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
