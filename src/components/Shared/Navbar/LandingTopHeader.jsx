import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { logout, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";
import { useGetSingleCompareByUserQuery } from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { useGetSingleWishlistByUserQuery } from "@/redux/services/wishlist/wishlistApi";
import { UserOutlined } from "@ant-design/icons";
import { AutoComplete, Avatar, Button, Popover } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaCartPlus, FaSearch } from "react-icons/fa";
import { FaCartArrowDown, FaCodeCompare } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const LandingTopHeader = () => {
  const pathname = usePathname();
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
  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);
  const { data: products } = useGetAllProductsQuery();
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const [options, setOptions] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }

    const filteredOptions = products?.results?.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.name?.toLowerCase().includes(value.toLowerCase())
    );

    setOptions(
      filteredOptions?.map((product) => ({
        value: product.name,
        label: (
          <Link
            href={`/products/${product?.slug}`}
            className="flex items-center gap-4 hover:text-primary pb-2 border-b border-b-gray-300"
          >
            <Image
              src={product?.mainImage}
              alt="product"
              width={30}
              height={30}
              className="object-cover"
            />
            <div className="ml-2">
              <p className="text-lg font-medium">{product?.name}</p>
              <p>
                Price: $
                {product?.offerPrice
                  ? product?.offerPrice
                  : product?.sellingPrice}
              </p>
              <p>Category: {product?.category?.name}</p>
            </div>
          </Link>
        ),
      })) || []
    );
  };

  const links = {
    Dashboard: `/${data?.role}/dashboard`,
    Order: `/${data?.role}/orders/order`,
    Profile: `/${data?.role}/account-setting`,
    Wishlist: `/${data?.role}/orders/wishlist`,
    Cart: `/${data?.role}/orders/cart`,
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

  const routes = (
    <div className="flex flex-col md:flex-row md:items-center gap-10">
      <Link
        href={"/compare"}
        className={`flex flex-col items-center font-bold duration-300 ${
          pathname == "/compare"
            ? "text-primary hover:text-primary"
            : "text-black hover:text-primary"
        }`}
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
        <span>Compare</span>
      </Link>
      <Link
        href={"/wishlist"}
        className={`flex flex-col items-center font-bold duration-300 ${
          pathname == "/wishlist"
            ? "text-primary hover:text-primary"
            : "text-black hover:text-primary"
        }`}
      >
        {wishListData?.length > 0 ? (
          <span className="relative">
            <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {wishListData?.length}
            </span>
            <FaCartArrowDown />
          </span>
        ) : (
          <FaCartArrowDown />
        )}
        <span>Wishlist</span>
      </Link>
      <Link
        href={"/cart"}
        className={`flex flex-col items-center font-bold duration-300 ${
          pathname == "/cart"
            ? "text-primary hover:text-primary"
            : "text-black hover:text-primary"
        }`}
      >
        {cartData?.length > 0 ? (
          <span className="relative">
            <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {cartData?.length}
            </span>
            <FaCartPlus />
          </span>
        ) : (
          <FaCartPlus />
        )}
        <span>Cart</span>
      </Link>
    </div>
  );

  return (
    <div className="md:flex items-center justify-between container mx-auto px-5">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <Link href={"/"}>
          <Image
            src={globalData?.results?.logo}
            alt="logo"
            width={80}
            height={50}
          />
        </Link>
        <div className="hidden lg:block relative">
          <AutoComplete
            options={options}
            onSearch={handleSearch}
            placeholder="Search for Products..."
            size="large"
            className="!w-[30vw]"
          />
          <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-xl" />
        </div>
      </div>
      {routes}
      <div className="mt-10 md:mt-0 md:flex items-center gap-4 ">
        {user?._id ? (
          <>
            {" "}
            <div className="flex items-center gap-2">
              <Popover
                placement="bottomRight"
                content={content}
                className="cursor-pointer flex items-center gap-1"
              >
                {data?.profile_image ? (
                  <Image
                    src={data?.profile_image}
                    alt="profile"
                    height={40}
                    width={40}
                    className="rounded-full w-[40px] h-[40px] border-2 border-primary"
                  />
                ) : (
                  <Avatar className="" size={40} icon={<UserOutlined />} />
                )}
                <h2 className="font-semibold">{data?.name ?? "User"}</h2>
                <IoMdArrowDropdown />
              </Popover>
            </div>
          </>
        ) : (
          <>
            <Link
              href={"/sign-in"}
              className="flex items-center gap-2 text-primary"
            >
              <Button type="default" className="!px-6 !py-4 !font-bold">
                Sign In
              </Button>
            </Link>
            <Link
              href={"/sign-up"}
              className="flex items-center gap-2 text-black "
            >
              <Button type="primary" className="!px-6 !py-4 !font-bold">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingTopHeader;
