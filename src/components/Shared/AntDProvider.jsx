"use client";

import { useEffect } from "react";
import { ConfigProvider } from "antd";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { getColors, setColors } from "@/redux/services/theme/themeSlice";
import { logout, useCurrentToken } from "@/redux/services/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import Script from "next/script";

const AntDProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <WrappedAntDConfig>{children}</WrappedAntDConfig>
      </PersistGate>
    </Provider>
  );
};

const WrappedAntDConfig = ({ children }) => {
  const router = usePathname();
  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);
  const { data } = useGetAllGlobalSettingQuery();
  const { primaryColor } = useSelector(getColors);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const tokenExpirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > tokenExpirationTime) {
        dispatch(logout());
      }
    }

    if (data?.results) {
      const websiteName = data?.results?.name || "Viscart";

      document.title = websiteName;

      const { primaryColor, secondaryColor } = data.results;

      dispatch(setColors({ primaryColor, secondaryColor }));

      document.documentElement.style.setProperty(
        "--primaryColor",
        primaryColor
      );
      document.documentElement.style.setProperty(
        "--secondaryColor",
        secondaryColor
      );
    }
  }, [data, dispatch, token]);

  useEffect(() => {
    const websiteName = data?.results?.name || "Viscart";
    document.title = websiteName;
  }, [data, router]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemSelectedColor: primaryColor,
            itemActiveBg: primaryColor,
            itemHoverBg: primaryColor,
            itemHoverColor: primaryColor,
            inkBarColor: primaryColor,
          },
          Table: {
            scroll: { x: 1000 },
          },
          Menu: {
            itemSelectedBg: primaryColor,
            itemSelectedColor: "#fff",
            itemActiveBg: primaryColor,
            itemActiveColor: "#fff",
            itemHoverBg: primaryColor,
            itemHoverColor: "#fff",
          },
          Input: {
            activeBorderColor: primaryColor,
            hoverBorderColor: primaryColor,
          },
          Upload: {
            colorPrimaryHover: primaryColor,
            colorPrimary: primaryColor,
          },
          Progress: {
            defaultColor: primaryColor,
          },
        },
        token: {
          colorPrimary: primaryColor,
          colorBorder: "#ebe7e8",
          colorPrimaryBorder: primaryColor,
        },
      }}
    >
      <Toaster closeButton duration={2000} richColors position="top-right" />
      {children}
      <Script
        id="crisp-chat"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
              window.$crisp=[];window.CRISP_WEBSITE_ID="a716db7a-951a-48d0-823a-79141fe8b539";
              (function(){
                d=document;
                s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
        }}
      />
    </ConfigProvider>
  );
};

export default AntDProvider;
