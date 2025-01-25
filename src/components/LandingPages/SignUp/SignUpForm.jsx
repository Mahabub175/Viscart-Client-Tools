"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import {
  useSendOtpMutation,
  useSignUpMutation,
} from "@/redux/services/auth/authApi";
import { Checkbox, Form, Modal, Input, Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { verifyToken } from "@/utilities/lib/verifyToken";

const SignUpForm = () => {
  const router = useRouter();

  const [signUp, { isLoading }] = useSignUpMutation();
  const [sendOtp, { isLoading: isOtpLoading }] = useSendOtpMutation();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const handleSignUp = async (values) => {
    if (!isOtpSent) {
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setFormValues(values);

      try {
        const response = await sendOtp({ number: values.number }).unwrap();
        if (response.success) {
          const decodedToken = verifyToken(response.data.otp);
          setOtp(decodedToken?.otp);
          toast.success("OTP sent successfully!");
          setIsOtpSent(true);
          setOtpModalVisible(true);
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        toast.error(
          error.data?.message || "Error sending OTP. Please try again."
        );
      }
    }
  };

  const verifyOtpAndSignUp = async (enteredOtp) => {
    if (enteredOtp === otp) {
      toast.success("OTP verified successfully!");
      const toastId = toast.loading("Signing Up...");

      try {
        const res = await signUp(formValues).unwrap();
        if (res.success) {
          toast.success("Signed Up Successfully!", { id: toastId });
          setOtpModalVisible(false);
          router.push("/sign-in");
        }
      } catch (error) {
        toast.error(error.data.errorMessage, { id: toastId });
      }
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="lg:w-[450px]">
      <CustomForm onSubmit={handleSignUp}>
        <div className="mt-4 mb-6">
          <CustomInput label={"Name"} name={"name"} type={"text"} />
          <CustomInput
            label={"Phone Number"}
            name={"number"}
            type={"number"}
            required={true}
          />
          <CustomInput
            label={"Password"}
            name={"password"}
            type={"password"}
            required={true}
          />
          <CustomInput
            label={"Confirm Password"}
            name={"confirmPassword"}
            type={"password"}
            required={true}
          />
          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Please Agree to the Terms & Policy",
              },
            ]}
          >
            <Checkbox>I agree to the terms & policy</Checkbox>
          </Form.Item>
        </div>

        <SubmitButton
          text={isOtpSent ? "Resend OTP" : "Send OTP"}
          loading={isLoading || isOtpLoading}
          fullWidth
        />
      </CustomForm>
      <div className="flex items-center my-6">
        <div className="border w-full h-0"></div>
        <span className="font-bold">Or</span>
        <div className="border w-full h-0"></div>
      </div>
      <div className="text-center">
        <span>Already have an account?</span>
        <Link href="/sign-in" className="font-bold text-primary text-lg">
          Sign in
        </Link>
      </div>

      <Modal
        title="Enter OTP"
        centered
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
      >
        <Input
          maxLength={4}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 4-digit OTP"
          style={{
            textAlign: "center",
            fontSize: "16px",
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <Button
          loading={isLoading}
          onClick={() => verifyOtpAndSignUp(otp)}
          className="w-full"
          type="primary"
        >
          Verify OTP
        </Button>
      </Modal>
    </div>
  );
};

export default SignUpForm;
