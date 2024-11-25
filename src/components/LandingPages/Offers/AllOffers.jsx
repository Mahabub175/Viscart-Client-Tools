"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "../Home/Products/ProductCard";

const AllOffers = () => {
  const { data: productData } = useGetAllProductsQuery();

  const filteredProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.offerPrice > 0
  );

  return (
    <section>
      {" "}
      <div className="lg:my-10 py-10 relative my-container bg-white shadow-xl p-5 rounded-xl">
        {filteredProducts?.length ? (
          <>
            <div className="capitalize text-center text-3xl text-primary font-semibold">
              {"Offer Products"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
              {filteredProducts?.map((product) => (
                <ProductCard key={product?._id} item={product} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center">No offer products available right now.</p>
        )}
      </div>
    </section>
  );
};

export default AllOffers;
