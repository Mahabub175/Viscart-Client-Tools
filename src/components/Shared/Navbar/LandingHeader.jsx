"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import LandingTopHeader from "./LandingTopHeader";
import { GiCancel } from "react-icons/gi";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
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
    <div className="bg-grey">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-5 py-2">
        <Link href={"/"}>Hotline: +880 1810 169 101</Link>
        <div className="flex items-center gap-4">
          <Link href={"/"}>Contact Us</Link>
          <div>|</div>
          <div className="flex items-center gap-4">
            <Link href={"/"} target="_blank">
              <FaFacebook className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link href={"/"} target="_blank">
              <FaLinkedin className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link href={"/"} target="_blank">
              <FaInstagram className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link href={"/"} target="_blank">
              <FaSquareXTwitter className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="mb-5">
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
        <div>
          {top}
          <LandingTopHeader />
          <CategoryNavigation />
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;
