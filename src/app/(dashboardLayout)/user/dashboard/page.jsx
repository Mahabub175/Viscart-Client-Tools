"use client";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserDashboardQuery } from "@/redux/services/dashboard/dashboardApi";
import { Avatar, Drawer } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TbBrandAirtable } from "react-icons/tb";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import LogOutButton from "@/components/Dashboard/LogOutButton";
import DrawerCart from "@/components/Shared/Product/DrawerCart";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { GiCancel } from "react-icons/gi";

const UserDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data } = useGetSingleUserQuery(user?._id);

  const { data: dashboardData } = useGetSingleUserDashboardQuery(user?._id);

  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);

  const [drawerWidth, setDrawerWidth] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(window.innerWidth >= 1024 ? 450 : 300);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
      <div className="mb-10 flex items-center gap-5">
        <div>
          {data?.profile_image ? (
            <Image
              src={data?.profile_image}
              alt="profile"
              height={100}
              width={100}
              className="rounded-full w-[100px] h-[100px] border-2 border-primaryLight object-contain"
            />
          ) : (
            <Avatar
              className="rounded-full w-[100px] h-[100px] border-2 border-primaryLight"
              size={100}
              icon={<UserOutlined />}
            />
          )}
        </div>
        <div>
          <p>Hello,</p>
          <p className="text-base lg:text-4xl font-medium">{data?.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-10">
        <DashboardCards
          icon={TbBrandAirtable}
          title="Wishlists"
          data={dashboardData?.wishlists}
          href={"/wishlist"}
        />
        <div
          className="bg-white p-5 rounded-xl shadow-xl text-base font-bold text-end flex flex-col justify-center lg:justify-around items-center gap-2 hover:text-primary"
          onClick={() => setIsCartOpen(true)}
        >
          <TbBrandAirtable className="text-[40px] lg:text-[50px] text-primary" />
          <div className="flex items-center gap-2 lg:gap-4 text-center">
            <p className="text-sm lg:text-xl">Total Carts</p>
            <p className="text-2xl lg:text-4xl">{dashboardData?.carts || 0}</p>
          </div>
        </div>
        <DashboardCards
          icon={TbBrandAirtable}
          title="Orders"
          data={dashboardData?.orders || 0}
          href={"/user/orders/order"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Reviews"
          href={"/user/review"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Account Setting"
          href={"/user/account-setting"}
        />
        <LogOutButton />
      </div>
      <Drawer
        placement="right"
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
        width={drawerWidth}
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
        <DrawerCart data={cartData} setDrawer={setIsCartOpen} />
      </Drawer>
    </section>
  );
};

export default UserDashboard;
