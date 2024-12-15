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
      <div className="lg:my-10 py-5 lg:py-10 relative container px-2 lg:px-5 mx-auto bg-white shadow-xl rounded-xl">
        {filteredProducts?.length ? (
          <>
            <div className="capitalize text-center text-2xl lg:text-3xl text-primary font-semibold">
              {"Offer Products"}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-5 lg:gap-10 mt-10">
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
