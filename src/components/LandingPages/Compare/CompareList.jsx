"use client";

import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteCompareMutation,
  useGetSingleCompareByUserQuery,
} from "@/redux/services/compare/compareApi";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetSingleProductQuery } from "@/redux/services/product/productApi";
import { base_url_image } from "@/utilities/configs/base_api";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import { MdDelete } from "react-icons/md";
import { useDeviceId } from "@/redux/services/device/deviceSlice";

const CompareList = () => {
  const [productId, setProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data: globalData, isLoading: isGlobalDataLoading } =
    useGetAllGlobalSettingQuery();
  const { data: compareData, isLoading: isCompareDataLoading } =
    useGetSingleCompareByUserQuery(user?._id || deviceId);
  const { data: productData, isLoading: isProductDataLoading } =
    useGetSingleProductQuery(productId, {
      skip: !productId,
    });
  const [deleteCompare] = useDeleteCompareMutation();

  if (isGlobalDataLoading || isCompareDataLoading || isProductDataLoading) {
    return <div>Loading...</div>;
  }

  const showModal = (id) => {
    setProductId(id);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const formatImagePath = (imagePath) => {
    return imagePath?.replace(/\//g, "\\");
  };

  const handleDelete = (itemId) => {
    setItemId(itemId);
    setDeleteModalOpen(true);
  };

  return (
    <section className="my-container lg:my-32 bg-white p-5 rounded-xl">
      {compareData?.length === 0 || !compareData ? (
        <div className="flex items-center justify-center my-10">
          <h2 className="text-2xl font-bold text-black/80">
            Please add a product to compare to see them here
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-10 items-center">
          <div className="border rounded-xl p-5 mb-10 lg:mb-0">
            <p className="text-center font-bold text-xl border-b">Summary</p>
            <div className="space-y-8 mt-4 text-center lg:text-start">
              {compareData?.[0]?.product?.map((item) => (
                <div key={item?._id}>
                  <h2>{item?.name}</h2>
                  <div className="flex items-center gap-4 justify-center lg:justify-start">
                    {item?.offerPrice && (
                      <p className="text-base font-bold line-through text-red-500">
                        {globalData?.results?.currency +
                          " " +
                          item?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice ? (
                      <p className="text-primary text-xl font-bold">
                        {globalData?.results?.currency + " " + item?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary text-xl font-bold">
                        {globalData?.results?.currency +
                          " " +
                          item?.sellingPrice}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded-xl p-5 col-span-2">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 border-b pb-2">
              <div></div>
              <p className="text-center font-bold text-xl">Products</p>
              <div
                className="text-2xl cursor-pointer text-red-500"
                onClick={() => handleDelete(compareData[0]?._id)}
              >
                <MdDelete />
              </div>
            </div>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-center gap-10 max-w-[400px] mx-auto">
              {compareData?.[0]?.product?.map((item) => (
                <div key={item?._id}>
                  <div className="flex flex-col items-center gap-4 border rounded-xl p-5">
                    <Image
                      src={`${base_url_image}${
                        formatImagePath(item?.mainImage) || "placeholder.jpg"
                      }`}
                      alt={item?.product?.name || "Product Image"}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-xl border-2 border-primary"
                    />
                    <Link
                      href={`/products/${item?.slug}`}
                      className="text-sm font-normal hover:underline text-center"
                    >
                      {item?.name}
                    </Link>
                    <Button
                      htmlType="submit"
                      size="large"
                      type="primary"
                      icon={<FaCartShopping />}
                      onClick={() => showModal(item?._id)}
                      className={`bg-primary hover:bg-secondary font-bold px-10 `}
                    >
                      Add To Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <QuickProductView
        item={productData}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"compare product"}
        func={deleteCompare}
      />
    </section>
  );
};

export default CompareList;
