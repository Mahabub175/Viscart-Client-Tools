import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetSingleProductBySlugQuery } from "@/redux/services/product/productApi";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

const ProductBreadCrumb = ({ params }) => {
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );
  const { data: categories } = useGetAllCategoriesQuery();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    if (!singleProduct || !categories) return;

    const findCategoryById = (id) =>
      categories.results.find((cat) => cat._id === id);

    const currentCategory = categories.results.find(
      (cat) => cat.name === singleProduct?.category?.name
    );

    if (!currentCategory) return;

    const hierarchy = [];

    const buildHierarchy = (category) => {
      if (!category) return;
      hierarchy.unshift({
        title: (
          <Link
            href={`/products?filter=${category.name}`}
            className="breadcrumb-link"
          >
            {category.name}
          </Link>
        ),
      });

      if (category.parentCategory) {
        const parent = findCategoryById(category.parentCategory);
        buildHierarchy(parent);
      }
    };

    buildHierarchy(currentCategory);

    setBreadcrumbItems([
      {
        title: (
          <Link href="/" className="breadcrumb-link">
            Home
          </Link>
        ),
      },
      {
        title: (
          <Link href="/products" className="breadcrumb-link">
            Products
          </Link>
        ),
      },
      ...hierarchy,
    ]);
  }, [singleProduct, categories]);

  return (
    <Breadcrumb
      separator=">"
      items={breadcrumbItems}
      className="breadcrumb-custom"
    />
  );
};

export default ProductBreadCrumb;
