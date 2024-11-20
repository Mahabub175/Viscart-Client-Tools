import { Rate } from "antd";
import Image from "next/image";
import React from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import Link from "next/link";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();

  return (
    <section className="py-10">
      <div
        key={item?._id}
        className="border hover:border-primary duration-300 rounded-xl shadow-xl relative group w-[300px] mx-auto"
      >
        <div className="relative overflow-hidden rounded-t-xl">
          <Image
            src={item?.mainImage}
            alt={item?.name}
            width={300}
            height={260}
            className="rounded-t-xl h-[260px] group-hover:scale-110 duration-500"
          />

          <div className="hidden lg:block absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 duration-500 z-10">
            <QuickViewHover item={item} />
          </div>
          <div className="lg:hidden">
            <QuickViewHover item={item} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-b-xl">
          <Link href={`/products/${item?.slug}`}>
            <h2 className="text-start font-normal text-textColor text-sm">
              {item?.category?.name}
            </h2>

            <h2 className="text-xl text-start font-semibold mt-2 mb-6">
              {item?.name}
            </h2>
            <div className="flex items-center mb-2 gap-4 font-bold">
              <Rate disabled value={item?.ratings?.average} allowHalf />(
              {item?.ratings?.count})
            </div>
            <div className="flex items-center gap-4 justify-start">
              {item?.offerPrice && (
                <p className="text-base font-bold line-through text-red-500">
                  {globalData?.results?.currency + " " + item?.sellingPrice}
                </p>
              )}
              {item?.offerPrice ? (
                <p className="text-primary text-2xl font-bold">
                  {globalData?.results?.currency + " " + item?.offerPrice}
                </p>
              ) : (
                <p className="text-primary text-2xl font-bold">
                  {globalData?.results?.currency + " " + item?.sellingPrice}
                </p>
              )}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;
