"use client";

import { useState } from "react";
import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import {
  useGetAllProductsQuery,
  useGetSingleProductBySlugQuery,
} from "@/redux/services/product/productApi";
import { Modal, Rate } from "antd";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ProductCard from "../Home/Products/ProductCard";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Image from "next/image";
import { FaWhatsapp, FaPlay } from "react-icons/fa";

const SingleProductDetails = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

  const businessWhatsapp = globalData?.results?.businessWhatsapp;

  const handleWhatsappClick = () => {
    window.open(`https://wa.me/${businessWhatsapp}`, "_blank");
  };

  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter(
      (item) =>
        item?.status !== "Inactive" &&
        item?.name !== singleProduct?.name &&
        item?.category?.name === singleProduct?.category?.name
    )
    ?.slice(0, 4);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const [videoModal, setVideoModal] = useState(false);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const currentImage = selectedVariant?.images?.[0] ?? singleProduct?.mainImage;
  const currentPrice = selectedVariant
    ? selectedVariant.sellingPrice
    : singleProduct?.sellingPrice;

  return (
    <section className="my-container py-10">
      <div className="border-2 border-primary rounded-xl p-5 flex flex-col lg:flex-row items-center justify-center gap-10 mb-10 shadow-xl">
        <div className="bg-primaryLight p-10 rounded-xl relative">
          {currentImage ? (
            <Zoom>
              <Image
                src={
                  selectedVariant?.images?.[0] ??
                  singleProduct?.mainImage ??
                  "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                }
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
            <Rate disabled value={singleProduct?.ratings?.average} allowHalf />(
            {singleProduct?.ratings?.count})
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
          {singleProduct?.variants?.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-bold">Select Variant:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {singleProduct?.variants.map((variant) => (
                    <div
                      key={variant._id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`cursor-pointer size-10 rounded-full border-4 ${
                        selectedVariant?._id === variant._id
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      title={variant?.attributeCombination
                        ?.map((attribute) => attribute?.name)
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
          <ProductCountCart
            item={selectedVariant || singleProduct}
            fullWidth
            previousSelectedVariant={selectedVariant}
          />
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
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl bg-white flex flex-col items-center justify-center">
        <div className="bg-primary mb-10 px-10 py-2 text-white font-bold rounded-xl inline-block">
          Description
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
        ></div>
      </div>
      <div className="my-container mt-20">
        {activeProducts && activeProducts.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-5 border-b pb-2">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {activeProducts.map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </div>
          </>
        ) : (
          <div>
            <p className="text-center">
              No similar products available right now
            </p>
          </div>
        )}
      </div>

      <Modal
        centered
        open={videoModal}
        onCancel={() => setVideoModal(false)}
        footer={null}
        width={800}
      >
        <div className="p-5">
          <iframe
            src={singleProduct?.video}
            title={singleProduct?.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="mx-auto lg:w-[680px] h-[400px]"
          ></iframe>
        </div>
      </Modal>
    </section>
  );
};

export default SingleProductDetails;
