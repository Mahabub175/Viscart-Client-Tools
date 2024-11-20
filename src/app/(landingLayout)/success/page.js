import SuccessAnimation from "@/components/LandingPages/Success/SuccessAnimation";
import { Button } from "antd";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SuccessAnimation />
      <h1 className="text-xl font-semibold">
        Your order was a success. It is being processed right now.
      </h1>
      <Link href={"/products"} className="mt-10">
        <Button type="primary">Continue Shopping</Button>
      </Link>
    </div>
  );
};

export default page;
