import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import { Radio, Form } from "antd";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const CheckoutInfo = () => {
  const form = Form.useFormInstance();
  const selectedPayment = Form.useWatch("paymentMethod", form);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const paymentOptions = [
    {
      value: "bkash",
      label: "Bkash",
      info: "Bkash Information: Please send payment to 01XXXXXXXXX.",
    },
    {
      value: "nagad",
      label: "Nagad",
      info: "Nagad Information: Please send payment to 01XXXXXXXXX.",
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      info: "Cash on Delivery Information: Please make sure to have the exact amount ready during delivery.",
    },
    ...(globalData?.results?.ssl === "Active"
      ? [
          {
            value: "ssl",
            label: "SSL Commerz",
            info: "SSL Commerz: You will be redirected to the SSL Commerz payment gateway.",
          },
        ]
      : []),
  ];

  return (
    <div>
      <CustomInput type="text" name="name" label="Name" required />
      <CustomInput type="number" name="number" label="Number" required />
      <CustomInput type="textarea" name="address" label="Address" required />

      <Form.Item name="paymentMethod" label="Payment Method" required>
        <Radio.Group className="flex flex-col gap-2">
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

      <SubmitButton fullWidth text="Order Now" />
    </div>
  );
};

export default CheckoutInfo;
