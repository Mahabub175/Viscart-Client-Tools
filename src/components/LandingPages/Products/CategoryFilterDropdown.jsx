/* eslint-disable no-undef */
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Checkbox, Input } from "antd";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const CategoryFilterDropdown = ({
  activeCategories,
  searchFilter,
  handleCategoryChange,
  searchParam,
}) => {
  const [openKeys, setOpenKeys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchParam || !activeCategories?.length) return;

    const expandedKeys = new Set();

    activeCategories.forEach((parent) => {
      parent.categories?.forEach((category) => {
        if (searchParam.toLowerCase().includes(category.name.toLowerCase())) {
          expandedKeys.add(parent._id);
          expandedKeys.add(category._id);
        }

        category.subcategories?.forEach((sub) => {
          if (searchParam.toLowerCase().includes(sub.name.toLowerCase())) {
            expandedKeys.add(parent._id);
            expandedKeys.add(category._id);
          }
        });
      });
    });

    setOpenKeys(Array.from(expandedKeys));
  }, [searchParam, activeCategories]);

  const toggleOpenKey = (key) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderSubcategories = (subcategories) =>
    subcategories
      .filter((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((sub) => {
        const isActive = searchFilter.includes(sub.name);
        return (
          <div key={sub._id} className="ml-4 mt-1">
            <Checkbox
              checked={isActive}
              onChange={() => handleCategoryChange(sub.name)}
              className="text-sm font-medium"
            >
              {sub.name}
            </Checkbox>
          </div>
        );
      });

  const renderCategories = (categories) =>
    categories
      .filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.subcategories?.some((sub) =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      .map((cat) => {
        return (
          <div key={cat._id} className="mt-2 ml-3">
            <div className="flex items-center justify-between">
              <Checkbox
                checked={searchFilter.includes(cat.name)}
                onChange={() => handleCategoryChange(cat.name)}
                className="text-sm font-medium"
              >
                {cat.name}
              </Checkbox>
              {cat.subcategories?.length > 0 && (
                <span
                  onClick={() => toggleOpenKey(cat._id)}
                  className="text-xs text-gray-500 cursor-pointer hover:text-orange"
                >
                  {openKeys.includes(cat._id) ? (
                    <RightOutlined className="-rotate-90" />
                  ) : (
                    <DownOutlined />
                  )}
                </span>
              )}
            </div>
            {openKeys.includes(cat._id) && (
              <div className="mt-1">
                {renderSubcategories(cat.subcategories)}
              </div>
            )}
          </div>
        );
      });

  const parentCategories = activeCategories?.filter(
    (c) =>
      c.level === "parentCategory" &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.categories?.some(
          (cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.subcategories?.some((sub) =>
              sub.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        ))
  );

  return (
    <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
      <label className="block mb-2 font-semibold text-center text-white bg-black rounded sticky top-0 z-10">
        Categories
      </label>

      <Input
        placeholder="Search category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 sticky top-8 z-10"
        prefix={<FaSearch />}
        allowClear
      />

      {parentCategories?.map((parent) => {
        return (
          <div key={parent._id} className="mb-3">
            <div className="flex items-center justify-between">
              <Checkbox
                checked={searchFilter.includes(parent.name)}
                onChange={() => handleCategoryChange(parent.name)}
                className="font-medium text-sm"
              >
                {parent.name}
              </Checkbox>
              {parent.categories?.length > 0 && (
                <span
                  onClick={() => toggleOpenKey(parent._id)}
                  className="text-sm text-gray-500 cursor-pointer hover:text-orange"
                >
                  {openKeys.includes(parent._id) ? (
                    <RightOutlined className="-rotate-90" />
                  ) : (
                    <DownOutlined />
                  )}
                </span>
              )}
            </div>
            {openKeys.includes(parent._id) && (
              <div className="mt-1">
                {renderCategories(parent?.categories, parent.name)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryFilterDropdown;
