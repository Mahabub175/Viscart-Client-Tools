import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { Form } from "antd";

const CheckoutInfo = () => {
  const form = Form.useFormInstance();
  const paymentType = Form.useWatch("paymentType", form);

  return (
    <div>
      <CustomInput type="text" name="name" label="Name" required />
      <CustomInput type="email" name="email" label="Email" required />
      <CustomInput type="number" name="number" label="Number" required />
      <CustomInput type="textarea" name="address" label="Address" required />
      <CustomSelect
        name={"paymentType"}
        label={"Payment Type"}
        options={[
          { value: "manual", label: "Manual" },
          { value: "ssl", label: "SSL Commerz" },
        ]}
        required
      />

      {paymentType === "manual" && (
        <div>
          <CustomSelect
            name={"paymentMethod"}
            label={"Payment Method"}
            options={[
              { value: "bkash", label: "Bkash" },
              { value: "nagad", label: "Nagad" },
              { value: "rocket", label: "Rocket" },
              { value: "upay", label: "Upay" },
            ]}
            required
          />
          <CustomInput
            type="text"
            name="tranId"
            label="Transaction ID"
            required
          />
        </div>
      )}

      <SubmitButton fullWidth text="Checkout" />
    </div>
  );
};

export default CheckoutInfo;
