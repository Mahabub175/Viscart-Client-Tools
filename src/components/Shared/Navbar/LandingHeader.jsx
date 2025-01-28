/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Drawer, Popover } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeart, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import CategoryNavigation from "./CategoryNavigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useGetSingleCompareByUserQuery } from "@/redux/services/compare/compareApi";
import { useGetSingleWishlistByUserQuery } from "@/redux/services/wishlist/wishlistApi";
import DrawerCart from "../Product/DrawerCart";
import { GiCancel } from "react-icons/gi";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { IoMdArrowDropdown } from "react-icons/io";
import CategoryBrandNavigation from "./CategoryBrandNavigation";
import ProductSearchBar from "./ProductSearchBar";

const LandingHeader = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data } = useGetSingleUserQuery(user?._id);
  const { data: compareData } = useGetSingleCompareByUserQuery(
    user?._id ?? deviceId
  );
  const { data: wishListData } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );
  const { data: cartData, refetch } = useGetSingleCartByUserQuery(
    user?._id ?? deviceId
  );

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: products } = useGetAllProductsQuery();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  const links = {
    Dashboard: `/${data?.role}/dashboard`,
    Order: `/${data?.role}/orders/order`,
    Profile: `/${data?.role}/account-setting`,
    Wishlist: `/${data?.role}/orders/wishlist`,
    Cart: `/${data?.role}/orders/cart`,
  };

  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const content = (
    <div>
      <div className="rounded-md px-16 py-3">
        <div className="flex flex-col items-start gap-4 text-md">
          {["Dashboard", "Order", "Profile", "Wishlist", "Cart"].map(
            (item, index) => (
              <Link
                key={index}
                href={links[item]}
                className={`gap-2 font-bold duration-300 ${
                  pathname === links[item]
                    ? "text-primary hover:text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                {item}
              </Link>
            )
          )}
        </div>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button
          onClick={handleLogout}
          className={`w-full font-bold`}
          size="large"
          type="primary"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full shadow-md transition-transform duration-300 z-50`}
    >
      <div
        className={`transition-all duration-300 ease-in-out lg:pb-4 ${
          lastScrollY > 0
            ? "-translate-y-full opacity-0 pointer-events-none -my-6 lg:-my-6"
            : "translate-y-0 opacity-100"
        } bg-black/90 py-2 text-center px-2 text-sm md:text-base text-white`}
      >
        {globalData?.results?.announcement ?? "Some Announcement"}
      </div>

      <nav className="bg-black">
        <div className="my-container px-2 lg:-my-2">
          <div className="flex justify-between items-center gap-10">
            <div className="flex items-center gap-2">
              <Button
                type="text"
                className="lg:hidden text-primaryLight"
                icon={<MenuOutlined />}
                onClick={toggleDrawer}
              />
              <Link href={"/"}>
                <Image
                  src={globalData?.results?.logo}
                  alt="logo"
                  width={100}
                  height={100}
                  className="h-[70px] lg:h-full w-full object-contain -my-1.5 lg:my-0"
                />
              </Link>
            </div>

            <ProductSearchBar
              products={products}
              globalData={globalData}
              isMobile
            />

            <div className="flex gap-6 items-center text-lg">
              <Link
                href={"/compare"}
                className="hidden lg:flex bg-white p-3 rounded-full cursor-pointer hover:text-primary duration-300"
              >
                {compareData?.[0]?.product?.length > 0 ? (
                  <span className="relative">
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {compareData?.[0]?.product?.length}
                    </span>
                    <FaCodeCompare className="rotate-90" />
                  </span>
                ) : (
                  <FaCodeCompare className="rotate-90" />
                )}
              </Link>
              <Link
                href={"/wishlist"}
                className="hidden lg:flex bg-white p-3 rounded-full cursor-pointer hover:text-primary duration-300"
              >
                {wishListData?.length > 0 ? (
                  <span className="relative">
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {wishListData?.length}
                    </span>
                    <FaHeart />
                  </span>
                ) : (
                  <FaHeart />
                )}
              </Link>
              <div className="lg:hidden">
                <FaSearch
                  className="text-xl cursor-pointer text-primaryLight"
                  onClick={toggleSearchBar}
                />
              </div>
              {user?._id ? (
                <>
                  {" "}
                  <div className="-ml-2">
                    <Popover
                      placement="bottomRight"
                      content={content}
                      className="cursor-pointer flex items-center gap-1 text-primaryLight"
                    >
                      {data?.profile_image ? (
                        <Image
                          src={data?.profile_image}
                          alt="profile"
                          height={40}
                          width={40}
                          className="rounded-full w-[30px] h-[30px] lg:w-[90px] lg:h-[35px] border-2 border-primaryLight object-contain"
                        />
                      ) : (
                        <Avatar
                          className="rounded-full w-[35px] h-[35px] border-2 border-primaryLight"
                          size={30}
                          icon={<UserOutlined />}
                        />
                      )}
                      <h2 className="font-normal text-sm flex items-center mr-2">
                        {/* {data?.name ?? "User"} */}
                        <IoMdArrowDropdown />
                      </h2>
                    </Popover>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={"/sign-in"}
                    className="bg-white p-1.5 lg:p-3 rounded-full flex items-center gap-2 lg:w-[170px] cursor-pointer hover:text-primary duration-300"
                  >
                    <FaUser />
                    <span className="text-sm hidden lg:block">
                      Login / Register
                    </span>
                  </Link>
                </>
              )}
              <div
                className="hidden lg:flex bg-white p-3 rounded-full cursor-pointer hover:text-primary duration-300"
                onClick={() => setIsCartOpen(true)}
              >
                {cartData?.length > 0 ? (
                  <span className="relative">
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {cartData?.length}
                    </span>
                    <FaShoppingBag />
                  </span>
                ) : (
                  <FaShoppingBag
                    className="cursor-pointer hover:text-primary duration-300"
                    onClick={() => setIsCartOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {isSearchOpen && (
        <ProductSearchBar products={products} globalData={globalData} />
      )}
      <div className="hidden lg:flex gap-6 items-center bg-black/95">
        <CategoryNavigation />
      </div>
      <Drawer
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <div className="flex justify-between items-center -mt-5">
          <Link href={"/"}>
            <Image
              src={globalData?.results?.logo}
              alt="logo"
              width={80}
              height={80}
            />
          </Link>
          <button
            className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
            onClick={() => setIsDrawerOpen(false)}
          >
            <GiCancel className="text-xl text-gray-700" />
          </button>
        </div>

        <ProductSearchBar products={products} globalData={globalData} />
        <CategoryBrandNavigation />
      </Drawer>
      <Drawer
        placement="right"
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
        width={450}
        keyboard={true}
        destroyOnClose
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <p className="lg:text-2xl font-semibold">Shopping Cart</p>
          <button
            className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
            onClick={() => setIsCartOpen(false)}
          >
            <GiCancel className="text-xl text-gray-700" />
          </button>
        </div>
        <DrawerCart data={cartData} refetch={refetch} />
      </Drawer>
    </header>
  );
};

export default LandingHeader;
