"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectProductIds } from "@/redux/services/device/deviceSlice";

const RecentlyViewedProducts = () => {
  const productIds = useSelector(selectProductIds);

  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive" && productIds.includes(item?._id)
  );

  return (
    <>
      {activeProducts?.length > 0 && (
        <section className="my-container mt-10">
          <div className="py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
                Recently Viewed
              </h2>
              <Link
                href={`/products`}
                className="border-b border-primary font-semibold"
              >
                Show All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center gap-5">
              {activeProducts.map((product) => (
                <div key={product?._id}>
                  <ProductCard item={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default RecentlyViewedProducts;
