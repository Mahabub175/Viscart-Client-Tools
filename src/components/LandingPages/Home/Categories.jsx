"use client";

import LinkButton from "@/components/Shared/LinkButton";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import Image from "next/image";

const Categories = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: products } = useGetAllProductsQuery();

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive"
  );
  const activeProducts = products?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const getProductCountByCategory = (categoryId) => {
    return activeProducts?.filter(
      (product) => product?.category?._id === categoryId
    )?.length;
  };

  return (
    <section className="my-container p-5 mt-10 relative">
      <h2 className="text-2xl lg:text-3xl font-medium text-center lg:text-start mb-5">
        Collections
      </h2>
      <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center items-center gap-5">
        {activeCategories?.map((item) => {
          const productCount = getProductCountByCategory(item?._id);
          return (
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
                    alt={item?.name ?? "demo"}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 duration-500 rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-xl">
                    <h2 className="text-white text-lg font-medium group-hover:-translate-y-2 duration-500">
                      {item?.name}
                    </h2>
                  </div>
                  <div className="absolute bottom-10 left-0 right-0 text-white text-center py-1 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 text-sm">
                    {productCount} products
                  </div>
                </div>
              </LinkButton>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
