"use client";

import { useGetSingleBlogBySlugQuery } from "@/redux/services/blog/blogApi";
import { Spin } from "antd";
import Image from "next/image";

const SingleBlogDetails = ({ params }) => {
  const { data: item, isLoading } = useGetSingleBlogBySlugQuery(params);

  if (isLoading) {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  return (
    <section className="my-container mt-36 lg:mt-56 mb-20">
      <div className="space-y-4 mb-10">
        <p className="text-4xl font-bold">{item?.name}</p>
        <p className="">Published At: {item?.publishedAt}</p>
      </div>
      <div>
        <Image
          src={item?.attachment}
          alt={item?.name}
          width={1600}
          height={200}
          className="w-full lg:h-[700px] rounded-xl"
        />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: item?.content }}
        className="mt-20"
      />
    </section>
  );
};

export default SingleBlogDetails;
