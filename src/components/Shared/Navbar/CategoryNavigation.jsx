import { useState } from "react";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { RightOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { usePathname } from "next/navigation";

const CategoryNavigation = () => {
  const pathname = usePathname();

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
            <Menu.Item key={subCategory?._id} className="hover:text-white">
              <Link href={`/products/filtered?filter=${subCategory?.name}`}>
                <div className="flex items-center justify-between">
                  {subCategory?.name}
                </div>
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
                href={`/products/filtered?filter=${category?.name}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center hover:text-white">
                  {category?.name}
                  {category?.subcategories?.length > 0 && <RightOutlined />}
                </div>
              </Link>
            }
          >
            {renderSubcategories(category)}
          </Menu.SubMenu>
        ))}
      </Menu>
    );
  };

  const routes = (
    <div className="flex flex-col md:flex-row md:items-center gap-10">
      {[
        {
          name: "Home",
          link: "/",
        },
        {
          name: "Products",
          link: "/products",
        },
        {
          name: "Offers",
          link: "/offers",
        },
        {
          name: "Contact Us",
          link: "/contact",
        },
      ].map((item, index) => (
        <Link
          key={index}
          href={item.link}
          className={`flex flex-col lg:items-center font-bold duration-300 ${
            pathname === item.link
              ? "text-primary hover:text-primary"
              : "text-black hover:text-primary"
          }`}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="bg-white lg:text-black lg:border-y mb-5">
      <div className="my-container mx-auto flex flex-col lg:flex-row gap-10 items-start lg:items-center">
        <Dropdown
          overlay={
            <Menu>
              {categories?.results
                ?.filter((item) => item?.level === "parentCategory")
                .map((parentCategory) => (
                  <Menu.SubMenu
                    key={parentCategory?._id}
                    title={
                      <Link
                        href={`/products/filtered?filter=${parentCategory?.name}`}
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
          <div
            onClick={handleDropdownToggle}
            className="bg-primary py-4 px-8 font-bold flex items-center gap-2 text-white rounded cursor-pointer"
          >
            <GiHamburgerMenu />
            Categories
          </div>
        </Dropdown>
        {routes}
      </div>
    </div>
  );
};

export default CategoryNavigation;
