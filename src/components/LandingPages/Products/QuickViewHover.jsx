"use client";

import LinkButton from "@/components/Shared/LinkButton";
import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCartMutation } from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { Tooltip } from "antd";
import { useState } from "react";
import { AiOutlineFullscreen } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const QuickViewHover = ({ item }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const [addCart] = useAddCartMutation();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const addToCart = async () => {
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: item?._id,
      quantity: 1,
      sku: item?.sku,
      price: item?.offerPrice ? item?.offerPrice : item?.sellingPrice,
    };

    const toastId = toast.loading("Adding to cart");

    try {
      const res = await addCart(data);
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart.", { id: toastId });
    }
  };

  return (
    <div className="flex items-center gap-4 px-3 py-2">
      <div className="bg-primary px-2 lg:px-4 py-2 text-white rounded-full text-xs">
        {item?.isVariant || item?.variants?.length > 0 ? (
          <LinkButton href={`/products/${item?.slug}`}>
            <div>Details</div>
          </LinkButton>
        ) : (
          <button onClick={addToCart}>Add to cart</button>
        )}
      </div>
      <Tooltip placement="top" title={"Quick View"}>
        <div
          className="text-lg lg:text-2xl cursor-pointer hover:scale-110 duration-300"
          onClick={showModal}
        >
          <AiOutlineFullscreen />
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
