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
import LandingFooter from "@/components/Shared/Footer/LandingFooter";

const DashboardLayout = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PrivateRoute>
          <Layout>
            <LandingHeader />
            <Layout className="relative mt-28 lg:mt-44">
              <Content
                style={{
                  padding: 24,
                  minHeight: 280,
                }}
              >
                <Sidebar />
                {children}
              </Content>
            </Layout>
            <BackToTop />
            <BottomNavigation />
            <LandingFooter />
          </Layout>
        </PrivateRoute>
      </PersistGate>
    </Provider>
  );
};

export default DashboardLayout;
