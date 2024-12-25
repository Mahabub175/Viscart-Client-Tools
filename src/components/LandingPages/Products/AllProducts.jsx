"use client";

import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetProductsQuery } from "@/redux/services/product/productApi";
import { Pagination, Slider, Checkbox, Select, Button, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { paginationNumbers } from "@/assets/data/paginationData";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import ProductCard from "../Home/Products/ProductCard";
import { debounce } from "lodash";

const { Option } = Select;

const AllProducts = ({ searchParams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sorting, setSorting] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: brandData } = useGetAllBrandsQuery();
  const { data: categoryData } = useGetAllCategoriesQuery();
  const { data: productData } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: "",
  });

  const activeBrands = useMemo(
    () => brandData?.results?.filter((item) => item?.status !== "Inactive"),
    [brandData]
  );

  const activeCategories = useMemo(
    () => categoryData?.results?.filter((item) => item?.status !== "Inactive"),
    [categoryData]
  );

  const activeProducts = useMemo(
    () => productData?.results?.filter((item) => item?.status !== "Inactive"),
    [productData]
  );

  const debouncedSetSearchFilter = useMemo(
    () => debounce((value) => setSearchFilter(value?.toLowerCase()), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearchFilter(searchParams);
    return () => debouncedSetSearchFilter.cancel();
  }, [searchParams, debouncedSetSearchFilter]);

  useEffect(() => {
    if (searchFilter) {
      const matchedBrands = activeBrands
        ?.filter((brand) => brand?.name?.toLowerCase().includes(searchFilter))
        .map((brand) => brand.name);
      const matchedCategories = activeCategories
        ?.filter((category) =>
          category?.name?.toLowerCase().includes(searchFilter)
        )
        .map((category) => category.name);

      setSelectedBrands(matchedBrands || []);
      setSelectedCategories(matchedCategories || []);
    }
  }, [searchFilter, activeBrands, activeCategories]);

  const filteredProducts = useMemo(() => {
    const filtered = activeProducts?.filter((product) => {
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
    });

    if (sorting === "PriceLowToHigh") {
      return filtered?.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }
    if (sorting === "PriceHighToLow") {
      return filtered?.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }
    return filtered;
  }, [activeProducts, selectedBrands, selectedCategories, priceRange, sorting]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
  };

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleSortingChange = (value) => {
    setSorting(value);
  };

  return (
    <section className="my-container py-10 relative -mt-5 lg:mt-0">
      <div className="bg-gray-200 flex items-center gap-2 justify-between py-3 px-2 lg:px-6 mb-6 rounded-xl">
        <p className="text-xs md:text-base">
          <span className="font-semibold text-lg">
            {filteredProducts?.length}
          </span>{" "}
          products showing.
        </p>
        <div className="flex items-center lg:w-1/4">
          <Select
            allowClear
            placeholder="Select Sorting"
            style={{ width: "100%" }}
            onChange={handleSortingChange}
          >
            <Option value="PriceLowToHigh">Price Low To High</Option>
            <Option value="PriceHighToLow">Price High To Low</Option>
          </Select>
        </div>
        <Button
          type="primary"
          className="lg:hidden"
          onClick={() => setFilterModal(true)}
        >
          Advance Filter
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="w-full lg:w-3/12 p-4 border rounded-lg shadow-sm lg:sticky top-5 hidden lg:block">
          <h2 className="mb-4 text-lg font-semibold">Filter Products</h2>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Brands</label>
            <Checkbox.Group
              options={activeBrands?.map((brand) => ({
                label: brand.name,
                value: brand.name,
              }))}
              value={selectedBrands}
              onChange={handleBrandChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Categories</label>
            <Checkbox.Group
              options={activeCategories?.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
              value={selectedCategories}
              onChange={handleCategoryChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Price Range</label>
            <Slider
              range
              min={0}
              max={10000}
              defaultValue={[0, 10000]}
              value={priceRange}
              onChange={handlePriceChange}
              step={50}
              tooltip={{
                formatter: (value) =>
                  `${globalData?.results?.currency} ${value}`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>{globalData?.results?.currency + " " + priceRange[0]}</span>
              <span>{globalData?.results?.currency + " " + priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div>
            {filteredProducts?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-5">
                {filteredProducts?.map((product) => (
                  <ProductCard key={product?._id} item={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-32 text-xl">
                No products found.
              </p>
            )}
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
      <Modal
        open={filterModal}
        onCancel={() => setFilterModal(false)}
        footer={null}
        centered
      >
        <div className="w-full p-4">
          <h2 className="mb-4 text-lg font-semibold">Filter Products</h2>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Brands</label>
            <Checkbox.Group
              options={activeBrands?.map((brand) => ({
                label: brand.name,
                value: brand.name,
              }))}
              value={selectedBrands}
              onChange={handleBrandChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Categories</label>
            <Checkbox.Group
              options={activeCategories?.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
              value={selectedCategories}
              onChange={handleCategoryChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Price Range</label>
            <Slider
              range
              min={0}
              max={10000}
              defaultValue={[0, 10000]}
              value={priceRange}
              onChange={handlePriceChange}
              step={50}
              tooltip={{
                formatter: (value) =>
                  `${globalData?.results?.currency} ${value}`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>{globalData?.results?.currency + " " + priceRange[0]}</span>
              <span>{globalData?.results?.currency + " " + priceRange[1]}</span>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default AllProducts;
