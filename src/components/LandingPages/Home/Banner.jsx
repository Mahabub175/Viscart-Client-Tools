"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import Link from "next/link";
import useGetURL from "@/utilities/hooks/useGetURL";
import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAddServerTrackingMutation } from "@/redux/services/serverTracking/serverTrackingApi";

const Banner = () => {
  const { data: sliders } = useGetAllSlidersQuery();

  const url = useGetURL();
  const [addServerTracking] = useAddServerTrackingMutation();

  useEffect(() => {
    sendGTMEvent({ event: "PageView", value: url });
    const data = {
      event: "PageView",
      data: {
        event_source_url: url,
      },
    };
    addServerTracking(data);
  }, [url]);

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
        className="h-full"
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
