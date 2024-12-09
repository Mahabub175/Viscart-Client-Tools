import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/services/product/productApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProductForm from "./ProductForm";
import { Form } from "antd";
import CustomTextEditor from "@/components/Reusable/Form/CustomTextEditor";
import { getUniqueAttributeIds } from "@/utilities/lib/variant";
import { formatImagePath } from "@/utilities/lib/formatImagePath";

const ProductEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);
  const [content, setContent] = useState("");

  const variantProductRef = useRef(null);

  const handleVariantProduct = useCallback((submitFunction) => {
    variantProductRef.current = submitFunction;
  }, []);

  const { data: productData, isFetching: isProductFetching } =
    useGetSingleProductQuery(itemId, {
      skip: !itemId,
    });

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const onSubmit = async (values) => {
    const variantData = variantProductRef.current
      ? variantProductRef.current()
      : null;

    const toastId = toast.loading("Updating Product...");
    try {
      const submittedData = {
        ...values,
        ...(variantData?.selectedRowData && {
          variants: variantData.selectedRowData,
        }),
        ...(content && { description: content }),
      };

      if (!values.mainImage[0]?.url) {
        submittedData.mainImage = await compressImage(
          values.mainImage[0].originFileObj
        );
      } else {
        delete submittedData.mainImage;
      }

      const updatedProductData = new FormData();
      appendToFormData(submittedData, updatedProductData);

      const updatedData = {
        id: itemId,
        data: updatedProductData,
      };

      const res = await updateProduct(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Product:", error);
      toast.error("An error occurred while updating the Product.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(productData, [
        {
          name: "brand",
          value: productData?.brand?._id,
          errors: "",
        },
        {
          name: "category",
          value: productData?.category?._id,
          errors: "",
        },
        {
          name: "tags",
          value: productData?.tags,
          errors: "",
        },
        {
          name: "attribute_ids",
          value: getUniqueAttributeIds(productData?.variants),
          errors: "",
        },
      ])
    );
    setContent(productData?.description);
  }, [productData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Product"
      placement={"left"}
      loading={isProductFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <ProductForm
          attachment={formatImagePath(productData?.mainImage)}
          handleVariantProduct={handleVariantProduct}
          data={productData}
          videoData={formatImagePath(productData?.video)}
        />

        <Form.Item label={"Product Description"} name={"description"}>
          <CustomTextEditor value={content} onChange={setContent} />
        </Form.Item>

        <CustomSelect
          name={"status"}
          label={"Status"}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default ProductEdit;
