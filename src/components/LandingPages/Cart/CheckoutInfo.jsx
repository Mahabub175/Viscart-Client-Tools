import CustomInput from "@/components/Reusable/Form/CustomInput";
import { Radio, Form, Button } from "antd";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { FaCartShopping } from "react-icons/fa6";
import bkash from "@/assets/images/bkash.png";
import cod from "@/assets/images/cod.png";
import eft from "@/assets/images/bank.png";
import ssl from "@/assets/images/ssl.png";
import nagad from "@/assets/images/nagad.png";
import rocket from "@/assets/images/rocket.png";
import upay from "@/assets/images/upay.png";
import surecash from "@/assets/images/surecash.png";
import Image from "next/image";

const CheckoutInfo = ({ isLoading }) => {
  const form = Form.useFormInstance();
  const selectedPayment = Form.useWatch("paymentMethod", form);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const imageMap = {
    cod: cod,
    bkash: bkash,
    bank: eft,
    ssl: ssl,
    Nagad: nagad,
    Bkash: bkash,
    Rocket: rocket,
    Upay: upay,
    SureCash: surecash,
  };

  const manualPayments =
    Array.isArray(globalData?.results?.manualPayments) &&
    globalData.results.manualPayments.filter(
      (item) => item.status === "Active"
    );

  const paymentOptions = [
    {
      value: "cod",
      label: "Cash on Delivery",
      image: imageMap.cod,
      info: globalData?.results?.codMessage,
    },
    ...(globalData?.results?.bkash === "Active"
      ? [
          {
            value: "bkash",
            label: "BKash",
            image: imageMap.bkash,
            info: globalData?.results?.bkashMessage,
          },
        ]
      : []),
    ...(globalData?.results?.ssl === "Active"
      ? [
          {
            value: "ssl",
            label: "SSLCommerz",
            image: imageMap.ssl,
            info: "SSLCommerz: You will be redirected to the SSLCommerz payment gateway.",
          },
        ]
      : []),
    ...(manualPayments
      ? manualPayments.map((item) => ({
          value: "manual" + item.name,
          label: item.name,
          image: imageMap[item.name] || null,
          info: item.description,
          details: (
            <>
              <CustomInput
                type="text"
                name="tranId"
                label="Transaction ID"
                required
              />
              <CustomInput
                type="text"
                name="transaction Number"
                label="Sender Number"
              />
            </>
          ),
        }))
      : []),
    ...(globalData?.results?.bank === "Active"
      ? [
          {
            value: "bank",
            label: "EFT/RTGS",
            image: imageMap.bank,
            info: globalData?.results?.bankMessage,
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
                <div
                  className="mt-1 pl-6 text-sm text-primary font-semibold"
                  dangerouslySetInnerHTML={{ __html: option.info }}
                />
              )}
              {selectedPayment === "manual" + option.label && (
                <div className="mt-5 -mb-5 pl-5">
                  <CustomInput
                    type="text"
                    name="tranId"
                    label="Transaction ID"
                    required
                  />
                  <CustomInput
                    type="text"
                    name="transactionNumber"
                    label="Sender Number"
                  />
                </div>
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
