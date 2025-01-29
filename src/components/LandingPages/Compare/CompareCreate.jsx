import { useState, useRef } from "react";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCompareMutation } from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Input, Button, List, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const { Title } = Typography;

const CompareCreate = () => {
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data: productData } = useGetAllProductsQuery();
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const [selectedProducts, setSelectedProducts] = useState([null, null]);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [addCompare] = useAddCompareMutation();
  const searchBar1Ref = useRef(null);
  const searchBar2Ref = useRef(null);

  const handleSearch1 = (query) => {
    setSearchQuery1(query);
  };

  const handleSearch2 = (query) => {
    setSearchQuery2(query);
  };

  const filteredProducts1 = activeProducts?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery1.toLowerCase()) &&
      product._id !== selectedProducts[1]?._id
  );

  const filteredProducts2 = activeProducts?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery2.toLowerCase()) &&
      product._id !== selectedProducts[0]?._id
  );

  const handleProductSelect1 = (product) => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[0] = product;
      return newSelectedProducts;
    });
    setSearchQuery1("");
  };

  const handleProductSelect2 = (product) => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[1] = product;
      return newSelectedProducts;
    });
    setSearchQuery2("");
  };

  const addToCompare = async () => {
    if (selectedProducts.filter((product) => product !== null).length !== 2) {
      toast.error("Please select exactly two products to compare.");
      return;
    }

    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: selectedProducts.map((product) => product?._id).filter(Boolean),
    };

    const toastId = toast.loading("Adding to Compare...");

    try {
      const res = await addCompare(data);
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to Compare:", error);
      toast.error("Failed to add item to Compare.", { id: toastId });
    }
  };

  const handleClear1 = () => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[0] = null;
      setSearchQuery1("");
      return newSelectedProducts;
    });
  };

  const handleClear2 = () => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[1] = null;
      setSearchQuery2("");
      return newSelectedProducts;
    });
  };

  return (
    <div className="lg:w-[600px] mx-auto p-4 bg-white rounded-xl shadow-lg">
      <Title level={2} className="text-center text-primary">
        Select Products to Compare
      </Title>

      <div className="relative mb-4 mt-10" ref={searchBar1Ref}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search and Select Product"
          value={selectedProducts[0]?.name || searchQuery1}
          onChange={(e) => handleSearch1(e.target.value)}
          className="rounded-md"
          allowClear
          size="large"
          onClear={handleClear1}
        />
        {searchQuery1 && (
          <List
            dataSource={filteredProducts1}
            renderItem={(product) => (
              <List.Item
                key={product._id}
                className="cursor-pointer hover:bg-gray-100 rounded-md border-b border-b-gray-20"
                onClick={() => handleProductSelect1(product)}
              >
                <div className="flex items-center gap-4 hover:text-primary duration-300 p-2">
                  <Image
                    src={formatImagePath(product?.mainImage)}
                    alt="product"
                    width={80}
                    height={50}
                    className="object-cover rounded-xl"
                  />
                  <div>
                    <p className="text-lg font-medium">{product?.name}</p>
                    <p className="flex items-center gap-4">
                      Price:{" "}
                      {product?.offerPrice && (
                        <span className="text-xs line-through text-red-500">
                          {globalData?.results?.currency +
                            " " +
                            product?.sellingPrice}
                        </span>
                      )}
                      <span className="text-xs lg:text-sm">
                        {globalData?.results?.currency +
                          " " +
                          (product?.offerPrice || product?.sellingPrice)}
                      </span>
                    </p>
                    <p>Category: {product?.category?.name}</p>
                  </div>
                </div>
              </List.Item>
            )}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              maxHeight: "200px",
              overflowY: "scroll",
              backgroundColor: "white",
              zIndex: 10,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </div>

      <div className="relative mb-4" ref={searchBar2Ref}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search and Select Product"
          value={selectedProducts[1]?.name || searchQuery2}
          onChange={(e) => handleSearch2(e.target.value)}
          className="rounded-md"
          allowClear
          size="large"
          onClear={handleClear2}
        />
        {searchQuery2 && (
          <List
            dataSource={filteredProducts2}
            renderItem={(product) => (
              <List.Item
                key={product._id}
                className="cursor-pointer hover:bg-gray-100 rounded-md border-b border-b-gray-20"
                onClick={() => handleProductSelect2(product)}
              >
                <div className="flex items-center gap-4 hover:text-primary duration-300 p-2">
                  <Image
                    src={formatImagePath(product?.mainImage)}
                    alt="product"
                    width={80}
                    height={50}
                    className="object-cover rounded-xl"
                  />
                  <div>
                    <p className="text-lg font-medium">{product?.name}</p>
                    <p className="flex items-center gap-4">
                      Price:{" "}
                      {product?.offerPrice && (
                        <span className="text-xs line-through text-red-500">
                          {globalData?.results?.currency +
                            " " +
                            product?.sellingPrice}
                        </span>
                      )}
                      <span className="text-xs lg:text-sm">
                        {globalData?.results?.currency +
                          " " +
                          (product?.offerPrice || product?.sellingPrice)}
                      </span>
                    </p>
                    <p>Category: {product?.category?.name}</p>
                  </div>
                </div>
              </List.Item>
            )}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              maxHeight: "200px",
              overflowY: "scroll",
              backgroundColor: "white",
              zIndex: 10,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </div>

      <Button
        type="primary"
        className="w-full !text-primaryLight py-5 text-lg"
        onClick={addToCompare}
        disabled={
          selectedProducts.filter((product) => product !== null).length !== 2
        }
      >
        Add to Compare
      </Button>
    </div>
  );
};

export default CompareCreate;
