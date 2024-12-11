"use client";

import { useState } from "react";
import { useGetSingleProductBySlugQuery } from "@/redux/services/product/productApi";
import { Modal, Rate } from "antd";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Image from "next/image";
import { FaWhatsapp, FaPlay, FaMinus, FaPlus } from "react-icons/fa";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { usePathname } from "next/navigation";
import SingleProductCart from "./SingleProductCart";
import { toast } from "sonner";

const SinglePageCart = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

  const pathname = usePathname();

  const businessWhatsapp = globalData?.results?.businessWhatsapp;

  const handleWhatsappClick = () => {
    window.open(`https://wa.me/${businessWhatsapp}`, "_blank");
  };

  const [videoModal, setVideoModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [count, setCount] = useState(1);

  const handleAttributeSelect = (attributeName, option) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
    const variant = singleProduct?.variants.find((v) =>
      v.attributeCombination.every(
        (attr) => selectedAttributes[attr.attribute.name] === attr.name
      )
    );
    if (variant?.image) {
      setSelectedImage(formatImagePath(variant.image));
    }
  };

  const currentVariant = singleProduct?.variants.find((variant) =>
    variant.attributeCombination.every(
      (attr) => selectedAttributes[attr.attribute.name] === attr.name
    )
  );

  const currentPrice = currentVariant
    ? currentVariant?.sellingPrice
    : singleProduct?.sellingPrice;

  const currentImage = selectedImage
    ? selectedImage
    : currentVariant?.image
    ? formatImagePath(currentVariant.image)
    : pathname.includes("/products")
    ? singleProduct?.mainImage
    : formatImagePath(singleProduct?.mainImage);

  const groupedAttributes = singleProduct?.variants?.reduce((acc, variant) => {
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

  const variantImages = singleProduct?.variants
    ?.filter((variant) => variant.image)
    ?.map((variant) => formatImagePath(variant.image));

  const handleCount = (action) => {
    if (action === "increment") {
      setCount((prev) => prev + 1);
    } else if (action === "decrement") {
      if (count > 1) {
        setCount((prev) => prev - 1);
      } else {
        toast.info("Count cannot be less than one");
      }
    }
  };

  const isOutOfStock = singleProduct?.stock <= 0 || currentVariant?.stock <= 0;
  return (
    <section className="container mx-auto px-2 lg:px-5 lg:py-10">
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 mb-10">
          <div className="bg-primaryLight p-10 rounded-xl relative">
            {currentImage ? (
              <Zoom>
                <Image
                  src={currentImage}
                  alt="product image"
                  height={400}
                  width={400}
                />
              </Zoom>
            ) : (
              <p>No image available</p>
            )}
            {singleProduct?.video && (
              <div className="absolute top-5 right-5">
                <button
                  onClick={() => setVideoModal(true)}
                  className="bg-primary text-white p-3 rounded-full animate-pulse"
                >
                  <FaPlay className="text-xl" />
                </button>
              </div>
            )}
            {variantImages?.length > 0 && (
              <div className="flex justify-center gap-2 mt-5">
                {variantImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`cursor-pointer border-2 rounded-xl ${
                      selectedImage === image
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`variant image ${index}`}
                      height={80}
                      width={80}
                      className="object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:w-1/2 flex flex-col gap-3">
            <h2 className="text-3xl lg:text-4xl font-bold">
              {singleProduct?.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-bold">Category:</span>
              <span>{singleProduct?.category?.name}</span>
            </div>
            {singleProduct?.brand && (
              <div className="flex items-center gap-2">
                <span className="font-bold">Brand:</span>
                <span>{singleProduct?.brand?.name}</span>
              </div>
            )}
            <div className="flex items-center mt-4 gap-4 font-bold">
              <Rate
                disabled
                value={singleProduct?.ratings?.average}
                allowHalf
              />
              ({singleProduct?.ratings?.count})
            </div>
            <div className="flex items-center gap-4 text-textColor font-bold my-2">
              Price:{" "}
              {singleProduct?.offerPrice ? (
                <p className="text-primary text-xl">
                  {globalData?.results?.currency +
                    " " +
                    singleProduct?.offerPrice}
                </p>
              ) : (
                <p className="text-primary text-xl">
                  {globalData?.results?.currency + " " + currentPrice}
                </p>
              )}
              {singleProduct?.offerPrice && (
                <p className="text-base line-through text-red-500">
                  {globalData?.results?.currency + " " + currentPrice}
                </p>
              )}
            </div>
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

            {!isOutOfStock ? (
              <>
                <div className="flex items-center justify-start w-[7.5rem] gap-3 border border-primary rounded-xl p-1.5 mt-5">
                  <button
                    className="cursor-pointer bg-primaryLight p-2 rounded text-xl text-primary"
                    onClick={() => handleCount("decrement")}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-base font-bold text-textColor">
                    {count}
                  </span>
                  <button
                    className="cursor-pointer bg-primaryLight p-2 rounded text-xl text-primary"
                    onClick={() => handleCount("increment")}
                  >
                    <FaPlus />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10">
                Out Of Stock
              </div>
            )}
            <div
              className="w-full bg-primary px-10 py-2 text-sm rounded-full shadow-xl mt-10 text-center text-white font-bold cursor-pointer"
              onClick={handleWhatsappClick}
            >
              <p>Click To Place a Order With Just a Phone Call</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <FaWhatsapp className="text-2xl" />
                <p>{businessWhatsapp}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <SingleProductCart
            item={currentVariant ?? singleProduct}
            count={count}
            productId={singleProduct?._id}
            productName={singleProduct?.name}
          />
        </div>
      </div>
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl bg-white flex flex-col items-center justify-center">
        <div className="bg-primary mb-10 px-10 py-2 text-white font-bold rounded-xl inline-block">
          Description
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
        ></div>
      </div>

      <Modal
        centered
        open={videoModal}
        onCancel={() => setVideoModal(false)}
        footer={null}
        width={800}
      >
        <div className="p-5">
          <video
            src={formatImagePath(singleProduct?.video)}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            autoPlay
            controls
            className="mx-auto lg:w-[680px] h-[400px]"
          >
            {" "}
            Your browser does not support the video tag.
          </video>
        </div>
      </Modal>
    </section>
  );
};

export default SinglePageCart;
