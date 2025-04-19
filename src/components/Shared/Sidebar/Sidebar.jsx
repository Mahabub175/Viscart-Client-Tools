"use client";

import { Menu } from "antd";
import { usePathname } from "next/navigation";
import "./sidebar.css";
import { sidebarItemsGenerator } from "@/utilities/lib/sidebarItemsGenerator";
import { userSidebarRoutes } from "@/routes/user.routes";
import { adminSidebarRoutes } from "@/routes/admin.routes";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";

const Sidebar = () => {
  const user = useSelector(useCurrentUser);

  const pathname = usePathname();

  let routes;

  switch (user?.role) {
    case "admin":
      routes = adminSidebarRoutes;
      break;
    case "user":
      routes = userSidebarRoutes;
      break;
  }

  const sidebarItems = sidebarItemsGenerator(routes, pathname, user?.role);

  const formattedSegment = pathname
    .split("/")
    .slice(-1)[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="relative !bg-primary border-r border-gray-200 drop-shadow-primary mb-10">
      <Menu
        theme="dark"
        mode="horizontal"
        className="py-1 lg:py-4 flex items-center"
        items={sidebarItems}
        defaultSelectedKeys={formattedSegment}
      />
    </div>
  );
};

export default Sidebar;
