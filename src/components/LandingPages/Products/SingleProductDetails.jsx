"use client";

import { useEffect, useState } from "react";
import NewsletterBanner from "@/components/LandingPages/Home/NewsletterBanner";
import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import SmallFeature from "@/components/LandingPages/Home/SmallFeature";
import {
  useGetAllProductsQuery,
  useGetSingleProductBySlugQuery,
} from "@/redux/services/product/productApi";
import { Rate } from "antd";
import Image from "next/image";
import ProductCard from "../Home/Products/ProductCard";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const SingleProductDetails = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

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

  useEffect(() => {
    if (singleProduct?.variants) {
      setSelectedVariant(singleProduct?.variants[0]);
    }
  }, [singleProduct]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const currentPrice = selectedVariant
    ? selectedVariant.sellingPrice
    : singleProduct?.sellingPrice;

  return (
    <section className="my-container py-10">
      <div className="border-2 border-primary rounded-xl p-5 flex flex-col lg:flex-row items-center justify-center gap-10 mb-10 shadow-xl">
        <div className="bg-primaryLight p-10 rounded-xl">
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
        </div>
        <div className="lg:w-1/2 flex flex-col gap-3">
          <h2 className="text-3xl lg:text-5xl font-bold">
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
                <div className="flex items-center gap-2">
                  {singleProduct?.variants.map((variant) => (
                    <div
                      key={variant._id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`cursor-pointer size-10 rounded-full border-4 ${
                        selectedVariant?._id === variant._id
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      title={variant?.attributeCombination[0]?.label}
                      style={{
                        backgroundColor:
                          variant?.attributeCombination[0]?.label,
                      }}
                    >
                      {" "}
                      {variant?.attributeCombination[0]?.type === "other" && (
                        <span className="text-black flex items-center justify-center mt-1 font-bold">
                          {variant?.attributeCombination[0]?.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <ProductCountCart item={selectedVariant || singleProduct} fullWidth />
        </div>
      </div>
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl">
        <div className="bg-primary mb-10 px-10 py-2 text-white font-bold rounded-xl inline-block">
          Description
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
        ></div>
      </div>
      <div className="my-container bg-white shadow-xl p-5 rounded-xl mt-20">
        <ProductCard data={activeProducts} title={"Related Products"} />
      </div>
      <NewsletterBanner />
      <SmallFeature />
    </section>
  );
};

export default SingleProductDetails;
