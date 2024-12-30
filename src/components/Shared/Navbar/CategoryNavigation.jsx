import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import Link from "next/link";
import React from "react";

const CategoryNavigation = () => {
  const { data: categories } = useGetAllCategoriesQuery();

  const renderSubcategories = (category) => {
    if (category?.subcategories && category?.subcategories.length > 0) {
      return (
        <Menu>
          {category.subcategories.map((subCategory) => (
            <Menu.Item key={subCategory?._id}>
              <Link href={`/products?filter=${subCategory?.name}`}>
                {subCategory?.name}
                {subCategory?.subcategories &&
                  subCategory?.subcategories.length > 0 && (
                    <RightOutlined className="ml-2" />
                  )}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      );
    }
    return null;
  };

  const renderCategories = (parentCategory) => {
    return (
      <Menu>
        {parentCategory?.categories?.map((category) => (
          <Menu.SubMenu
            key={category?._id}
            title={
              <Link
                href={`/products?filter=${category?.name}`}
                className="flex items-center"
              >
                {category?.name}
              </Link>
            }
          >
            {renderSubcategories(category)}
          </Menu.SubMenu>
        ))}
      </Menu>
    );
  };

  const renderParentCategories = () => {
    return categories?.results
      ?.filter((item) => item?.level === "parentCategory")
      .map((parentCategory) => (
        <Dropdown
          key={parentCategory?._id}
          overlay={renderCategories(parentCategory)}
          trigger={["hover"]}
        >
          <Link
            href={`/products?filter=${parentCategory?.name}`}
            className="flex items-center cursor-pointer"
          >
            <span>{parentCategory?.name}</span>
            {parentCategory?.categories &&
              parentCategory?.categories.length > 0 && (
                <DownOutlined className="!text-sm" />
              )}
          </Link>
        </Dropdown>
      ));
  };

  return (
    <div className="my-container">
      <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-center py-5">
        <Link href={"/offers"}>Offers</Link>
        <Link href={"/products"}>All Products</Link>
        <span className="hidden lg:block">|</span>
        <span className="lg:hidden"></span>
        {renderParentCategories()}
      </div>
    </div>
  );
};

export default CategoryNavigation;
