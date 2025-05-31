import { resetFilter } from "@/redux/services/device/deviceSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

const CategoryNavigation = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

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
            <p onClick={() => dispatch(resetFilter())}>{link.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
