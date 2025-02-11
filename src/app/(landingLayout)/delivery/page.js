"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const Delivery = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <div className="mt-28 mb-20 lg:mt-56 my-container">
      <div
        dangerouslySetInnerHTML={{
          __html: globalData?.results?.delivery ?? "Viscart Delivery",
        }}
      />
    </div>
  );
};

export default Delivery;
