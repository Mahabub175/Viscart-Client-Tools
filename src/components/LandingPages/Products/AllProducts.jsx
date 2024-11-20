"use client";

import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetProductsQuery } from "@/redux/services/product/productApi";
import { Pagination, Select, Slider } from "antd";
import { useState } from "react";
import { paginationNumbers } from "@/assets/data/paginationData";
import FilteredProducts from "./FilteredProducts";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const { Option } = Select;

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sorting, setSorting] = useState("");

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: brandData } = useGetAllBrandsQuery();
  const { data: categoryData } = useGetAllCategoriesQuery();
  const { data: productData } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: "",
  });

  const activeBrands = brandData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const activeCategories = categoryData?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.level === "category"
  );

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleBrandChange = (value) => {
    setSelectedBrands(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategories(value);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleSortingChange = (value) => {
    setSorting(value);
  };

  const filteredProducts = activeProducts
    ?.filter((product) => {
      const isBrandMatch = selectedBrands.length
        ? selectedBrands.includes(product?.brand?.name)
        : true;
      const isCategoryMatch = selectedCategories.length
        ? selectedCategories.includes(product?.category?.name)
        : true;
      const isPriceMatch =
        product.sellingPrice >= priceRange[0] &&
        product.sellingPrice <= priceRange[1];
      return isBrandMatch && isCategoryMatch && isPriceMatch;
    })
    ?.sort((a, b) => {
      if (sorting === "PriceLowToHigh") {
        return a.sellingPrice - b.sellingPrice;
      }
      if (sorting === "PriceHighToLow") {
        return b.sellingPrice - a.sellingPrice;
      }
      return 0;
    });

  return (
    <section className="container mx-auto px-5 py-10 relative">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-1/4 p-4 border rounded-lg shadow-sm lg:sticky top-10">
          <h2 className="mb-4 text-lg font-semibold">Filter Products</h2>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Brands</label>
            <Select
              mode="multiple"
              allowClear
              placeholder="Select Brands"
              style={{ width: "100%" }}
              onChange={handleBrandChange}
            >
              {activeBrands?.map((brand) => (
                <Option key={brand?._id} value={brand.name}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Categories</label>
            <Select
              mode="multiple"
              allowClear
              placeholder="Select Categories"
              style={{ width: "100%" }}
              onChange={handleCategoryChange}
            >
              {activeCategories?.map((category) => (
                <Option key={category?._id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Price Range</label>
            <Slider
              range
              min={0}
              max={10000}
              defaultValue={[0, 10000]}
              onChange={handlePriceChange}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>{globalData?.results?.currency + " " + priceRange[0]}</span>
              <span>{globalData?.results?.currency + " " + priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          <div className="bg-gray-200 flex items-center justify-between py-3 px-6 mb-6 rounded-xl">
            <p>
              There are{" "}
              <span className="font-semibold">{activeProducts?.length}</span>{" "}
              products.
            </p>
            <div className="flex items-center gap-2 w-1/4">
              <Select
                allowClear
                placeholder="Select Sorting"
                style={{ width: "100%" }}
                onChange={handleSortingChange}
              >
                <Option value={"PriceLowToHigh"}>Price Low To High</Option>
                <Option value={"PriceHighToLow"}>Price High To Low</Option>
              </Select>
            </div>
          </div>
          <div>
            <FilteredProducts data={filteredProducts} />
            <Pagination
              className="flex justify-end items-center !mt-10"
              total={productData?.meta?.totalCount}
              current={currentPage}
              onChange={handlePageChange}
              pageSize={pageSize}
              showSizeChanger
              pageSizeOptions={paginationNumbers}
              simple
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
