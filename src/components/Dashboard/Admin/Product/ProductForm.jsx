import CustomButtonInput from "@/components/Reusable/Form/CustomButtonInput";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { Checkbox, Form } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { VariantComponent } from "./VariantComponent";

const ProductForm = ({ attachment, handleVariantProduct, data }) => {
  const form = Form.useFormInstance();

  const isVariant = Form.useWatch("isVariant", form);

  const { data: brandData, isFetching: isBrandFetching } =
    useGetAllBrandsQuery();

  const brandOptions = brandData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const { data: categoryData, isFetching: isCategoryFetching } =
    useGetAllCategoriesQuery();

  const categoryOptions = categoryData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name + " " + `(${item?.level.toUpperCase()})`,
    }));

  const generateRandomCode = () => {
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    return `${randomNumbers}`;
  };

  const generate = () => {
    const randomCode = generateRandomCode();
    form.setFieldsValue({ sku: randomCode });
  };

  return (
    <>
      <div className="three-grid">
        <div className="col-span-2">
          <CustomInput
            label={"Product Name"}
            name={"name"}
            type={"text"}
            required={true}
          />
        </div>
        <CustomButtonInput
          label="SKU Code"
          type={"text"}
          required={true}
          name={"sku"}
          placeholder={"Generate SKU Code"}
          onClick={generate}
          icon={<RiRefreshLine className="text-xl" />}
        />
      </div>
      <div className="two-grid">
        <CustomSelect
          label={"Product Brand"}
          name={"brand"}
          options={brandOptions}
          loading={isBrandFetching}
          disabled={isBrandFetching}
        />
        <CustomSelect
          label={"Product Category"}
          name={"category"}
          options={categoryOptions}
          required={true}
          loading={isCategoryFetching}
          disabled={isCategoryFetching}
        />
      </div>
      <CustomSelect label={"Product Tags"} name={"tags"} mode={"tags"} />
      <div className="two-grid">
        <CustomInput
          label={"Product Buying Price"}
          name={"buyingPrice"}
          type={"number"}
          required={true}
        />
        <CustomInput
          label={"Product Selling Price"}
          name={"sellingPrice"}
          type={"number"}
          required={true}
        />
        <CustomInput
          label={"Product Offer Price"}
          name={"offerPrice"}
          type={"number"}
          required={false}
        />
        <CustomInput
          label={"Product Stock Amount"}
          name={"stock"}
          type={"number"}
          required={true}
        />
      </div>

      <FileUploader
        defaultValue={attachment}
        label="Product Main Image"
        name="mainImage"
        required={true}
      />

      <Form.Item name={"isVariant"} valuePropName="checked">
        <Checkbox className="font-semibold">
          This Product Has Variations
        </Checkbox>
      </Form.Item>

      {isVariant && (
        <VariantComponent onCustomSubmit={handleVariantProduct} data={data} />
      )}

      <Form.Item name={"isFeatured"} valuePropName="checked">
        <Checkbox className="font-semibold">This Product Is Featured</Checkbox>
      </Form.Item>
    </>
  );
};

export default ProductForm;
