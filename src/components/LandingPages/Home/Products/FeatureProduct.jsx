"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef } from "react";
import { formatImagePath } from "@/utilities/lib/formatImagePath";

const FeatureProduct = () => {
  const swiperRef = useRef(null);
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const categoryProductCounts = activeProducts?.reduce((acc, product) => {
    const categoryId = product?.category?._id;
    const categoryName = product?.category?.name;
    if (categoryId) {
      acc[categoryId] = acc[categoryId] || { name: categoryName, products: [] };
      acc[categoryId].products.push(product);
    }
    return acc;
  }, {});

  const topCategories = Object.values(categoryProductCounts || {})
    .sort((a, b) => b.products.length - a.products.length)
    .slice(0, 3);

  return (
    <section className="pt-10 my-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {topCategories?.map((category) => (
          <div key={category.name} className="mb-10 relative">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">
              {category.name}
            </h2>

            <div>
              <button
                className="absolute top-[0%] right-12 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <FaAngleLeft className="text-xl" />
              </button>
              <button
                className="absolute top-[0%] right-0 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <FaAngleRight className="text-xl" />
              </button>

              <Swiper
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                loop={true}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="mySwiper rounded-xl"
              >
                {category?.products
                  ?.reduce((acc, product, index) => {
                    const slideIndex = Math.floor(index / 3);
                    acc[slideIndex] = acc[slideIndex] || [];
                    acc[slideIndex].push(product);
                    return acc;
                  }, [])
                  .map((slideProducts, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="flex flex-col gap-5">
                        {slideProducts?.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-5 rounded-xl bg-white shadow-xl p-5 h-[180px]"
                          >
                            <Image
                              src={formatImagePath(item?.mainImage)}
                              alt={item?.name}
                              height={120}
                              width={120}
                              className="rounded-xl"
                            />
                            <Link href={`/products/${item?.slug}`}>
                              <h2 className="text-lg font-semibold mb-2">
                                {item?.name}
                              </h2>
                              <div className="flex items-center mb-2 gap-4 font-bold">
                                <Rate
                                  disabled
                                  value={item?.ratings?.average}
                                  allowHalf
                                />
                                ({item?.ratings?.count})
                              </div>
                              <div className="flex items-center gap-4">
                                {item?.offerPrice && (
                                  <p className="text-base font-bold line-through text-red-500">
                                    {globalData?.results?.currency +
                                      " " +
                                      item?.sellingPrice}
                                  </p>
                                )}
                                <p className="text-primary text-2xl font-bold">
                                  {globalData?.results?.currency +
                                    " " +
                                    (item?.offerPrice || item?.sellingPrice)}
                                </p>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureProduct;
