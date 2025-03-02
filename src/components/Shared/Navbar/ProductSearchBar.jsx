import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const ProductSearchBar = ({
  products,
  globalData,
  isMobile,
  setDrawerOpen,
  setIsSearchOpen,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setSearchValue(value);
    if (!value) {
      setFilteredOptions([]);
      return;
    }

    const results =
      Array.isArray(products?.results) &&
      products?.results?.filter(
        (product) =>
          product?.name?.toLowerCase().includes(value.toLowerCase()) ||
          product?.category?.name?.toLowerCase().includes(value.toLowerCase())
      );

    setFilteredOptions(results || []);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
  };

  const handleProductClick = () => {
    setSearchValue("");
    setFilteredOptions([]);
    setIsFocused(false);
    setDrawerOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <div className={`${isMobile && "hidden lg:block"} w-full`}>
      <div className="relative w-full">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="Search for Products..."
          className="w-full rounded-full"
          size="large"
          prefix={<FaSearch className="text-primary" />}
        />

        {isFocused && searchValue && filteredOptions.length > 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-1 lg:mt-2 max-h-[35rem] overflow-y-auto">
            {filteredOptions.slice(0, 10).map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product?.slug}`}
                onClick={handleProductClick}
                className="flex items-center gap-4 hover:text-primary duration-300 p-4 border-b border-b-gray-200"
              >
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
              </Link>
            ))}

            {filteredOptions.length > 10 && (
              <Link
                href="/products"
                className="block text-center text-primary py-2 hover:bg-gray-100"
              >
                View All
              </Link>
            )}
          </div>
        )}

        {isFocused && searchValue && filteredOptions.length === 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-2 p-4 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchBar;
