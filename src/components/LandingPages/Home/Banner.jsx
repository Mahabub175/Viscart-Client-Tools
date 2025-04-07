"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import Link from "next/link";

const Banner = () => {
  const { data: sliders } = useGetAllSlidersQuery();

  const activeSliders = sliders?.results?.filter(
    (item) => item.status === "Active" && !item?.bottomBanner
  );

  return (
    <section className="relative mb-10">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="max-h-[700px]"
      >
        {activeSliders?.map((item) => {
          return (
            <SwiperSlide key={item?._id}>
              <Link
                href={
                  item?.name
                    ? item.name
                    : item?.category?.name
                    ? `/products?filter=${item.category.name}`
                    : "/"
                }
              >
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={item?.name ?? "banner"}
                  width={2500}
                  height={700}
                  className="h-[200px] lg:h-fit w-full"
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Banner;
