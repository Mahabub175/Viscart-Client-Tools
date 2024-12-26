import { Tooltip } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { usePathname } from "next/navigation";
import LinkButton from "@/components/Shared/LinkButton";

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl relative group lg:w-[220px] mx-auto lg:h-[380px] flex flex-col border border-gray-200 p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl">
        {item?.video && isHovered ? (
          <video
            src={formatImagePath(item?.video)}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            autoPlay
            muted
            controls={false}
            className="w-full h-[160px] lg:h-[220px] rounded-xl object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={
              pathname === "/products"
                ? item?.mainImage
                : formatImagePath(item?.mainImage)
            }
            alt={item?.name}
            width={220}
            height={260}
            className="rounded-xl lg:h-[220px] group-hover:scale-110 duration-500"
          />
        )}

        <div className="hidden lg:block absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 duration-500 z-10">
          <QuickViewHover item={item} />
        </div>
        <div className="lg:hidden">
          <QuickViewHover item={item} />
        </div>
      </div>

      <div className="text-center">
        <LinkButton href={`/products/${item?.slug}`}>
          <Tooltip placement="top" title={item?.name}>
            <h2 className="text-sm text-center md:text-base mt-3 hover:text-gray-500 duration-300 mb-4">
              {item?.name.length > 40
                ? item.name.slice(0, 40).concat("...")
                : item.name}
            </h2>
          </Tooltip>
          <div className="flex items-center gap-4 justify-center mb-2">
            {item?.offerPrice && (
              <p className="text-sm lg:text-base line-through text-black/60">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
            {item?.offerPrice ? (
              <p className="text-black text-sm lg:text-base">
                {globalData?.results?.currency + " " + item?.offerPrice}
              </p>
            ) : (
              <p className="text-black text-sm lg:text-base">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
          </div>
        </LinkButton>
        {!item?.stock > 0 ? (
          <div className=" text-red-500">(Out Of Stock)</div>
        ) : (
          <div className=" text-green-500">(In Stock)</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
