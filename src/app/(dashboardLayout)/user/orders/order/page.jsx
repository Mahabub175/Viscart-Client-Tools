"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetOrdersByUserQuery } from "@/redux/services/order/orderApi";
import { useAddReviewMutation } from "@/redux/services/review/reviewApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Empty, Form, Input, Modal, Rate } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserOrders = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const user = useSelector(useCurrentUser);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [singleOrder, setSingleOrder] = useState({});
  const [search, setSearch] = useState("");

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const { data: userOrders, isFetching } = useGetOrdersByUserQuery({
    id: user?._id,
  });

  const [addReview, { isLoading: isReviewLoading }] = useAddReviewMutation();

  const handleReview = async (values) => {
    const toastId = toast.loading("Creating Review...");

    try {
      const submittedData = {
        ...values,
        user: user?._id,
        product: singleOrder?.products?.map((item) => item?.product?._id),
      };

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addReview(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setReviewModalOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while creating the review.", {
        id: toastId,
      });
      console.error("Error creating review:", error);
    }
  };

  const filteredData = userOrders?.results?.filter((item) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();

    return Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm)
    );
  });

  const handleOrderDetails = (item) => {
    setSingleOrder(item);
    setDetailsModalOpen(true);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="px-5">
      <div className="flex justify-between">
        <div></div>
        <Input
          suffix={<FaSearch />}
          placeholder="Search..."
          className="py-1.5 lg:w-1/4"
          size="large"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-10">
        {filteredData?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap gap-5">
            {filteredData?.map((item) => (
              <div
                key={item?._id}
                className="bg-white rounded-xl shadow-xl lg:w-[350px]"
                onClick={() => handleOrderDetails(item)}
              >
                <div className="bg-black/70 text-white rounded-t-xl">
                  <div className="p-3 flex justify-between items-center text-lg font-semibold">
                    <p>Order ID</p>
                    <p># {item?.orderId}</p>
                  </div>
                </div>
                <div className="">
                  <div className="p-3 lg:text-lg font-semibold space-y-4">
                    <div className="flex justify-between items-center">
                      <p>Order Date:</p>
                      <p>{dayjs(item?.createdAt).format("MMMM DD, YYYY")}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>Delivery Status:</p>
                      <p>{item?.deliveryStatus}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>Payment Method:</p>
                      <p>{item?.paymentMethod.toUpperCase()}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p>Grand Total:</p>
                      <p>
                        {globalData?.results?.currency + " " + item?.grandTotal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No orders found" />
        )}
      </div>

      <Modal
        open={detailsModalOpen}
        onCancel={() => setDetailsModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
      >
        <div>
          <h3 className="text-lg font-semibold">Order Details</h3>
          <div className="mt-4">
            <div className="bg-black/70 text-white">
              <div className="p-3">
                <div className="flex gap-2 items-center text-lg font-semibold mb-1">
                  <p>Order ID: </p>
                  <p># {singleOrder?.orderId}</p>
                </div>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {dayjs(singleOrder?.createdAt).format(
                    "MMMM DD, YYYY hh:MM A"
                  )}
                </p>
              </div>
            </div>

            <p className="bg-grey p-3 mt-2">
              <strong>Delivery Status:</strong>{" "}
              {singleOrder?.deliveryStatus?.toUpperCase()}
            </p>
            <p className="bg-grey p-3 mt-2">
              <strong>Payment Status:</strong> {singleOrder?.paymentStatus}
            </p>
            <p className="bg-grey p-3 mt-2">
              <strong>Payment Method:</strong>{" "}
              {singleOrder?.paymentMethod?.toUpperCase()}
            </p>
            <p className="bg-grey p-3 mt-2">
              <strong>Name:</strong> {singleOrder?.name}
            </p>
            <p className="bg-grey p-3 mt-2">
              <strong>Address:</strong> {singleOrder?.address}
            </p>
            <p className="bg-grey p-3 mt-2">
              <strong>Number:</strong> {singleOrder?.number}
            </p>
            <p className="bg-grey p-3 mt-2">
              <strong>Subtotal:</strong> {globalData?.results?.currency}{" "}
              {singleOrder?.subTotal}
            </p>
            <p className="bg-grey p-3 mt-2">
              <strong>Shipping Fee (Per KG):</strong>{" "}
              {globalData?.results?.currency} {singleOrder?.shippingFee}
            </p>
            {singleOrder?.extraFee && (
              <p className="bg-grey p-3 mt-2">
                <strong>Shipping Fee (Extra KG):</strong>{" "}
                {globalData?.results?.currency} {singleOrder?.extraFee}
              </p>
            )}
            {singleOrder?.discount && (
              <p className="bg-grey p-3 mt-2">
                <strong>Discount:</strong> {globalData?.results?.currency}{" "}
                {singleOrder?.discount}
              </p>
            )}
            <p className="bg-grey p-3 mt-2">
              <strong>Grand Total:</strong> {globalData?.results?.currency}{" "}
              {singleOrder?.grandTotal}
            </p>

            <p className="p-3 mt-2 text-lg">
              <strong>Item Details</strong>
            </p>
            <div className="bg-white shadow-xl p-3 mt-2">
              <div>
                {singleOrder?.products?.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between gap-5">
                      <Image
                        src={formatImagePath(item?.product?.mainImage)}
                        alt={item?.productName}
                        width={100}
                        height={100}
                      />
                      <div>
                        <Link href={`/products/${item?.product?.slug}`}>
                          {item?.productName}
                        </Link>
                        <p className="mt-2">
                          <strong>Price:</strong>{" "}
                          {globalData?.results?.currency}{" "}
                          {item?.product?.offerPrice ??
                            item?.product?.sellingPrice}
                        </p>
                      </div>
                      <p className="bg-black text-white px-3">
                        x{item?.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 text-right">
            <button
              className="text-blue-500 border-2 border-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white duration-300"
              onClick={() => setReviewModalOpen(true)}
            >
              Leave a Review
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
      >
        <CustomForm onSubmit={handleReview}>
          <CustomInput
            type={"textarea"}
            name={"comment"}
            label={"Review"}
            required
          />
          <Form.Item name={"rating"} label={"Rating"} required>
            <Rate />
          </Form.Item>
          <SubmitButton
            fullWidth
            text={"Add Review"}
            loading={isReviewLoading}
          />
        </CustomForm>
      </Modal>
    </div>
  );
};

export default UserOrders;
