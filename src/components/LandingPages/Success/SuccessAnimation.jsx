"use client";

import animation from "@/assets/animation/thanks.json";
import Lottie from "lottie-react";

const SuccessAnimation = () => {
  return (
    <Lottie
      animationData={animation}
      loop={true}
      className="w-2/4 lg:w-1/4 lg:-mt-44"
    />
  );
};

export default SuccessAnimation;
