"use client";

import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import {
  useGetAllProductsQuery,
  useGetSingleProductBySlugQuery,
} from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import "react-medium-image-zoom/dist/styles.css";
import ProductCard from "../Home/Products/ProductCard";
import AttributeOptionSelector from "@/components/Shared/Product/AttributeOptionSelector";
import Link from "next/link";
import AddToCompare from "./AddToCompare";
import ProductBreadCrumb from "./ProductBreadCrumb";
import ProductReview from "./ProductReview";
import ProductDetailsSlider from "./ProductDetailsSlider";
import { sendGTMEvent } from "@next/third-parties/google";

const SingleProductDetails = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct, isFetching } = useGetSingleProductBySlugQuery(
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
    ?.slice(0, 8);

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [variantMedia, setVariantMedia] = useState([]);

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
    sendGTMEvent({ event: "singleProductView", value: singleProduct?.slug });
    if (Object.keys(selectedAttributes).length === 0) {
      setCurrentVariant(null);
      setVariantMedia([]);
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

      if (updatedVariant?.images) {
        setVariantMedia(
          updatedVariant.images.map((image) => formatImagePath(image))
        );
      } else {
        setVariantMedia([]);
      }
    }
  }, [selectedAttributes, singleProduct]);

  const currentPrice = currentVariant
    ? currentVariant?.sellingPrice
    : singleProduct?.offerPrice && singleProduct?.offerPrice > 0
    ? singleProduct?.offerPrice
    : singleProduct?.sellingPrice;

  const allMedia =
    variantMedia.length > 0
      ? [...variantMedia].filter(Boolean)
      : [
          singleProduct?.mainImage
            ? formatImagePath(singleProduct.mainImage)
            : null,
          ...(Array.isArray(singleProduct?.images)
            ? singleProduct.images.map((image) =>
                image ? formatImagePath(image) : null
              )
            : []),
          ...(Array.isArray(singleProduct?.variants)
            ? singleProduct.variants.flatMap((variant) =>
                Array.isArray(variant.images)
                  ? variant.images.map((image) =>
                      image ? formatImagePath(image) : null
                    )
                  : []
              )
            : []),
        ].filter(Boolean);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="py-10 -mt-10">
      <div className="">
        <div className="flex items-center justify-between my-container pt-5">
          <div className="lg:mt-5 lg:-mb-5">
            <ProductBreadCrumb params={params} />
          </div>
          <div></div>
        </div>
        <div className="p-5 flex flex-col lg:flex-row items-center justify-center gap-10 mb-10 my-container mt-5">
          <ProductDetailsSlider allMedia={allMedia} />

          <div className="lg:w-1/2 flex flex-col text-sm lg:text-base">
            <h2 className="text-xl md:text-3xl font-medium mb-2">
              {singleProduct?.name}
            </h2>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Category:</span>
              <span>{singleProduct?.category?.name}</span>
            </div>
            {singleProduct?.brand && (
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Brand:</span>
                <span>{singleProduct?.brand?.name}</span>
              </div>
            )}
            {singleProduct?.productModel && (
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Model:</span>
                <span>{singleProduct?.productModel}</span>
              </div>
            )}
            {singleProduct?.weight && (
              <div className="font-medium">
                Weight: {singleProduct?.weight} KG
              </div>
            )}
            <div className="flex items-center mt-4 gap-4 font-medium">
              <Rate
                disabled
                value={singleProduct?.ratings?.average}
                allowHalf
              />
              ({singleProduct?.ratings?.count})
            </div>
            <div className="flex items-center gap-4 font-medium my-2">
              Price:{" "}
              {singleProduct?.offerPrice && (
                <p className="text-base line-through text-red-500">
                  {globalData?.results?.currency +
                    " " +
                    singleProduct?.sellingPrice}
                </p>
              )}
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
              className="w-full bg-green-500 px-10 py-2 text-xs lg:text-sm rounded-full shadow mt-10 text-center text-white font-bold cursor-pointer"
              onClick={handleWhatsappClick}
            >
              <p>Call Or Live Chat To Order</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <FaWhatsapp className="text-2xl" />
                <p>{businessWhatsapp}</p>
              </div>
            </div>

            <div className="py-5 border-y mt-5">
              <AddToCompare item={singleProduct} />
            </div>
          </div>
        </div>
      </div>
      <div className="my-container">
        <div className="rounded-xl p-5 mb-10 shadow bg-white/80 border">
          <div className="bg-primary mb-5 px-10 py-2 text-white font-bold rounded-xl inline-block">
            Description
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
          ></div>
          {singleProduct?.video && (
            <div>
              <iframe
                width="100%"
                height="500"
                src={singleProduct?.video}
                title="video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-fit lg:h-[500px]"
              />
            </div>
          )}
        </div>
        <div className="rounded-xl p-5 mb-10 shadow bg-white/80 border">
          <div className="bg-primary px-10 py-2 text-white font-bold rounded-xl inline-block">
            Reviews
          </div>
          <ProductReview productId={singleProduct?._id} />
        </div>
        <div className="mt-20">
          {activeProducts && activeProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
                  Related Products
                </h2>
                <Link
                  href={`/products?filter=${singleProduct?.category?.names}`}
                  className="text-primary border-b border-primary font-semibold"
                >
                  Show All
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center gap-5">
                {activeProducts.map((product) => (
                  <ProductCard key={product._id} item={product} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default SingleProductDetails;
