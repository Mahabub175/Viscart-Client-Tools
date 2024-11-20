"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCartMutation } from "@/redux/services/cart/cartApi";
import { useState } from "react";
import { FaPlus, FaMinus, FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProductCountCart = ({ item, single, handleModalClose, fullWidth }) => {
  const [count, setCount] = useState(1);

  const user = useSelector(useCurrentUser);
  const [addCart, { isLoading }] = useAddCartMutation();

  const handleCount = (action) => {
    if (action === "increment") {
      setCount((prev) => prev + 1);
    } else if (action === "decrement") {
      if (count > 1) {
        setCount((prev) => prev - 1);
      } else {
        toast.error("Count cannot be less than one");
      }
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart.");
      return;
    }
    const data = {
      user: user?._id,
      product: item?._id,
      quantity: count,
      price: item?.sellingPrice * count,
    };

    const toastId = toast.loading("Adding to cart");

    try {
      const res = await addCart(data);
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
        handleModalClose();
        setCount(1);
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
    <div
      className={`mt-5 lg:mt-10 ${
        single
          ? "gap-5 flex flex-col lg:flex-row items-center"
          : "flex items-center justify-between gap-5"
      }`}
    >
      <div className="flex items-center gap-3 border border-primaryLight rounded-xl p-1.5">
        <button
          className="cursor-pointer bg-primaryLight p-2 rounded text-xl"
          onClick={() => handleCount("decrement")}
        >
          <FaMinus />
        </button>
        <span className="text-base font-bold text-textColor">{count}</span>
        <button
          className="cursor-pointer bg-primaryLight p-2 rounded text-xl"
          onClick={() => handleCount("increment")}
        >
          <FaPlus />
        </button>
      </div>
      <SubmitButton
        func={addToCart}
        text={"Add"}
        icon={<FaCartShopping />}
        loading={isLoading}
        fullWidth={fullWidth}
      />
    </div>
  );
};

export default ProductCountCart;
