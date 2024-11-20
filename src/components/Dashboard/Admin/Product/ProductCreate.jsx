import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddProductMutation } from "@/redux/services/product/productApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { toast } from "sonner";
import ProductForm from "./ProductForm";
import { useCallback, useRef, useState } from "react";
import { Form } from "antd";
import CustomTextEditor from "@/components/Reusable/Form/CustomTextEditor";

const ProductCreate = ({ open, setOpen }) => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [content, setContent] = useState("");

  const variantProductRef = useRef(null);

  const handleVariantProduct = useCallback((submitFunction) => {
    variantProductRef.current = submitFunction;
  }, []);

  const onSubmit = async (values) => {
    const variantData = variantProductRef.current
      ? variantProductRef.current()
      : null;

    const toastId = toast.loading("Creating Product...");

    try {
      let submittedData = {
        ...values,
        ...(variantData?.selectedRowData && {
          variants: variantData.selectedRowData,
        }),
        description: content,
      };

      if (values?.mainImage) {
        submittedData.mainImage = await compressImage(
          values.mainImage[0].originFileObj
        );
      }

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addProduct(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Product:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Product">
      <CustomForm onSubmit={onSubmit}>
        <ProductForm handleVariantProduct={handleVariantProduct} />
        <Form.Item label={"Product Description"} name={"description"} required>
          <CustomTextEditor value={content} onChange={setContent} />
        </Form.Item>
        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default ProductCreate;
