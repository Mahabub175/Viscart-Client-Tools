"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import {
  useGetAllGlobalSettingQuery,
  useUpdateGlobalSettingMutation,
} from "@/redux/services/globalSetting/globalSettingApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { Divider, Form } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const DynamicEditor = dynamic(
  () => import("@/components/Reusable/Form/CustomTextEditor"),
  {
    ssr: false,
  }
);

const AdminAccountSetting = () => {
  const [fields, setFields] = useState([]);
  const { data } = useGetAllGlobalSettingQuery();

  const [updateGlobalSetting, { isLoading }] = useUpdateGlobalSettingMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Global Setting...");
    try {
      const submittedData = {
        ...values,
      };

      if (typeof values?.primaryColor === "object") {
        submittedData.primaryColor = values?.primaryColor?.toHexString();
      }
      if (typeof values?.secondaryColor === "object") {
        submittedData.secondaryColor = values?.secondaryColor?.toHexString();
      }

      if (!values.logo[0].url) {
        submittedData.logo = await compressImage(values.logo[0].originFileObj);
      }
      if (!values.favicon[0].url) {
        submittedData.favicon = await compressImage(
          values.favicon[0].originFileObj
        );
      }
      const updatedUserData = new FormData();
      appendToFormData(submittedData, updatedUserData);

      const updatedData = {
        id: data?.results?._id,
        data: updatedUserData,
      };

      const res = await updateGlobalSetting(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
      } else {
        toast.error(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating global setting:", error);
      toast.error("An error occurred while updating the global setting.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(data?.results));
  }, [data]);

  return (
    <section className="w-4/6 mx-auto">
      <Divider orientation="left" orientationMargin={0}>
        Global Settings
      </Divider>
      <CustomForm fields={fields} onSubmit={onSubmit}>
        <CustomInput name={"name"} label={"Website Name"} required={true} />
        <CustomInput
          name={"description"}
          type={"textarea"}
          label={"Website Description"}
        />
        <CustomInput name={"announcement"} label={"Website Announcement"} />
        <FileUploader
          defaultValue={data?.results?.logo}
          label="Website Logo"
          name="logo"
          required={true}
        />
        <FileUploader
          defaultValue={data?.results?.favicon}
          label="Website Favicon"
          name="favicon"
          required={true}
        />
        <div className="two-grid">
          <CustomInput
            name={"deliveryChargeInsideDhaka"}
            label={"Delivery Charge Inside Dhaka"}
            type={"number"}
          />
          <CustomInput
            name={"deliveryChargeOutsideDhaka"}
            label={"Delivery Charge Outside Dhaka"}
            type={"number"}
          />
          <CustomInput
            name={"pricePerWeight"}
            label={"Extra Price Per Weight"}
            type={"number"}
          />
          {/* <CustomInput
            name={"deliveryApiKey"}
            label={"Delivery API Key"}
            type={"password"}
          />
          <CustomInput
            name={"deliverySecretKey"}
            label={"Delivery Secret Key"}
            type={"password"}
          /> */}
          <CustomInput
            name={"businessNumber"}
            label={"Business Number"}
            type={"number"}
          />
          <CustomInput name={"businessAddress"} label={"Business Address"} />
          <CustomInput name={"businessLocation"} label={"Business Location"} />
          <CustomInput name={"businessSlogan"} label={"Business Slogan"} />
          <CustomInput name={"complaintLink"} label={"Complaint From Link"} />
          <CustomInput
            name={"businessFacebook"}
            label={"Business Facebook URL"}
          />
          <CustomInput
            name={"messengerUsername"}
            label={"Messenger Username"}
          />
          <CustomInput
            name={"businessTwitter"}
            label={"Business Twitter URL"}
          />
          <CustomInput
            name={"businessInstagram"}
            label={"Business Instagram URL"}
          />
          <CustomInput
            name={"businessLinkedin"}
            label={"Business Linkedin URL"}
          />
          <CustomInput
            name={"businessYoutube"}
            label={"Business Youtube URL"}
          />
          <CustomInput name={"businessEmail"} label={"Business Email"} />
          <CustomInput
            name={"businessWhatsapp"}
            label={"Business Whatsapp Number"}
            type={"number"}
          />
          <CustomInput
            name={"businessWorkHours"}
            label={"Business Work Hours"}
          />
          <CustomInput
            name={"bkashMessage"}
            type={"textarea"}
            label={"Business Bkash Message"}
          />
          <CustomInput
            name={"codMessage"}
            type={"textarea"}
            label={"Business COD Message"}
          />
          <CustomSelect
            name={"bank"}
            label={"Bank Status"}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
          <CustomInput
            name={"bankMessage"}
            type={"textarea"}
            label={"Business Bank Message"}
          />

          <CustomSelect
            name={"ssl"}
            label={"SSL Status"}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
          {/* <Form.Item
            name="primaryColor"
            label="Website Primary Color"
            required={true}
          >
            <ColorPicker showText />
          </Form.Item>
          <Form.Item
            name="secondaryColor"
            label="Website Secondary Color"
            required={true}
          >
            <ColorPicker showText />
          </Form.Item> */}
        </div>
        <Form.Item label={"About Us"} name={"aboutUs"} required>
          <DynamicEditor />
        </Form.Item>
        <Form.Item
          label={"Terms & Condition"}
          name={"termsAndConditions"}
          required
        >
          <DynamicEditor />
        </Form.Item>
        <Form.Item label={"Privacy Policy"} name={"privacyPolicy"}>
          <DynamicEditor />
        </Form.Item>
        <Form.Item label={"Delivery Policy"} name={"delivery"}>
          <DynamicEditor />
        </Form.Item>
        <Form.Item label={"Pickup Point"} name={"pickupPoint"}>
          <DynamicEditor />
        </Form.Item>
        <Form.Item label={"Payment Terms"} name={"paymentTerms"}>
          <DynamicEditor />
        </Form.Item>
        <Form.Item label={"EMI Information"} name={"emiInformation"}>
          <DynamicEditor />
        </Form.Item>
        <Form.Item label={"Warranty Terms"} name={"warrantyTerms"}>
          <DynamicEditor />
        </Form.Item>
        <Form.Item label={"Refund & Return"} name={"refundAndReturn"}>
          <DynamicEditor />
        </Form.Item>

        <div className="flex justify-center my-10">
          <SubmitButton text={"Save"} loading={isLoading} fullWidth={true} />
        </div>
      </CustomForm>
    </section>
  );
};

export default AdminAccountSetting;
