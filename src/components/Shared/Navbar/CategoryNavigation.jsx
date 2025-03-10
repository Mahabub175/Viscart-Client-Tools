import Link from "next/link";
import { usePathname } from "next/navigation";

const CategoryNavigation = () => {
  const pathname = usePathname();
  // const { data: categories } = useGetAllCategoriesQuery();

  // const [dropdownVisible, setDropdownVisible] = useState(false);

  // const handleDropdownToggle = () => {
  //   setDropdownVisible(!dropdownVisible);
  // };

  // const renderSubcategories = (category) => {
  //   if (category?.subcategories && category?.subcategories.length > 0) {
  //     return (
  //       <Menu>
  //         {category.subcategories.map((subCategory) => (
  //           <Menu.Item key={subCategory?._id}>
  //             <Link href={`/products?filter=${subCategory?.name}`}>
  //               {subCategory?.name}
  //             </Link>
  //           </Menu.Item>
  //         ))}
  //       </Menu>
  //     );
  //   }
  //   return null;
  // };

  // const renderCategories = (parentCategory) => {
  //   return (
  //     <Menu>
  //       {parentCategory?.categories?.map((category) => (
  //         <Menu.SubMenu
  //           key={category?._id}
  //           icon={null}
  //           title={
  //             <Link
  //               href={`/products?filter=${category?.name}`}
  //               className="flex items-center"
  //             >
  //               {category?.name}
  //             </Link>
  //           }
  //         >
  //           {renderSubcategories(category)}
  //         </Menu.SubMenu>
  //       ))}
  //     </Menu>
  //   );
  // };

  // const renderParentCategories = () => {
  //   return categories?.results
  //     ?.filter((item) => item?.level === "parentCategory")
  //     .map((parentCategory) => (
  //       <Dropdown
  //         key={parentCategory?._id}
  //         overlay={renderCategories(parentCategory)}
  //         trigger={["hover"]}
  //       >
  //         <Link
  //           href={`/products?filter=${parentCategory?.name}`}
  //           className={`hover:text-orange duration-300 flex items-center cursor-pointer ${
  //             pathname.includes(parentCategory?.name)
  //               ? "text-orange"
  //               : "text-white"
  //           }`}
  //         >
  //           <span>{parentCategory?.name}</span>
  //         </Link>
  //       </Dropdown>
  //     ));
  // };

  const links = [
    { id: 1, to: "/", name: "Home" },
    { id: 2, to: "/offers", name: "Offers" },
    { id: 3, to: "/products", name: "All Products" },
    { id: 4, to: "/about-us", name: "About Us" },
    { id: 5, to: "/contact", name: "Contact Us" },
    { id: 6, to: "/blog", name: "Blog" },
  ];

  return (
    <div className="my-container -mt-5 lg:-mt-0 text-white">
      <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-center xl:justify-center flex-wrap py-4 text-sm">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.to}
            className={`hover:text-orange duration-300 ${
              pathname === link.to ? "text-orange" : "text-white"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {/* <Dropdown
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
        {renderParentCategories()} */}
      </div>
    </div>
  );
};

export default CategoryNavigation;
