"use client";

import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteCartMutation,
  useGetSingleCartByUserQuery,
} from "@/redux/services/cart/cartApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import deleteImage from "@/assets/images/Trash-can.png";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import { useRouter } from "next/navigation";
import { useDeviceId } from "@/redux/services/device/deviceSlice";

const GlobalCart = () => {
  const router = useRouter();
  const deviceId = useSelector(useDeviceId);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  const user = useSelector(useCurrentUser);
  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);
  const [deleteCart] = useDeleteCartMutation();

  useEffect(() => {
    if (cartData) {
      setSubTotal(cartData?.reduce((acc, item) => acc + item.price, 0));
      setCounts(
        cartData?.reduce(
          (acc, item) => ({ ...acc, [item._id]: Number(item.quantity) || 1 }),
          {}
        )
      );
    }
  }, [cartData]);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleDelete = (itemId) => {
    setItemId(itemId);
    setDeleteModalOpen(true);
  };

  const handleRouting = () => {
    router.push("/cart");
    setIsCartOpen(false);
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        ></div>
      )}

      <div
        className={`fixed bottom-[30%] right-5 z-50 ${user ? "" : "hidden"}`}
      >
        <div
          onClick={toggleCart}
          className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl cursor-pointer animate-pulse"
        >
          <FaCartPlus />
        </div>

        {isCartOpen && (
          <div className="absolute bottom-20 lg:bottom-0 right-0 lg:right-20 w-[350px] p-4 bg-white shadow-lg rounded-lg text-black z-50">
            <div className="flex justify-between mb-5">
              <h3 className="font-bold text-lg">Cart Details</h3>
              <button
                className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
                onClick={toggleCart}
              >
                <RxCross1 className="text-xl text-gray-700" />
              </button>
            </div>
            <div>
              {cartData?.length === 0 || !cartData ? (
                <div className="flex items-center justify-center">
                  <h2 className="text-base text-center my-20 font-bold text-black/80">
                    Please add a product to cart to see them here
                  </h2>
                </div>
              ) : (
                <div>
                  <h2 className="font-normal text-xl mt-6">
                    {cartData?.length} Items
                  </h2>
                  <div className="flex flex-col lg:flex-row items-start gap-4 justify-between my-10">
                    <div className="border-2 border-primary rounded p-5 max-h-[300px] overflow-y-auto">
                      {cartData?.map((item) => (
                        <div
                          key={item?._id}
                          className="flex flex-col lg:flex-row items-center gap-4 justify-center first:mt-0 mt-10"
                        >
                          <div className="flex flex-[3] items-center gap-4">
                            <div>
                              <Link
                                href={`/products/${item?.product?.slug}`}
                                className="text-base font-normal hover:underline"
                              >
                                {item?.product?.name}
                              </Link>
                              <div className="mt-2 font-semibold">
                                Quantity: {counts[item._id]}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-1 items-center gap-4">
                            <p className="text-primary text-base font-bold">
                              $
                              {(item?.product?.offerPrice ||
                                item?.product?.sellingPrice) * counts[item._id]}
                            </p>
                          </div>
                          <div
                            onClick={() => handleDelete(item?._id)}
                            className="flex-1"
                          >
                            <Image
                              height={20}
                              width={20}
                              src={deleteImage}
                              alt="delete image"
                              className="size-5 mx-auto hover:cursor-pointer hover:scale-110 duration-500"
                            />
                          </div>
                        </div>
                      ))}
                      <hr className="border border-primary mt-4" />
                      <div className="grid grid-cols-3 mt-2">
                        <div></div>
                        <div className="font-bold text-primary flex items-center col-span-2 text-base">
                          Sub Total : {subTotal}
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              className="mt-4 w-full py-2 bg-primary text-white rounded-md"
              onClick={handleRouting}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"cart product"}
        func={deleteCart}
      />
    </>
  );
};

export default GlobalCart;
