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
        className="bg-gray-100 border rounded-xl shadow-xl relative group w-[300px] mx-auto"
      >
        <div className="relative overflow-hidden rounded-t-xl">
          <Image
            src={item?.mainImage}
            alt={item?.name}
            width={300}
            height={260}
            className="rounded-t-xl h-[260px] group-hover:scale-110 duration-500"
          />
        </div>
        <QuickViewHover item={item} />
        <div className="px-5 pb-5">
          <div className="flex items-center mt-4 gap-4 font-bold">
            <Rate disabled value={item?.ratings?.average} allowHalf />(
            {item?.ratings?.count})
          </div>
          <h2 className="text-xl text-center font-semibold my-4">
            {item?.name}
          </h2>
          <div className="flex items-center gap-4 justify-center">
            {item?.offerPrice ? (
              <p className="text-primary text-2xl font-bold">
                {globalData?.results?.currency + " " + item?.offerPrice}
              </p>
            ) : (
              <p className="text-primary text-2xl font-bold">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
            {item?.offerPrice && (
              <p className="text-base font-bold line-through text-red-500">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
          </div>
        </div>
        <Link
          href={`/products/${item?.slug}`}
          className="flex items-center justify-center"
        >
          <div className="w-full bg-primary text-white font-bold py-2 text-center rounded-b-xl">
            View Details
          </div>
        </Link>
      </div>
    </section>
  );
};

export default ProductCard;
