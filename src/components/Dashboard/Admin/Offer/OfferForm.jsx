import CustomDatePicker from "@/components/Reusable/Form/CustomDatePicker";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";

const OfferForm = ({ attachment }) => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  return (
    <>
      <CustomInput label={"Name"} name={"name"} type={"text"} required={true} />
      <CustomInput
        label={"Description"}
        name={"description"}
        type={"textarea"}
        required={true}
      />
      <CustomSelect
        name={"product"}
        label={"Product"}
        options={activeProducts}
        mode={"multiple"}
        required={true}
      />
      <div className="two-grid">
        <CustomDatePicker
          name={"startDate"}
          label={"Start Date"}
          required={true}
        />
        <CustomDatePicker name={"endDate"} label={"End Date"} required={true} />
      </div>
      <CustomSelect
        name={"type"}
        label={"Offer Type"}
        options={[
          { value: "flash deal", label: "Flash Deal" },
          { value: "hot deal", label: "Hot Deal" },
          { value: "special offer", label: "Special Offer" },
        ]}
        required={true}
      />
      <FileUploader
        defaultValue={attachment}
        label="Offer Image"
        name="attachment"
        required={true}
      />
    </>
  );
};

export default OfferForm;
