import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import { Radio, Form } from "antd";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const CheckoutInfo = () => {
  const form = Form.useFormInstance();
  const paymentType = Form.useWatch("paymentType", form);
  const paymentMethod = Form.useWatch("paymentMethod", form);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const paymentOptions = [
    { value: "manual", label: "Manual" },
    { value: "cod", label: "Cash on Delivery" },
    ...(globalData?.results?.ssl === "Active"
      ? [{ value: "ssl", label: "SSL Commerz" }]
      : []),
  ];

  return (
    <div>
      <CustomInput type="text" name="name" label="Name" required />
      <CustomInput type="number" name="number" label="Number" required />
      <CustomInput type="textarea" name="address" label="Address" required />

      <Form.Item name="paymentType" label="Payment Type" required>
        <Radio.Group>
          {paymentOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      {paymentType === "manual" && (
        <div>
          <Form.Item name="paymentMethod" label="Payment Method" required>
            <Radio.Group>
              <Radio value="bkash">Bkash</Radio>
              <Radio value="nagad">Nagad</Radio>
              <Radio value="rocket">Rocket</Radio>
              <Radio value="upay">Upay</Radio>
            </Radio.Group>
          </Form.Item>

          {paymentMethod && (
            <div className="mt-4">
              {paymentMethod === "bkash" && (
                <div className="mb-4">
                  <p>Bkash Information: Please send payment to 01XXXXXXXXX.</p>
                </div>
              )}
              {paymentMethod === "nagad" && (
                <div className="mb-4">
                  <p>Nagad Information: Please send payment to 01XXXXXXXXX.</p>
                </div>
              )}
              {paymentMethod === "rocket" && (
                <div className="mb-4">
                  <p>Rocket Information: Please send payment to 01XXXXXXXXX.</p>
                </div>
              )}
              {paymentMethod === "upay" && (
                <div className="mb-4">
                  <p>Upay Information: Please send payment to 01XXXXXXXXX.</p>
                </div>
              )}
              <CustomInput
                type="text"
                name="tranId"
                label="Transaction ID"
                required
              />
            </div>
          )}
        </div>
      )}

      {paymentType === "cod" && (
        <div className="mb-4 -mt-4">
          <p>
            Cash on Delivery Information: Please make sure to have the exact
            amount ready during delivery.
          </p>
        </div>
      )}

      {paymentType === "ssl" && (
        <div className="my-4">
          <p>
            SSL Commerz: You will be redirected to the SSL Commerz payment
            gateway.
          </p>
        </div>
      )}

      <SubmitButton fullWidth text="Order Now" />
    </div>
  );
};

export default CheckoutInfo;
