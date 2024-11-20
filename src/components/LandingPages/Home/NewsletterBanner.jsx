"use client";

import { Button, Form, Input } from "antd";
import banner1 from "@/assets/images/homepage/image2.png";
import Image from "next/image";
import { LuSend } from "react-icons/lu";
import { useState } from "react";
import { useAddNewsletterMutation } from "@/redux/services/newsletter/newsletterApi";
import { toast } from "sonner";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [addNewsletter, { isLoading }] = useAddNewsletterMutation();

  const onSubmit = async () => {
    const toastId = toast.loading("Adding to newsletter...");
    const submittedData = {
      email: email,
    };

    try {
      const res = await addNewsletter(submittedData);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setEmail("");
      }
    } catch (error) {
      console.error("Error creating Attribute:", error);
    }
  };

  return (
    <section className="py-10 container mx-auto">
      <div className="bg-primaryLight rounded-xl w-full border border-primary flex items-center relative lg:h-[400px]">
        <div className="px-10 space-y-3 py-10">
          <h2 className="text-2xl lg:text-6xl font-bold lg:w-4/6">
            Stay home & get your Daily needs from our shop
          </h2>
          <p className="text-textColor pt-4 pb-2 lg:w-4/6">
            Start Your Daily Shopping with Grocery Shop
          </p>
          <Form
            onFinish={onSubmit}
            className="flex items-center w-full lg:w-2/6 relative"
          >
            <Input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              size="large"
              value={email}
              className="rounded-full px-10"
              required
            />
            <LuSend className="text-xl absolute left-3" />
            <Button
              loading={isLoading}
              htmlType="submit"
              type="primary"
              className="rounded-full absolute right-1 font-bold lg:px-10"
            >
              Subscribe
            </Button>
          </Form>
        </div>
        <div className="hidden lg:block absolute -bottom-8 -right-24">
          <Image src={banner1} alt="banner" width height={500} priority />
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
