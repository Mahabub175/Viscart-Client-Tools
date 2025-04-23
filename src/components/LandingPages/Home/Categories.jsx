"use client";

import LinkButton from "@/components/Shared/LinkButton";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import Image from "next/image";
import { useState } from "react";

const Categories = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: products } = useGetAllProductsQuery();

  const [showAll, setShowAll] = useState(false);

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.level === "parentCategory"
  );
  const activeProducts = products?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const getProductCountByCategory = (categoryId) => {
    return activeProducts?.filter(
      (product) => product?.category?._id === categoryId
    )?.length;
  };

  const sortedCategories = activeCategories
    ?.map((category) => ({
      ...category,
      productCount: getProductCountByCategory(category?._id),
    }))
    .sort((a, b) => b.productCount - a.productCount);

  const visibleCategories = showAll
    ? sortedCategories
    : sortedCategories?.slice(0, 6);

  return (
    <section className="my-container p-5 -mt-5 lg:mt-10 relative">
      <h2 className="text-2xl lg:text-3xl font-medium text-center lg:text-start mb-5">
        Top Categories
      </h2>
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-5 mx-auto justify-center items-center">
        {visibleCategories?.map((item) => (
          <div
            className="group relative w-[160px] h-[160px] mx-auto rounded-xl"
            key={item?._id}
          >
            <LinkButton href={`/products?filter=${item?.name}`}>
              <div className="overflow-hidden w-full h-full rounded-xl">
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={item?.name ?? "categories"}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-110 duration-500 rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-xl">
                  <h2 className="text-white text-base lg:text-lg font-medium group-hover:-translate-y-4 duration-500 px-2">
                    {item?.name}
                  </h2>
                </div>
                <div className="absolute bottom-10 left-0 right-0 text-white text-center py-1 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 text-sm">
                  {item.productCount} products
                </div>
              </div>
            </LinkButton>
          </div>
        ))}
      </div>

      {!showAll && sortedCategories?.length > 6 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="bg-primary text-white px-6 py-2 rounded duration-300"
          >
            View All
          </button>
        </div>
      )}
    </section>
  );
};

export default Categories;
