import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const CategoryBrandNavigation = ({ setIsDrawerOpen }) => {
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: brands } = useGetAllBrandsQuery();
  const [activeTab, setActiveTab] = useState("categories");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullPath = `${pathname}?${searchParams.toString()}`;
  const cleanedQuery = fullPath
    .replace(/filter=/, "")
    .replace(/=/, "")
    .replace(/[+]/g, " ");

  return (
    <section className="mt-5">
      <div className="flex border-b justify-center gap-5">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "categories"
              ? "border-b-2 border-orange text-orange"
              : "text-white"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "brands"
              ? "border-b-2 border-orange text-orange"
              : "text-white"
          }`}
          onClick={() => setActiveTab("brands")}
        >
          Brands
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "categories" && (
          <div className="flex flex-col">
            {categories?.results?.map((category) => (
              <Link
                href={`/products?filter=${category.name}`}
                onClick={() => setIsDrawerOpen(false)}
                key={category._id}
                className={`py-4 font-medium odd:border-y hover:text-primary ${
                  cleanedQuery === `/products?${category.name}`
                    ? "text-orange"
                    : "text-white"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
        {activeTab === "brands" && (
          <div className="flex flex-col">
            {brands?.results?.map((brand) => (
              <Link
                href={`/products?filter=${brand.name}`}
                onClick={() => setIsDrawerOpen(false)}
                key={brand._id}
                className={`py-4 font-medium odd:border-y hover:text-primary ${
                  cleanedQuery === `/products?${brand.name}`
                    ? "text-orange"
                    : "text-white"
                }`}
              >
                {brand.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryBrandNavigation;
