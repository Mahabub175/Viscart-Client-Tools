"use client";

import LinkButton from "@/components/Shared/LinkButton";
import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCartMutation } from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddServerTrackingMutation } from "@/redux/services/serverTracking/serverTrackingApi";
import useGetURL from "@/utilities/hooks/useGetURL";
import { sendGTMEvent } from "@next/third-parties/google";
import { Tooltip } from "antd";
import { useState } from "react";
import { AiOutlineFullscreen } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const QuickViewHover = ({ item, cartData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const { data: userData } = useGetSingleUserQuery(user?._id, {
    skip: !user?._id,
  });

  const [addCart] = useAddCartMutation();

  const url = useGetURL();
  const [addServerTracking] = useAddServerTrackingMutation();

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
      weight: item?.weight,
      price: item?.offerPrice > 0 ? item?.offerPrice : item?.sellingPrice,
      productName: item?.name,
      ...(user?._id && {
        userName: userData?.name,
        userNumber: userData?.number,
        userEmail: userData?.email,
      }),
      ...(user?._id && {
        name: userData?.name,
        number: userData?.number,
        email: userData?.email,
      }),
    };

    const toastId = toast.loading("Adding to cart");

    try {
      const res = await addCart(data);
      if (res?.data?.success) {
        sendGTMEvent({ event: "addToCart", value: data });

        const serverData = {
          event: "addToCart",
          data: {
            ...data,
            event_source_url: url,
          },
        };
        await addServerTracking(serverData);

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
    <div className="flex items-center justify-center gap-4 px-3 py-2">
      <div className="bg-primary px-2 lg:px-4 py-2 text-white rounded-full text-xs">
        {item?.isVariant || item?.variants?.length > 0 ? (
          <LinkButton href={`/products/${item?.slug}`}>
            <div>Details</div>
          </LinkButton>
        ) : (
          <button onClick={addToCart}>
            {" "}
            {cartData?.some((cartItem) => cartItem?.productId === item?._id)
              ? "Added"
              : "Add To Cart"}
          </button>
        )}
      </div>
      <div className="hidden lg:block">
        <Tooltip placement="top" title={"Quick View"} trigger={"hover"}>
          <div
            className="text-lg lg:text-2xl cursor-pointer hover:scale-110 duration-300"
            onClick={showModal}
          >
            <AiOutlineFullscreen />
          </div>
        </Tooltip>
      </div>
      <div className="lg:hidden">
        <div
          className="text-lg lg:text-2xl cursor-pointer hover:scale-110 duration-300"
          onClick={showModal}
        >
          <AiOutlineFullscreen />
        </div>
      </div>

      <QuickProductView
        item={item}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default QuickViewHover;
