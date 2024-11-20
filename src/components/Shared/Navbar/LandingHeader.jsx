"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import LandingTopHeader from "./LandingTopHeader";
import { GiCancel } from "react-icons/gi";
import { FaLocationDot } from "react-icons/fa6";
import CategoryNavigation from "./CategoryNavigation";
import BottomNavigation from "./BottomNavigation";

const LandingHeader = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const top = (
    <div className="bg-primary">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-5 py-2 text-white font-bold">
        <Link href={"/track-order"} className="flex items-center gap-2">
          <FaLocationDot />
          Track Order
        </Link>
        <div></div>
      </div>
    </div>
  );

  return (
    <nav className="mb-5 relative">
      {isMobile ? (
        <>
          {top}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                type="primary"
                icon={<MenuOutlined />}
                onClick={showDrawer}
                style={{ margin: 16 }}
              />
              <Link href="/">
                <span className="text-2xl font-extrabold text-primary mt-1">
                  Viscart
                </span>
              </Link>
            </div>
            <Link href="/sign-in">
              <span className="flex items-center gap-2 text-primary px-4">
                <Button type="primary">Sign In</Button>
              </span>
            </Link>
            <Drawer
              title="Menu"
              placement="left"
              onClose={onClose}
              open={drawerVisible}
            >
              <div className="flex items-center justify-between gap-4 mb-10">
                <Link href={"/"}>
                  <p className="text-2xl font-extrabold text-primary lg:flex">
                    Viscart
                  </p>
                </Link>
                <button
                  className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
                  onClick={onClose}
                >
                  <GiCancel className="text-xl text-gray-700" />
                </button>
              </div>
              <CategoryNavigation onClose={onClose} />
            </Drawer>
            <BottomNavigation />
          </div>
        </>
      ) : (
        <div className="!sticky top-0 z-50 bg-white">
          {top}
          <LandingTopHeader />
          <CategoryNavigation />
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;
