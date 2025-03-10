import CustomInput from "@/components/Reusable/Form/CustomInput";
import { Radio, Form, Button } from "antd";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { FaCartShopping } from "react-icons/fa6";

const CheckoutInfo = () => {
  const form = Form.useFormInstance();
  const selectedPayment = Form.useWatch("paymentMethod", form);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const paymentOptions = [
    {
      value: "bkash",
      label: "Bkash",
      info: globalData?.results?.bkashMessage,
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      info: globalData?.results?.codMessage,
    },
    ...(globalData?.results?.bank === "Active"
      ? [
          {
            value: "bank",
            label: "EFT/RTGS",
            info: globalData?.results?.bankMessage,
          },
        ]
      : []),
    ...(globalData?.results?.ssl === "Active"
      ? [
          {
            value: "ssl",
            label: "SSLCommerz",
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
              <Radio value={option.value}>{option.label}</Radio>
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
      >
        Order Now
      </Button>
    </div>
  );
};

export default CheckoutInfo;
