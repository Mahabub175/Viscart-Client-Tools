"use client";

import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Image from "next/image";
import Link from "next/link";

const Categories = () => {
  const { data: categories } = useGetAllCategoriesQuery();

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.level === "category"
  );

  return (
    <section className="-mt-10 lg:-mt-0 py-10 relative my-container bg-white shadow-xl p-5 rounded-xl">
      <h2 className="text-2xl lg:text-4xl font-bold text-center">
        Top Categories
      </h2>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {activeCategories?.slice(0, 9).map((category) => (
          <Link
            href={`/products/filtered?filter=${category?.name}`}
            key={category?._id}
            className="text-center relative"
          >
            <div className="group cursor-pointer overflow-hidden w-[260px] h-[260px] rounded-xl mx-auto">
              <Image
                src={
                  category?.attachment ??
                  "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                }
                alt={category?.name}
                width={260}
                height={260}
                className="group-hover:scale-110 duration-500 object-cover rounded-xl"
              />
            </div>
            <h3 className="font-bold text-xl absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white">
              {category?.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
