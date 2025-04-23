"use client";

import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useGetSingleBlogBySlugQuery,
  useUpdateBlogMutation,
} from "@/redux/services/blog/blogApi";
import { base_url_image } from "@/utilities/configs/base_api";
import { Input, Button } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const { TextArea } = Input;

const SingleBlogDetails = ({ params }) => {
  const user = useSelector(useCurrentUser);

  const { data: item, isLoading } = useGetSingleBlogBySlugQuery(params);
  const [updateBlog, { isLoading: isUpdateLoading }] = useUpdateBlogMutation();

  const [comment, setComment] = useState("");

  const handlePostComment = async () => {
    if (!user) {
      return toast.info("You must be logged in to post a comment!");
    }
    const toastId = toast.loading("Posting Comment...");

    try {
      const newComment = {
        comment,
        user: user?._id,
      };

      const updatedData = {
        id: item?._id,
        data: {
          comments: [...item?.comments, newComment],
        },
      };

      const res = await updateBlog(updatedData);

      if (res.data?.success) {
        toast.success("Comment posted successfully!", { id: toastId });
        setComment("");
      } else {
        toast.error(res.data?.errorMessage || "Something went wrong.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Failed to post comment. Please try again later.", {
        id: toastId,
      });
      console.error("Error posting comment:", error);
    }
  };

  if (isLoading) {
    return (
      <section className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </section>
    );
  }

  return (
    <section className="my-container mt-36 lg:mt-56 mb-20">
      <div className="space-y-4 mb-10">
        <p className="text-2xl lg:text-4xl font-bold">{item?.name}</p>
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
        className="mt-10 lg:mt-20"
      />

      <div className="mt-10 lg:mt-20">
        <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
        />
        <Button
          type="primary"
          size="large"
          className="mt-2 font-semibold"
          onClick={handlePostComment}
          disabled={isUpdateLoading}
          loading={isUpdateLoading}
        >
          Post Comment
        </Button>

        <div className="mt-10">
          <h3 className="text-xl font-medium mb-4">
            {item?.comments?.length || 0}{" "}
            {item?.comments?.length === 1 ? "Comment" : "Comments"}
          </h3>

          <div className="space-y-4">
            {item?.comments?.map((commentItem) => (
              <div
                className="comment-item flex items-start space-x-4 border-b-2 pb-2"
                key={commentItem._id}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {commentItem?.user?.profile_image ? (
                    <Image
                      src={`${base_url_image}${commentItem.user.profile_image}`}
                      alt="Profile Image"
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      {commentItem?.user?.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-medium">{commentItem?.user?.name}</div>
                  <p className="text-gray-700 mt-1">
                    &quot;{commentItem?.comment}&quot;
                  </p>
                  <div className="text-gray-500 text-sm mt-2">
                    {dayjs(commentItem?.createdAt).format(
                      "YYYY-MM-DD : hh:mm A"
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleBlogDetails;
