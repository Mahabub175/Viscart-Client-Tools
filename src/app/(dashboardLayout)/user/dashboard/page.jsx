"use client";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserDashboardQuery } from "@/redux/services/dashboard/dashboardApi";
import { useEffect } from "react";
import { TbBrandAirtable } from "react-icons/tb";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const user = useSelector(useCurrentUser);

  const { data: dashboardData } = useGetSingleUserDashboardQuery(user?._id);

  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-10">
        <DashboardCards
          icon={TbBrandAirtable}
          title="Wishlists"
          data={dashboardData?.wishlists}
          href={"/user/orders/wishlist"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Carts"
          data={dashboardData?.carts || 0}
          href={"/user/orders/cart"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Orders"
          data={dashboardData?.orders || 0}
          href={"/user/orders/order"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Account Setting"
          href={"/user/account-setting"}
        />
      </div>
    </>
  );
};

export default UserDashboard;
