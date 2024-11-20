import { smallFeatureData } from "@/assets/data/smallFeatureData";
import Image from "next/image";
import React from "react";

const SmallFeature = () => {
  return (
    <section className="py-10 my-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 justify-center items-center gap-10">
        {smallFeatureData?.map((item, i) => (
          <div key={i} className="flex items-center gap-5 justify-center">
            <Image src={item?.image} alt={item?.name} width height={40} />
            <div>
              <h3 className="text-xl font-bold">{item?.name}</h3>
              <p className="lg:w-5/6 text-textColor">{item?.feature}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmallFeature;
