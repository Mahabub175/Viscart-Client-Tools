"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import Link from "next/link";

const Banner = () => {
  const swiperRef = useRef();

  const { data: sliders } = useGetAllSlidersQuery();

  const activeSliders = sliders?.results?.filter(
    (item) => item.status === "Active"
  );

  return (
    <section className="relative lg:container mx-auto">
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        loop={true}
        slidesPerView={1}
        navigation
        className="max-h-[450px] rounded-xl"
      >
        {activeSliders?.map((item) => {
          return (
            <SwiperSlide key={item?._id}>
              <Link href={`/products?filter=${item?.category?.name}`}>
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={item?.name ?? "Demo"}
                  width={450}
                  height={450}
                  className="h-[200px] lg:h-fit w-full rounded-xl"
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="flex items-center justify-between gap-5 mt-10">
        <button
          className="z-10 lg:w-10 lg:h-10 flex items-center justify-center rounded-xl bg-white text-black border hover:bg-primary hover:text-white duration-300 absolute top-[35%] lg:top-[40%] left-5 lg:left-10"
          onClick={() => swiperRef.current.slidePrev()}
        >
          <FaAngleLeft className="text-xl" />
        </button>
        <button
          className="z-10 lg:w-10 lg:h-10 flex items-center justify-center rounded-xl bg-white text-black border hover:bg-primary hover:text-white duration-300 absolute top-[35%] lg:top-[40%] right-5 lg:right-10"
          onClick={() => swiperRef.current.slideNext()}
        >
          <FaAngleRight className="text-xl" />
        </button>
      </div>
    </section>
  );
};

export default Banner;
