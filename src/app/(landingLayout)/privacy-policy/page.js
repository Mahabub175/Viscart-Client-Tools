"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const PrivacyPolicy = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  return (
    <div className="mt-28 mb-20 lg:mt-56 my-container">
      <div
        dangerouslySetInnerHTML={{
          __html: globalData?.results?.privacyPolicy,
        }}
      />
    </div>
  );
};

export default PrivacyPolicy;
