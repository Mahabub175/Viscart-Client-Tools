"use client";

import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteCompareMutation,
  useGetSingleCompareByUserQuery,
} from "@/redux/services/compare/compareApi";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetSingleProductQuery } from "@/redux/services/product/productApi";
import { Button, Rate } from "antd";
import Image from "next/image";
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { toast } from "sonner";
import LinkButton from "@/components/Shared/LinkButton";

const CompareList = () => {
  const [productId, setProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data: globalData, isLoading: isGlobalDataLoading } =
    useGetAllGlobalSettingQuery();
  const {
    data: compareData,
    isLoading: isCompareDataLoading,
    isError,
  } = useGetSingleCompareByUserQuery(user?._id ?? deviceId);
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

  const handleDelete = (itemId) => {
    deleteCompare(itemId);
    toast.success("Product deleted from compare list");
  };

  return (
    <section className="my-container text-white p-5 rounded-xl lg:mt-52 relative my-20">
      {compareData?.length === 0 || !compareData || isError ? (
        <div className="flex items-center justify-center my-5">
          <h2 className="lg:text-2xl font-bold text-black/80 text-center text-xl">
            Please add products to compare.
          </h2>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="text-2xl cursor-pointer text-red-500 absolute right-0 top-0 hover:scale-105 duration-300"
            onClick={() => handleDelete(compareData[0]?._id)}
          >
            <MdDelete />
          </div>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="p-4 text-left">
                  <span className="">Product Comparison</span>
                </th>
                {compareData?.[0]?.product?.map((item) => (
                  <th
                    key={item?._id}
                    className="border border-gray-300 p-4 text-center"
                  >
                    <Image
                      src={formatImagePath(item?.mainImage)}
                      alt={item?.name || "Product Image"}
                      width={200}
                      height={200}
                      className="mx-auto rounded-md mb-4"
                    />
                    <LinkButton href={`/products/${item?.slug}`}>
                      {item?.name}
                    </LinkButton>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4 font-bold">Model</td>
                {compareData?.[0]?.product?.map((item) => (
                  <td
                    key={item?._id}
                    className="border border-gray-300 p-4 text-center"
                  >
                    {item?.model || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-bold">
                  Category
                </td>
                {compareData?.[0]?.product?.map((item) => (
                  <td
                    key={item?._id}
                    className="border border-gray-300 p-4 text-center"
                  >
                    {item?.category?.name || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-bold">Brand</td>
                {compareData?.[0]?.product?.map((item) => (
                  <td
                    key={item?._id}
                    className="border border-gray-300 p-4 text-center"
                  >
                    {item?.brand?.name || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-bold">Price</td>
                {compareData?.[0]?.product?.map((item) => (
                  <td
                    key={item?._id}
                    className="border border-gray-300 p-4 text-center"
                  >
                    <span className="flex justify-center gap-4">
                      {item?.offerPrice && (
                        <p className="text-sm font-bold line-through text-red-500 ">
                          {globalData?.results?.currency +
                            " " +
                            item?.sellingPrice}
                        </p>
                      )}
                      {item?.offerPrice ? (
                        <p className="text-primaryLight font-bold">
                          {globalData?.results?.currency +
                            " " +
                            item?.offerPrice}
                        </p>
                      ) : (
                        <p className="text-primaryLight font-bold">
                          {globalData?.results?.currency +
                            " " +
                            item?.sellingPrice}
                        </p>
                      )}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-bold">Stock</td>
                {compareData?.[0]?.product?.map((item) => (
                  <td
                    key={item?._id}
                    className={`border border-gray-300 p-4 text-center ${
                      item?.stock > 0
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }`}
                  >
                    {item?.stock > 0 ? "In Stock" : "Out of Stock"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-bold">Rating</td>
                {compareData?.[0]?.product?.map((item) => (
                  <td
                    key={item?._id}
                    className="border border-gray-300 p-4 text-center"
                  >
                    <div className="flex justify-center items-center lg:gap-4 font-medium">
                      <Rate
                        disabled
                        value={item?.ratings?.average}
                        allowHalf
                        className="text-[10px] lg:text-base"
                      />
                      ({item?.ratings?.count})
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-bold"></td>
                {compareData?.[0]?.product?.map((item) => (
                  <td
                    key={item?._id}
                    className="border border-gray-300 p-4 text-center"
                  >
                    <Button
                      size="small"
                      type="primary"
                      icon={<FaCartShopping />}
                      onClick={() => showModal(item?._id)}
                      className="mb-2 lg:w-4/6 py-5 font-semibold"
                    >
                      Add to Cart
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <QuickProductView
        item={productData}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </section>
  );
};

export default CompareList;
