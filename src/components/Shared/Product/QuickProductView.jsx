"use client";

import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import { Modal, Rate } from "antd";
import Image from "next/image";
import { useState } from "react";

const QuickProductView = ({ item, isModalVisible, handleModalClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const currentPrice = selectedVariant
    ? selectedVariant?.sellingPrice
    : item?.sellingPrice;

  return (
    <Modal
      open={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
      centered
      loading={!item}
      width={800}
    >
      <div className="flex flex-col items-center justify-center lg:flex-row gap-10 pt-5">
        <div className="w-full">
          <Image
            src={item?.mainImage}
            alt={item?.name}
            width={300}
            height={300}
            className="w-full h-[300px] rounded-xl"
          />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-semibold">{item?.name}</h2>
          <div className="flex items-center mt-4 gap-4 font-bold">
            <Rate disabled value={item?.ratings?.average} allowHalf />(
            {item?.ratings?.count})
          </div>
          <p>{item?.details}</p>
          {item?.brand && (
            <p className="font-bold my-2 text-textColor">
              Brand: {item?.brand?.name}
            </p>
          )}
          <p className="font-bold my-2 text-textColor">
            Category: {item?.category?.name}
          </p>
          {item?.variants?.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-bold">Select Variant:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {item?.variants.map((variant) => (
                    <div
                      key={variant._id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`cursor-pointer size-10 rounded-full border-4 ${
                        selectedVariant?._id === variant._id
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      title={variant?.attributeCombination
                        ?.map((attribute) => attribute?.label)
                        .join(" : ")}
                      style={{
                        backgroundColor:
                          variant?.attributeCombination?.[0]?.label,
                      }}
                    >
                      {variant?.attributeCombination?.map((attribute, idx) => (
                        <div key={idx}>
                          {attribute?.type === "other" && (
                            <span className="text-black flex items-center justify-center mt-1 font-bold">
                              {attribute?.label}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 text-textColor font-bold my-2">
            Price:{" "}
            {item?.offerPrice ? (
              <p className="text-primary text-xl">${item?.offerPrice}</p>
            ) : (
              <p className="text-primary text-xl">${currentPrice}</p>
            )}
            {item?.offerPrice && (
              <p className="text-base line-through text-red-500">
                ${currentPrice}
              </p>
            )}
          </div>
          <hr />
          <ProductCountCart
            item={item}
            handleModalClose={handleModalClose}
            previousSelectedVariant={selectedVariant}
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};

export default QuickProductView;
