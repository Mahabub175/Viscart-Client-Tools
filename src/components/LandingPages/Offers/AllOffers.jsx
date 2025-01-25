"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "../Home/Products/ProductCard";

const AllOffers = () => {
  const { data: productData } = useGetAllProductsQuery();

  const filteredProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.offerPrice > 0
  );

  return (
    <section className="my-container relative border p-2 rounded-xl mt-32 lg:mt-52">
      <h2 className="my-5 lg:my-10 text-3xl font-bold text-center text-primaryLight">
        Offer Products
      </h2>
      {filteredProducts?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center lg:items-center gap-5 mt-5 pb-5">
          {filteredProducts?.map((product) => (
            <div key={product?._id}>
              <ProductCard item={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl font-semibold my-10 text-primaryLight">
          No offer products found.
        </div>
      )}
    </section>
  );
};

export default AllOffers;
