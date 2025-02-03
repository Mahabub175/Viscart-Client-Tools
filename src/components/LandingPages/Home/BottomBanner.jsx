"use client";

import Image from "next/image";
import "swiper/css";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import Link from "next/link";

const BottomBanner = () => {
  const { data: sliders } = useGetAllSlidersQuery();

  const activeSliders = sliders?.results?.find(
    (item) => item.status === "Active" && item?.bottomBanner
  );

  if (!activeSliders) {
    return null;
  }

  return (
    <section className="relative mt-10 lg:mt-20">
      <Link
        href={`/products?filter=${activeSliders[0]?.category?.name}`}
        key={activeSliders[0]?._id}
      >
        <Image
          src={
            activeSliders[0]?.attachment ??
            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
          }
          alt={activeSliders[0].name}
          width={2500}
          height={600}
          className="h-[200px] lg:h-[600px] w-full"
        />
        <div className="absolute z-10 top-20 lg:top-[45%] left-[5%]">
          {activeSliders[0]?.name && (
            <h2 className="text-primary text-3xl lg:text-7xl font-bold mb-2 lg:mb-6">
              {activeSliders[0]?.name}
            </h2>
          )}
          {activeSliders[0]?.buttonText && (
            <button className="bg-primary px-5 py-2 lg:px-10 lg:py-4 lg:text-xl font-bold text-white rounded-xl">
              {activeSliders[0]?.buttonText}
            </button>
          )}
        </div>
      </Link>
    </section>
  );
};

export default BottomBanner;
