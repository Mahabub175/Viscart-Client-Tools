"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import Link from "next/link";

const Brands = () => {
  const swiperRef = useRef();

  const { data: brands } = useGetAllBrandsQuery();

  const activeBrands = brands?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  return (
    <section className="my-container bg-white shadow-xl p-5 rounded-xl mt-20">
      <h2 className="text-2xl lg:text-4xl font-bold text-center mb-10">
        Our Brands
      </h2>
      <div className="relative">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          loop={true}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 5 },
          }}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
        >
          {activeBrands?.map((item) => {
            return (
              <SwiperSlide key={item?._id}>
                <Link href={`/products/filtered?filter=${item?.name}`}>
                  <div className="group cursor-pointer overflow-hidden w-[260px] h-[260px] rounded-xl mx-auto flex justify-center items-center">
                    <Image
                      src={
                        item?.attachment ??
                        "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                      }
                      alt={item.name}
                      width={260}
                      height={260}
                      className="group-hover:scale-110 duration-500 object-cover rounded-xl shadow-xl"
                    />
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="flex items-center justify-between gap-5 mt-10">
          <button
            className="z-50 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-transparent text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[40%] left-5"
            onClick={() => swiperRef.current.slidePrev()}
          >
            <FaAngleLeft className="text-xl" />
          </button>
          <button
            className="z-50 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-transparent text-primary border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[40%] right-5"
            onClick={() => swiperRef.current.slideNext()}
          >
            <FaAngleRight className="text-xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Brands;
