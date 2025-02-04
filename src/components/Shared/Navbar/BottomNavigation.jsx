"use client";

import Link from "next/link";
import { AppstoreOutlined } from "@ant-design/icons";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { FaCodeCompare } from "react-icons/fa6";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetSingleCompareByUserQuery } from "@/redux/services/compare/compareApi";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";
import { Drawer } from "antd";
import { GiCancel } from "react-icons/gi";
import DrawerCart from "../Product/DrawerCart";
import { useState } from "react";
import {
  FaShoppingBag,
  FaPhone,
  FaWhatsapp,
  FaFacebookMessenger,
} from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";
import { motion } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const BottomNavigation = () => {
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data } = useGetSingleUserQuery(user?._id);
  const { data: compareData } = useGetSingleCompareByUserQuery(
    user?._id ?? deviceId
  );

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsContactOpen(!isContactOpen);
  };

  const navItems = [
    {
      name: "Contact",
      href: "#",
      icon: (
        <div className="relative cursor-pointer" onClick={handleContactClick}>
          <motion.div
            key={isContactOpen ? "close" : "chat"}
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: isContactOpen ? 180 : 0, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isContactOpen ? (
              <RxCross1 className="mb-1 mt-2.5 text-red-500" />
            ) : (
              <IoChatbubble className="mb-1 mt-2.5" />
            )}
          </motion.div>
        </div>
      ),
    },
    {
      name: "Offers",
      href: "/offers",
      icon: <AppstoreOutlined className="mb-1 mt-2.5" />,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: (
        <div
          className="relative cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setIsCartOpen(true);
          }}
        >
          <FaShoppingBag className="mb-1 mt-2.5" />
          {cartData?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartData.length}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Compare",
      href: "/compare",
      icon: (
        <div className="relative">
          <FaCodeCompare className="rotate-90 mt-2.5 mb-0.5" />
          {compareData?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {compareData.length}
            </span>
          )}
        </div>
      ),
    },
  ];

  if (data?.role) {
    navItems.push({
      name: "My Account",
      href: `/${data.role}/dashboard`,
      icon: <TbLayoutDashboardFilled className="mt-[13px] mb-1" />,
    });
  }

  return (
    <div className="relative">
      <div className="fixed -bottom-[1px] left-0 z-50 w-full bg-primary border-t border-gray-300 shadow-md lg:hidden">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center text-primaryLight relative"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {isContactOpen && (
        <div className="fixed bottom-16 left-6 z-50 flex flex-col space-y-2">
          <motion.a
            href={`tel:${globalData?.results?.businessNumber}`}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaPhone size={20} />
          </motion.a>
          <motion.a
            href={`https://wa.me/${globalData?.results?.whatsappNumber}`}
            className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FaWhatsapp size={20} />
          </motion.a>
          <motion.a
            href={`https://m.me/${globalData?.results?.messengerUsername}`}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaFacebookMessenger size={20} />
          </motion.a>
        </div>
      )}

      <Drawer
        placement="right"
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
        width={450}
        destroyOnClose
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <p className="text-2xl font-semibold">Shopping Cart</p>
          <button
            className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
            onClick={() => setIsCartOpen(false)}
          >
            <GiCancel className="text-xl text-gray-700" />
          </button>
        </div>
        <DrawerCart data={cartData} setDrawer={setIsCartOpen} />
      </Drawer>
    </div>
  );
};

export default BottomNavigation;
