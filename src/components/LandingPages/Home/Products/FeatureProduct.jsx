"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { Rate } from "antd";
import Image from "next/image";

const FeatureProduct = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive" && item?.isVariant === false)
    ?.slice(0, 3);

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-10">
        <div>
          <h2 className="text-3xl font-bold">Top Rated</h2>
          <div className="flex items-center mt-4">
            <div className="border w-28 border-primary"></div>
            <div className="border w-28"></div>
          </div>
          <div className="mt-8">
            {activeProducts?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-6 mt-6 border-2 border-primaryLight p-4 rounded-xl group hover:border-primary duration-300 cursor-pointer"
              >
                <div className="bg-primaryLight p-2 rounded-xl ">
                  <Image
                    src={item?.mainImage}
                    alt={item?.name}
                    width={50}
                    height={50}
                    className="group-hover:scale-110 duration-500 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{item?.name}</h3>
                  <div className="flex items-center gap-1 font-bold">
                    <Rate disabled value={item?.ratings?.average} allowHalf />(
                    {item?.ratings?.count})
                  </div>
                  <div className="flex items-center gap-4">
                    {item?.offerPrice ? (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice && (
                      <p className="text-base font-bold line-through text-textColor">
                        ${item?.sellingPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold">Top Sells</h2>
          <div className="flex items-center mt-4">
            <div className="border w-28 border-primary"></div>
            <div className="border w-28"></div>
          </div>
          <div className="mt-8">
            {activeProducts?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-6 mt-6 border-2 border-primaryLight p-4 rounded-xl group hover:border-primary duration-300 cursor-pointer"
              >
                <div className="bg-primaryLight p-2 rounded-xl ">
                  <Image
                    src={item?.mainImage}
                    alt={item?.name}
                    width={50}
                    height={50}
                    className="group-hover:scale-110 duration-500 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{item?.name}</h3>
                  <div className="flex items-center gap-1 font-bold">
                    <Rate disabled value={item?.ratings?.average} allowHalf />(
                    {item?.ratings?.count})
                  </div>
                  <div className="flex items-center gap-4">
                    {item?.offerPrice ? (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice && (
                      <p className="text-base font-bold line-through text-textColor">
                        ${item?.sellingPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold">Top Trends</h2>
          <div className="flex items-center mt-4">
            <div className="border w-28 border-primary"></div>
            <div className="border w-28"></div>
          </div>
          <div className="mt-8">
            {activeProducts?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-6 mt-6 border-2 border-primaryLight p-4 rounded-xl group hover:border-primary duration-300 cursor-pointer"
              >
                <div className="bg-primaryLight p-2 rounded-xl ">
                  <Image
                    src={item?.mainImage}
                    alt={item?.name}
                    width={50}
                    height={50}
                    className="group-hover:scale-110 duration-500 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{item?.name}</h3>
                  <div className="flex items-center gap-1 font-bold">
                    <Rate disabled value={item?.ratings?.average} allowHalf />(
                    {item?.ratings?.average})
                  </div>
                  <div className="flex items-center gap-4">
                    {item?.offerPrice ? (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice && (
                      <p className="text-base font-bold line-through text-textColor">
                        ${item?.sellingPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold">Recently Added</h2>
          <div className="flex items-center mt-4">
            <div className="border w-28 border-primary"></div>
            <div className="border w-28"></div>
          </div>
          <div className="mt-8">
            {activeProducts?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-6 mt-6 border-2 border-primaryLight p-4 rounded-xl group hover:border-primary duration-300 cursor-pointer"
              >
                <div className="bg-primaryLight p-2 rounded-xl ">
                  <Image
                    src={item?.mainImage}
                    alt={item?.name}
                    width={50}
                    height={50}
                    className="group-hover:scale-110 duration-500 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{item?.name}</h3>
                  <div className="flex items-center gap-1 font-bold">
                    <Rate disabled value={item?.ratings?.average} allowHalf />(
                    {item?.ratings?.average})
                  </div>
                  <div className="flex items-center gap-4">
                    {item?.offerPrice ? (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice && (
                      <p className="text-base font-bold line-through text-textColor">
                        ${item?.sellingPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureProduct;
