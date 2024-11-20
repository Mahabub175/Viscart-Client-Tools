"use client";

import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddWishlistMutation } from "@/redux/services/wishlist/wishlistApi";
import { Tooltip } from "antd";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineFullscreen } from "react-icons/ai";
import { TbHeart, TbListDetails } from "react-icons/tb";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const QuickViewHover = ({ item }) => {
  const user = useSelector(useCurrentUser);
  const [addWishlist] = useAddWishlistMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const addToWishlist = async (id) => {
    if (!user) {
      toast.error("Please login to add to wishlist.");
      return;
    }
    const data = {
      user: user?._id,
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

  return (
    <div className="flex items-center justify-center gap-4 bg-white/60 px-3 py-4">
      <Tooltip placement="top" title={"Quick View"}>
        <div
          className="text-xl cursor-pointer hover:scale-110 duration-300 hover:text-primary"
          onClick={showModal}
        >
          <AiOutlineFullscreen />
        </div>
      </Tooltip>

      <span className="border h-4 w-[1px] border-textColor"></span>
      <Tooltip placement="top" title={"Details"}>
        <Link
          href={`/products/${item?.slug}`}
          className="text-lg cursor-pointer hover:scale-110 duration-300 hover:text-primary"
        >
          <TbListDetails />
        </Link>
      </Tooltip>

      <span className="border h-4 w-[1px] border-textColor"></span>
      <Tooltip placement="top" title={"Add to Wishlist"}>
        <div
          className="text-lg cursor-pointer hover:scale-110 duration-300 hover:text-danger"
          onClick={() => addToWishlist(item?._id)}
        >
          <TbHeart />
        </div>
      </Tooltip>

      <QuickProductView
        item={item}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default QuickViewHover;
