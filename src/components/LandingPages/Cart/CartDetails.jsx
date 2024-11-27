"use client";

import deleteImage from "@/assets/images/Trash-can.png";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import {
  useGetSingleUserQuery,
  useLoginMutation,
  useSignUpMutation,
} from "@/redux/services/auth/authApi";
import { setUser, useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteCartMutation,
  useGetSingleCartByUserQuery,
} from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddOrderMutation } from "@/redux/services/order/orderApi";
import { base_url_image } from "@/utilities/configs/base_api";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CheckoutDetails from "./CheckoutDetails";
import CheckoutInfo from "./CheckoutInfo";

const CartDetails = () => {
  const router = useRouter();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(null);

  const { data: userData } = useGetSingleUserQuery(user?._id ?? userId);

  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);

  const [deleteCart] = useDeleteCartMutation();

  const [addOrder] = useAddOrderMutation();
  const [signUp] = useSignUpMutation();
  const [login] = useLoginMutation();

  const [itemId, setItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [code, setCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("insideDhaka");
  const [discount, setDiscount] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

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
  }, [cartData, userData]);

  const handleDelete = (itemId) => {
    setItemId(itemId);
    setDeleteModalOpen(true);
  };

  const formatImagePath = (imagePath) => imagePath?.replace(/\//g, "\\");

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Order...");

    if (!user) {
      const signUpData = {
        name: values?.name,
        number: values?.number,
        password: values?.number,
      };

      try {
        const res = await signUp(signUpData).unwrap();
        setUserId(res?.data?.number);
        const loginData = {
          emailNumber: values?.number,
          password: values?.number,
        };
        const loginRes = await login(loginData).unwrap();
        if (loginRes.success) {
          dispatch(
            setUser({ user: loginRes.data.user, token: loginRes.data.token })
          );
        }
      } catch (error) {
        if (error?.data?.errorMessage === "number already exists") {
          setUserId(values?.number);
        }
      }
    }

    setTimeout(async () => {
      try {
        const submittedData = {
          ...values,
          user: userData?._id,
          deviceId,
          products: cartData?.map((item) => ({
            product: item?.product?._id,
            quantity: item?.quantity,
          })),
          shippingFee,
          discount,
          deliveryOption,
          code,
          grandTotal,
          subTotal,
        };

        if (values.paymentType === "cod") {
          submittedData.paymentMethod = "cod";
        }

        const data = new FormData();
        appendToFormData(submittedData, data);

        try {
          const res = await addOrder(data);

          if (res?.error) {
            toast.error(res?.error?.data?.errorMessage, { id: toastId });
          } else if (res?.data?.success) {
            if (res?.data?.data?.gatewayUrl) {
              window.location.href = res?.data?.data?.gatewayUrl;
            }
            toast.success(res.data.message, { id: toastId });
            router.push("/success");
            window.location.reload();
          }
        } catch (error) {
          toast.error("Something went wrong while creating Order!", {
            id: toastId,
          });
          console.error("Error creating Order:", error);
        }
      } catch (error) {
        toast.error("Something went wrong while creating Order!", {
          id: toastId,
        });
        console.error("Error preparing Order data:", error);
      }
    }, 2000);
  };

  return (
    <section className="container mx-auto px-5 py-10 relative">
      <h2 className="font-normal text-2xl">My Cart</h2>
      <div>
        {cartData?.length === 0 || !cartData ? (
          <div className="flex items-center justify-center bg-white shadow-xl rounded-xl p-10 my-20">
            <h2 className="text-2xl font-bold text-black/80">
              Please add a product to cart to see them here
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="font-normal text-xl mt-6">
              {cartData?.length} Items
            </h2>
            <div className="flex flex-col lg:flex-row items-start gap-4 justify-between my-10">
              <div className="lg:w-3/6 border-2 border-primary rounded-lg p-5 lg:sticky top-10">
                {cartData?.map((item) => (
                  <div
                    key={item?._id}
                    className="flex flex-col lg:flex-row items-center gap-4 justify-center pb-5 mt-5 first:mt-0 border-b border-gray-300 last:border-b-0"
                  >
                    <div className="flex flex-[3] items-center gap-4">
                      <Image
                        src={`${base_url_image}${
                          formatImagePath(item?.product?.mainImage) ||
                          "placeholder.jpg"
                        }`}
                        alt={item?.product?.name || "Product Image"}
                        width={128}
                        height={128}
                        className="w-28 h-28 rounded-xl border-2 border-primary"
                      />
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
                      <p className="text-primary text-2xl font-bold">
                        $
                        {(item?.product?.offerPrice ||
                          item?.product?.sellingPrice) * counts[item._id]}
                      </p>
                    </div>
                    <div
                      onClick={() => handleDelete(item?._id)}
                      className="flex-1 "
                    >
                      <Image
                        height={20}
                        width={20}
                        src={deleteImage}
                        alt="delete image"
                        className="w-8 h-8 mx-auto hover:cursor-pointer hover:scale-110 duration-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <CheckoutDetails
                subTotal={subTotal}
                grandTotal={grandTotal}
                code={code}
                setCode={setCode}
                setDeliveryOption={setDeliveryOption}
                deliveryOption={deliveryOption}
                setDiscount={setDiscount}
                discount={discount}
                shippingFee={shippingFee}
                setShippingFee={setShippingFee}
                setGrandTotal={setGrandTotal}
              />
              <div className="lg:w-2/6 w-full border-2 border-primary rounded-lg p-5">
                <CustomForm onSubmit={onSubmit}>
                  <CheckoutInfo />
                </CustomForm>
              </div>
            </div>
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
    </section>
  );
};

export default CartDetails;
