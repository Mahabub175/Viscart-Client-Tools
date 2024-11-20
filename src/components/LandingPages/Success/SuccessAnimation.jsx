"use client";

import Lottie from "lottie-react";
import animation from "@/assets/animation/thanks.json";

const SuccessAnimation = () => {
  return (
    <Lottie animationData={animation} loop={true} className="w-1/4 -mt-44" />
  );
};

export default SuccessAnimation;
