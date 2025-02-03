import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { Checkbox, Form } from "antd";

const SliderForm = ({ attachment }) => {
  const { data: categoriesData, isFetching: isCategoryFetching } =
    useGetAllCategoriesQuery();

  const categoryOptions = categoriesData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  return (
    <>
      <CustomSelect
        label="Category"
        name="category"
        options={categoryOptions}
        required
        loading={isCategoryFetching}
        disabled={isCategoryFetching}
      />
      <FileUploader
        defaultValue={attachment}
        label="Slider Image"
        name="attachment"
        required={true}
      />
      <Form.Item name={"bottomBanner"} valuePropName="checked">
        <Checkbox className="font-semibold">
          This Photo Will Be Show as Single Banner
        </Checkbox>
      </Form.Item>
    </>
  );
};

export default SliderForm;
