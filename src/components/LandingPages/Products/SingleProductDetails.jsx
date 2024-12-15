"use client";

import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import {
  useGetAllProductsQuery,
  useGetSingleProductBySlugQuery,
} from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Modal, Rate } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay, FaWhatsapp } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ProductCard from "../Home/Products/ProductCard";
import AttributeOptionSelector from "@/components/Shared/Product/AttributeOptionSelector";

const SingleProductDetails = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

  const pathname = usePathname();

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
    ?.slice(0, 8);

  const [videoModal, setVideoModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const groupedAttributes = singleProduct?.variants?.reduce((acc, variant) => {
    variant.attributeCombination.forEach((attribute) => {
      const attributeName = attribute.attribute.name;
      if (!acc[attributeName]) {
        acc[attributeName] = [];
      }
      if (!acc[attributeName].some((opt) => opt.name === attribute.name)) {
        acc[attributeName].push({
          name: attribute.name,
          label: attribute.label || attribute.name,
          _id: attribute._id,
        });
      }
    });
    return acc;
  }, {});

  const handleAttributeSelect = (attributeName, option) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setCurrentVariant(null);
    } else {
      const updatedVariant = singleProduct?.variants.find((variant) =>
        Object.entries(selectedAttributes).every(
          ([attrName, selectedValue]) => {
            return variant.attributeCombination.some(
              (attr) =>
                attr.attribute.name === attrName && attr.name === selectedValue
            );
          }
        )
      );
      setCurrentVariant(updatedVariant);
    }
  }, [selectedAttributes, singleProduct?.variants]);

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

  const variantImages = singleProduct?.variants
    ?.filter((variant) => variant.image)
    ?.map((variant) => formatImagePath(variant.image));

  return (
    <section className="container mx-auto lg:px-5 lg:py-10">
      <div className="border-2 border-primary rounded-xl p-5 flex flex-col lg:flex-row items-center justify-center gap-10 mb-10 shadow-xl">
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
          <AttributeOptionSelector
            groupedAttributes={groupedAttributes}
            selectedAttributes={selectedAttributes}
            handleAttributeSelect={handleAttributeSelect}
            item={singleProduct}
          />
          <ProductCountCart
            item={singleProduct}
            previousSelectedVariant={currentVariant}
            setPreviousSelectedVariant={setCurrentVariant}
            fullWidth
            selectedPreviousAttributes={selectedAttributes}
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
      <div className="mt-20">
        {activeProducts && activeProducts.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-5 border-b pb-2">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
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

export default SingleProductDetails;
