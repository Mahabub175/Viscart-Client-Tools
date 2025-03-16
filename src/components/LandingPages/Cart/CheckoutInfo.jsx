import CustomInput from "@/components/Reusable/Form/CustomInput";
import { Radio, Form, Button } from "antd";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { FaCartShopping } from "react-icons/fa6";
import bkash from "@/assets/images/bkash.png";
import cod from "@/assets/images/cod.png";
import eft from "@/assets/images/eft.png";
import ssl from "@/assets/images/ssl.png";
import Image from "next/image";

const CheckoutInfo = ({ isLoading }) => {
  const form = Form.useFormInstance();
  const selectedPayment = Form.useWatch("paymentMethod", form);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const paymentOptions = [
    {
      value: "cod",
      label: "Cash on Delivery",
      image: cod,
      info: globalData?.results?.codMessage,
    },
    {
      value: "bkash",
      label: "Bkash",
      image: bkash,
      info: globalData?.results?.bkashMessage,
    },
    ...(globalData?.results?.bank === "Active"
      ? [
          {
            value: "bank",
            label: "EFT/RTGS",
            image: eft,
            info: globalData?.results?.bankMessage,
          },
        ]
      : []),
    ...(globalData?.results?.ssl === "Active"
      ? [
          {
            value: "ssl",
            label: "SSLCommerz",
            image: ssl,
            info: "SSLCommerz: You will be redirected to the SSLCommerz payment gateway.",
          },
        ]
      : []),
  ];

  return (
    <div>
      <CustomInput type="text" name="name" label="Name" required />
      <CustomInput type="number" name="number" label="Number" required />
      <CustomInput type="textarea" name="address" label="Address" required />

      <Form.Item
        name="paymentMethod"
        label="Payment Method"
        required
        rules={[{ required: true, message: `Payment Method is required` }]}
      >
        <Radio.Group className="flex flex-col gap-4">
          {paymentOptions.map((option) => (
            <div key={option.value} className="flex flex-col">
              <Radio value={option.value}>
                <div className="font-semibold flex items-center gap-2 -my-3">
                  <span>{option.label}</span>
                  <Image
                    src={option.image}
                    alt={option.label}
                    width={50}
                    className="object-contain"
                  />
                </div>
              </Radio>
              {selectedPayment === option.value && (
                <p className="mt-1 pl-6 text-sm text-primary font-semibold">
                  {option.info}
                </p>
              )}
            </div>
          ))}
        </Radio.Group>
      </Form.Item>

      <Button
        htmlType="submit"
        size="large"
        icon={<FaCartShopping />}
        className={`bg-navyBlue text-white font-bold px-10 w-full`}
        loading={isLoading}
        disabled={isLoading}
      >
        Order Now
      </Button>
    </div>
  );
};

export default CheckoutInfo;
