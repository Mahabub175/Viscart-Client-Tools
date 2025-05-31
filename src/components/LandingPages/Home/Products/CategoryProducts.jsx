"use client";
import { useState } from "react";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setFilter } from "@/redux/services/device/deviceSlice";

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.isFeatured
  );

  const activeCategories = categories?.results
    ?.filter((category) => category?.status !== "Inactive")
    ?.filter((category) =>
      activeProducts?.some(
        (product) => product?.category?._id === category?._id
      )
    );

  const [activeCategory, setActiveCategory] = useState("all-products");

  const filteredProducts =
    activeCategory === "all-products"
      ? activeProducts
      : activeProducts?.filter(
          (product) => product?.category?.name === activeCategory
        );

  const itemClickHandler = (item) => {
    if (item?.category?.name) {
      dispatch(setFilter(item?.category?.name));
    }
  };

  return (
    <section className="my-container mt-10">
      <div className="flex flex-col lg:flex-row items-center justify-between border-b">
        <h2 className="text-xl lg:text-3xl font-medium text-center mb-5">
          Top Featured Products
        </h2>
        <div className="overflow-auto max-w-[350px] md:max-w-full whitespace-nowrap">
          <ul className="flex gap-4 pb-2">
            <li
              className={`cursor-pointer px-4 py-2 ${
                activeCategory === "all-products"
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-primary hover:border-gray-300 hover:text-gray-500 duration-300"
              }`}
              onClick={() => setActiveCategory("all-products")}
            >
              All
            </li>
            {activeCategories?.map((category) => (
              <li
                key={category?._id}
                className={`cursor-pointer px-4 py-2 ${
                  activeCategory === category?.name
                    ? "border-b-2 border-primary text-primary"
                    : "border-b-2 border-transparent text-primary hover:border-gray-300 hover:text-gray-500 duration-300"
                }`}
                onClick={() => setActiveCategory(category?.name)}
              >
                {category?.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {filteredProducts?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center items-center gap-5 mt-5">
          {filteredProducts?.slice(0, 8)?.map((product) => (
            <div key={product?._id}>
              <ProductCard item={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl font-semibold my-10">
          No featured products found for this category.
        </div>
      )}

      {filteredProducts?.length > 8 && (
        <div className="flex justify-center mt-10">
          <Link
            href={`${"/products"}`}
            className="bg-primary text-white px-6 py-2 rounded duration-300"
          >
            <p onClick={() => itemClickHandler(filteredProducts)}>View All</p>
          </Link>
        </div>
      )}
    </section>
  );
};

export default CategoryProducts;
