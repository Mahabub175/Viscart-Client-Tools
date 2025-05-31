/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, useDeviceId } from "@/redux/services/device/deviceSlice";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";

const Banner = () => {
  const dispatch = useDispatch();

  const deviceId = useSelector(useDeviceId);
  const user = useSelector(useCurrentUser);
  const { data: userData } = useGetSingleUserQuery(user?._id, {
    skip: !user?._id,
  });

  const { data: sliders } = useGetAllSlidersQuery();

  const pathname = usePathname();

  const activeSliders = sliders?.results?.filter(
    (item) => item.status === "Active" && !item?.bottomBanner
  );

  const pageData = {
    pathname,
    ...(user?._id && {
      userName: userData?.name,
      userNumber: userData?.number,
      userEmail: userData?.email,
    }),
    deviceId,
  };

  useEffect(() => {
    sendGTMEvent({ event: "PageViewHome", value: pageData });
  }, []);

  const itemClickHandler = (item) => {
    if (item?.category?.name) {
      dispatch(setFilter(item?.category?.name));
    }
  };

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
                onClick={() => itemClickHandler(item)}
                href={
                  item?.name
                    ? item.name
                    : item?.category?.name
                    ? `/products`
                    : "/"
                }
              >
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={"banner"}
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
