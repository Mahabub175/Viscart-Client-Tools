"use client";

import { Layout } from "antd";
import Sidebar from "@/components/Shared/Sidebar/Sidebar";
import { Content } from "antd/es/layout/layout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import PrivateRoute from "@/routes/PrivateRoute";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";
import BackToTop from "@/components/Shared/BackToTop";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";

const DashboardLayout = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PrivateRoute>
          <Layout>
            <LandingHeader />
            <Layout className="relative h-full mt-28 lg:mt-44">
              <div className="fixed top-14 lg:top-[8.5rem] z-50">
                <Sidebar />
              </div>
              <Content className="p-5 lg:pl-56 xl:pl-60 xxl:pl-56 mt-10">
                {children}
              </Content>
            </Layout>
            <BackToTop />
            <BottomNavigation />
          </Layout>
        </PrivateRoute>
      </PersistGate>
    </Provider>
  );
};

export default DashboardLayout;
