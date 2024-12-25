"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import LinkButton from "@/components/Shared/LinkButton";

const Brands = () => {
  const swiperRef = useRef();

  const { data: brands } = useGetAllBrandsQuery();

  const activeBrands = brands?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  return (
    <section className="my-container p-5 rounded-xl mt-20 relative">
      <h2 className="text-2xl lg:text-4xl font-bold text-start mb-10 border-b pb-4">
        Our Brands
      </h2>
      <div>
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
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
                <LinkButton href={`/products?filter=${item?.name}`}>
                  <Image
                    src={
                      item?.attachment ??
                      "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                    }
                    alt={item?.name ?? "demo"}
                    width={240}
                    height={120}
                    className="border-2 border-transparent hover:border-primary duration-500 w-[240px] h-[120px] rounded-xl mx-auto object-fill"
                  />
                </LinkButton>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            className="lg:w-8 lg:h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[8%] right-24"
            onClick={() => swiperRef.current.slidePrev()}
          >
            <FaAngleLeft className="text-xl" />
          </button>
          <button
            className="lg:w-8 lg:h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[8%] right-12"
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
