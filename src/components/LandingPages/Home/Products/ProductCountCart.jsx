"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCartMutation } from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus, FaMinus, FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProductCountCart = ({
  item,
  single,
  handleModalClose = () => {},
  fullWidth,
  previousSelectedVariant,
}) => {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [openVariantModal, setOpenVariantModal] = useState(false);
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
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
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const handleAttributeSelect = (attributeName, option) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  const currentVariant = item?.variants.find((variant) =>
    variant.attributeCombination.every(
      (attr) => selectedAttributes[attr.attribute.name] === attr.name
    )
  );

  const groupedAttributes = item?.variants?.reduce((acc, variant) => {
    variant.attributeCombination.forEach((attr) => {
      if (!acc[attr.attribute.name]) {
        acc[attr.attribute.name] = [];
      }
      if (
        !acc[attr.attribute.name].some((option) => option.name === attr.name)
      ) {
        acc[attr.attribute.name].push(attr);
      }
    });
    return acc;
  }, {});

  const isOutOfStock =
    item?.stock <= 0 ||
    previousSelectedVariant?.stock <= 0 ||
    currentVariant?.stock <= 0;

  const currentPrice = currentVariant
    ? currentVariant?.sellingPrice
    : item?.sellingPrice;

  const addToCart = async (type) => {
    if (
      item?.variants?.length > 0 &&
      !previousSelectedVariant &&
      !currentVariant
    ) {
      setOpenVariantModal(true);
      toast.info("Please select a variant");
      return;
    }

    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: item?._id,
      quantity: count,
      sku: previousSelectedVariant?.sku ?? currentVariant?.sku ?? item?.sku,
      price: currentVariant?.sellingPrice
        ? currentVariant?.sellingPrice
        : item?.offerPrice
        ? item?.offerPrice
        : item?.sellingPrice,
    };

    const toastId = toast.loading("Adding to cart");

    try {
      const res = await addCart(data);
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
        handleModalClose();
        setCount(1);
        setOpenVariantModal(false);
        if (type === "buy") {
          router.push("/cart");
        }
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
          : "flex flex-col lg:flex-row items-center justify-between gap-5"
      }`}
    >
      {!isOutOfStock ? (
        <>
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
            func={() => addToCart("cart")}
            text={"Add"}
            icon={<FaCartShopping />}
            loading={isLoading}
            fullWidth={fullWidth}
          />
          <SubmitButton
            func={() => addToCart("buy")}
            text={"Buy Now"}
            icon={<FaCartShopping />}
            loading={isLoading}
            fullWidth={fullWidth}
          />
        </>
      ) : (
        <div className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10">
          Out Of Stock
        </div>
      )}
      <Modal
        open={openVariantModal}
        onCancel={() => setOpenVariantModal(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-4 p-5">
          {groupedAttributes &&
            Object.entries(groupedAttributes).map(
              ([attributeName, options]) => (
                <div key={attributeName} className="flex flex-col gap-2">
                  <span className="font-bold">{attributeName}:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {options.map((option) => (
                      <div
                        key={option._id}
                        className={`cursor-pointer px-4 py-2 border-2 rounded-lg  ${
                          selectedAttributes[attributeName] === option.name
                            ? "border-primary bg-primary-light text-primary font-bold"
                            : "border-gray-300"
                        }`}
                        style={
                          attributeName === "Color"
                            ? {
                                backgroundColor: option.label,
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                border:
                                  selectedAttributes[attributeName] ===
                                  option.name
                                    ? "2px solid #000"
                                    : "1px solid #ccc",
                              }
                            : {}
                        }
                        onClick={() =>
                          handleAttributeSelect(attributeName, option.name)
                        }
                      >
                        {attributeName.toLowerCase() !== "color" && (
                          <span>{option.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

          <div className="flex items-center gap-4 text-textColor font-bold my-2">
            Price:{" "}
            {item?.offerPrice ? (
              <p className="text-primary text-xl">
                {globalData?.results?.currency + " " + item?.offerPrice}
              </p>
            ) : (
              <p className="text-primary text-xl">
                {globalData?.results?.currency + " " + currentPrice}
              </p>
            )}
            {item?.offerPrice && (
              <p className="text-base line-through text-red-500">
                {globalData?.results?.currency + " " + currentPrice}
              </p>
            )}
          </div>

          {isOutOfStock ? (
            <>
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10 text-center">
                Out Of Stock
              </div>
            </>
          ) : (
            <>
              <SubmitButton
                func={() => addToCart("cart")}
                text={"Add"}
                icon={<FaCartShopping />}
                loading={isLoading}
                fullWidth={fullWidth}
              />
              <SubmitButton
                func={() => addToCart("buy")}
                text={"Buy Now"}
                icon={<FaCartShopping />}
                loading={isLoading}
                fullWidth={fullWidth}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductCountCart;
