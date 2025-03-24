import { Tooltip } from "antd";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import LinkButton from "@/components/Shared/LinkButton";
import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useSelector } from "react-redux";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import {
  useAddWishlistMutation,
  useGetSingleWishlistByUserQuery,
} from "@/redux/services/wishlist/wishlistApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { toast } from "sonner";
import { TbHeart } from "react-icons/tb";
import { IoCheckmark } from "react-icons/io5";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const deviceId = useSelector(useDeviceId);

  const [addWishlist] = useAddWishlistMutation();
  const user = useSelector(useCurrentUser);

  const { data: wishlistData } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );

  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const addToWishlist = async (id) => {
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: id,
    };

    const toastId = toast.loading("Adding to wishlist");

    try {
      const res = await addWishlist(data);
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
      toast.error("Failed to add item to wishlist.", { id: toastId });
    }
  };

  const isItemInWishlist = useMemo(() => {
    return wishlistData?.some(
      (wishlistItem) => wishlistItem?.product?._id === item?._id
    );
  }, [wishlistData, item?._id]);

  return (
    <div
      className="relative group lg:w-[200px] mx-auto h-[340px] flex flex-col border border-gray-200 bg-white rounded-xl overflow-hidden hover:-translate-y-2 duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip placement="top" title={"Add to Wishlist"}>
        <div
          className="absolute top-2 right-2 z-10 text-xl cursor-pointer hover:scale-110 duration-300 text-white p-1 bg-primary rounded-full"
          onClick={() => addToWishlist(item?._id)}
        >
          {isItemInWishlist ? <IoCheckmark /> : <TbHeart />}
        </div>
      </Tooltip>
      <LinkButton href={`/products/${item?.slug}`}>
        <div className="relative">
          <Image
            src={
              item?.mainImage
                ? formatImagePath(item?.mainImage)
                : "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
            }
            alt={item?.name ?? "product"}
            width={200}
            height={260}
            className="h-[180px] w-full lg:h-[200px] lg:group-hover:scale-110 duration-500"
          />
        </div>
      </LinkButton>

      <div>
        <div
          className={`text-center lg:text-start px-2 transition-transform duration-500 bg-white ${
            isHovered ? "lg:-translate-y-[50px]" : "lg:translate-y-0"
          }`}
        >
          <LinkButton href={`/products/${item?.slug}`}>
            <Tooltip placement="top" title={item?.name}>
              <h2 className="text-sm text-start md:text-base mt-2 lg:mt-3 hover:text-gray-500 duration-300 mb-1">
                {item?.name.length > 35
                  ? item.name.slice(0, 35).concat("...")
                  : item.name}
              </h2>
            </Tooltip>
          </LinkButton>
          <LinkButton href={`/products?filter=${item?.category?.name}`}>
            <h2 className="text-[10px] lg:text-xs text-start md:text-sm hover:text-gray-500 duration-300 text-gray-400">
              {item?.category?.name}
            </h2>
          </LinkButton>
        </div>
      </div>
      <div
        className={`text-center lg:text-start px-2 transition-transform duration-500 bg-white absolute bottom-10 lg:bottom-0 ${
          isHovered ? "lg:-translate-y-[50px]" : "lg:translate-y-0"
        }`}
      >
        <div className="flex items-center gap-2 lg:gap-3 mb-3">
          {item?.offerPrice && (
            <p className="text-xs lg:text-sm line-through text-red-500">
              {globalData?.results?.currency + " " + item?.sellingPrice}
            </p>
          )}
          {item?.offerPrice ? (
            <p className="text-black text-xs lg:text-sm text-primary">
              {globalData?.results?.currency + " " + item?.offerPrice}
            </p>
          ) : (
            <p className="text-black text-xs lg:text-sm text-primary">
              {globalData?.results?.currency + " " + item?.sellingPrice}
            </p>
          )}
          <div className="text-center text-[10px]">
            {!item?.stock > 0 ? (
              <div className="text-red-500">(Out Of Stock)</div>
            ) : (
              <div className="text-green-500">(In Stock)</div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div
          className={`absolute left-1/2 right-1/2 transform -translate-x-1/2 bottom-0 bg-white z-10 rounded-b-xl w-full overflow-hidden transition-transform duration-500 ${
            isHovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <QuickViewHover item={item} cartData={cartData} />
        </div>
      </div>
      <div className="lg:hidden absolute bottom-0 left-1/2 right-1/2 transform -translate-x-1/2 w-full">
        <QuickViewHover item={item} cartData={cartData} />
      </div>

      <QuickProductView
        item={item}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default ProductCard;
