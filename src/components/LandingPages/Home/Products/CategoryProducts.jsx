"use client";
import { useState } from "react";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { Tabs } from "antd";
import ProductCard from "./ProductCard";

const CategoryProducts = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive"
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
          (product) => product?.category?._id === activeCategory
        );

  return (
    <section className="my-container mt-10">
      <div className="flex flex-col lg:flex-row items-center justify-between border-b">
        <h2 className="text-xl lg:text-3xl font-medium text-center mb-5">
          Top Categories Featured
        </h2>
        <Tabs
          defaultActiveKey="all-products"
          size="large"
          className="font-semibold max-w-[350px] md:max-w-full"
          onChange={(key) => setActiveCategory(key)}
        >
          <Tabs.TabPane tab="All" key="all-products" />
          {activeCategories?.slice(0, 3)?.map((category) => (
            <Tabs.TabPane tab={category?.name} key={category?._id} />
          ))}
        </Tabs>
      </div>
      {filteredProducts?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center items-center gap-5 mt-5">
          {filteredProducts?.map((product) => (
            <div key={product?._id}>
              <ProductCard item={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl font-semibold my-10">
          No products found for this category.
        </div>
      )}
    </section>
  );
};

export default CategoryProducts;
