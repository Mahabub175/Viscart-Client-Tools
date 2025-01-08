"use client";

import LinkButton from "@/components/Shared/LinkButton";
import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import Image from "next/image";

const Brands = () => {
  const { data: brands } = useGetAllBrandsQuery();

  const activeBrands = brands?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  return (
    <section className="my-container p-5 rounded-xl mt-20 relative">
      <h2 className="text-2xl lg:text-4xl font-medium text-center lg:text-start mb-10">
        Top Brands We Deal In
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-5">
        {activeBrands?.map((item) => {
          return (
            <div
              key={item?._id}
              className="relative w-[240px] h-[400px] rounded-xl overflow-hidden group bg-black bg-opacity-10 hover:bg-opacity-20 transition-all duration-500"
            >
              <LinkButton href={`/products?filter=${item?.name}`}>
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={item?.name ?? "demo"}
                  width={240}
                  height={400}
                  className="border-2 border-transparent hover:border-primary duration-500 w-[240px] h-[400px] rounded-xl mx-auto object-fill"
                />
                <div className="absolute top-0 left-0 w-full flex justify-center items-center h-14 z-10">
                  <h2 className="text-white text-lg font-medium">
                    {item?.name}
                  </h2>
                </div>
              </LinkButton>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Brands;
