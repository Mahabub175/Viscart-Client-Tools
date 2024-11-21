"use client";

import { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-[22%] right-7 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-xl cursor-pointer animate-pulse"
        >
          <IoIosArrowUp />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
