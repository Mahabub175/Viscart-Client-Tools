import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { Menu, Dropdown } from "antd";
import Link from "next/link";
import { useState } from "react";

const CategoryNavigation = () => {
  const { data: categories } = useGetAllCategoriesQuery();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const renderSubcategories = (category) => {
    if (category?.subcategories && category?.subcategories.length > 0) {
      return (
        <Menu>
          {category.subcategories.map((subCategory) => (
            <Menu.Item key={subCategory?._id}>
              <Link href={`/products?filter=${subCategory?.name}`}>
                {subCategory?.name}
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
            icon={null}
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
          </Link>
        </Dropdown>
      ));
  };

  return (
    <div className="my-container -mt-5 lg:-mt-0">
      <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-center xl:justify-start flex-wrap py-4 text-sm">
        <Link href={"/"}>Home</Link>
        <Link href={"/offers"}>Offers</Link>
        <Link href={"/products"}>All Products</Link>
        <Dropdown
          overlay={
            <Menu>
              {categories?.results
                ?.filter((item) => item?.level === "parentCategory")
                .map((parentCategory) => (
                  <Menu.SubMenu
                    key={parentCategory?._id}
                    icon={null}
                    title={
                      <Link
                        href={`/products?filter=${parentCategory?.name}`}
                        className="flex items-center"
                      >
                        <div className="flex items-center justify-between">
                          {parentCategory?.name}
                        </div>
                      </Link>
                    }
                  >
                    {renderCategories(parentCategory)}
                  </Menu.SubMenu>
                ))}
            </Menu>
          }
          open={dropdownVisible}
          onOpenChange={setDropdownVisible}
        >
          <div onClick={handleDropdownToggle} className="cursor-pointer">
            Shop By Categories
          </div>
        </Dropdown>
        {renderParentCategories()}
      </div>
    </div>
  );
};

export default CategoryNavigation;
