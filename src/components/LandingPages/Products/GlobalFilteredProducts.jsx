"use client";

import { useMemo } from "react";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "../Home/Products/ProductCard";

const GlobalFilteredProducts = ({ searchParams }) => {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();

  const activeProducts = products?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const filteredProducts = useMemo(() => {
    if (!searchParams) return activeProducts;

    const searchKey = searchParams.toLowerCase();

    return activeProducts?.filter((product) => {
      const brandName = product?.brand?.name?.toLowerCase() || "";
      const categoryName = product?.category?.name?.toLowerCase() || "";

      return brandName.includes(searchKey) || categoryName.includes(searchKey);
    });
  }, [activeProducts, searchParams]);

  if (isLoading) return <p>Loading products...</p>;
  if (isError || !products) return <p>Failed to load products.</p>;
  if (!activeProducts?.length) return <p>No products available.</p>;

  return (
    <div className="mt-10 lg:mt-0 py-10 relative my-container bg-white shadow-xl p-5 rounded-xl">
      {filteredProducts?.length ? (
        <>
          <div className="capitalize text-center text-3xl text-primary font-semibold">
            {searchParams}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
            {filteredProducts?.map((product) => (
              <ProductCard key={product?.id} item={product} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center">No products match the search criteria.</p>
      )}
    </div>
  );
};

export default GlobalFilteredProducts;
