import {
  useLoginMutation,
  useSignUpMutation,
} from "@/redux/services/auth/authApi";
import { setUser, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddOrderMutation } from "@/redux/services/order/orderApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const SingleProductCart = ({ item }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const [addOrder] = useAddOrderMutation();
  const [signUp] = useSignUpMutation();
  const [login] = useLoginMutation();

  // const onSubmit = async (values) => {
  //     const toastId = toast.loading("Creating Order...");
  //     let signUpResponse;

  //     try {
  //       if (!user) {
  //         const signUpData = {
  //           name: values?.name,
  //           number: values?.number,
  //           password: values?.number,
  //         };

  //         try {
  //           signUpResponse = await signUp(signUpData).unwrap();

  //           const loginData = {
  //             emailNumber: values?.number,
  //             password: values?.number,
  //           };

  //           const loginResponse = await login(loginData).unwrap();
  //           if (loginResponse.success) {
  //             dispatch(
  //               setUser({
  //                 user: loginResponse.data.user,
  //                 token: loginResponse.data.token,
  //               })
  //             );
  //           }
  //         } catch (error) {
  //           if (error?.data?.errorMessage === "number already exists") {
  //             toast.error("Number already exists");
  //           }
  //         }
  //       }

  //       setTimeout(async () => {
  //         try {
  //           const submittedData = {
  //             ...values,
  //             user: signUpResponse?.data?._id ?? user?._id,
  //             deviceId,
  //             products: cartData?.map((item) => ({
  //               product: item?.productId,
  //               productName:
  //                 item?.productName +
  //                 (item?.variant &&
  //                 item?.variant?.attributeCombination?.length > 0
  //                   ? ` (${item?.variant?.attributeCombination
  //                       ?.map((combination) => combination?.name)
  //                       .join(" ")})`
  //                   : ""),
  //               quantity: item?.quantity,
  //               sku: item?.sku,
  //             })),
  //             shippingFee,
  //             discount,
  //             deliveryOption,
  //             code,
  //             grandTotal,
  //             subTotal,
  //           };

  //           if (values.paymentType === "cod") {
  //             submittedData.paymentMethod = "cod";
  //           }

  //           const data = new FormData();
  //           appendToFormData(submittedData, data);

  //           try {
  //             const res = await addOrder(data);

  //             if (res?.error) {
  //               toast.error(res?.error?.data?.errorMessage, { id: toastId });
  //             } else if (res?.data?.success) {
  //               if (res?.data?.data?.gatewayUrl) {
  //                 window.location.href = res?.data?.data?.gatewayUrl;
  //               }
  //               toast.success(res.data.message, { id: toastId });
  //               router.push("/success");
  //             }
  //           } catch (error) {
  //             toast.error("Something went wrong while creating Order!", {
  //               id: toastId,
  //             });
  //             console.error("Error creating Order:", error);
  //           }
  //         } catch (error) {
  //           toast.error("Something went wrong while creating Order!", {
  //             id: toastId,
  //           });
  //           console.error("Error preparing Order data:", error);
  //         }
  //       }, 2000);
  //     } catch (error) {
  //       toast.error("Error in order creation process!");
  //     }
  //   };

  return <div></div>;
};

export default SingleProductCart;
