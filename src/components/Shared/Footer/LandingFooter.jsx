"use client";

import { footerLinks } from "@/assets/data/footerData";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Image from "next/image";
import { FaLocationDot, FaBoxArchive } from "react-icons/fa6";
import { MdContactPhone } from "react-icons/md";
import { RiChatQuoteFill } from "react-icons/ri";
import React from "react";
import { usePathname } from "next/navigation";

const LandingFooter = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const pathname = usePathname();

  const footersData = [
    {
      name: "Find Store",
      description: "Find Our Outlets In Your Area",
      icon: FaLocationDot,
      to: "/contact",
    },
    {
      name: "Get Quote",
      description: "Get A Quote For Your Products",
      icon: RiChatQuoteFill,
      to: `mailto:${globalData?.results?.businessEmail}`,
    },
    {
      name: "Contact",
      description: "Contact Us For Any Query",
      icon: MdContactPhone,
      to: "/contact",
    },
    {
      name: "Complaint Box",
      description: "If You Have Any Complaint",
      icon: FaBoxArchive,
      to: globalData?.results?.complaintLink,
    },
  ];

  return (
    <section className="bg-[#0f0f0f] mb-12 lg:mb-0 text-gray-400 mt-10">
      <footer className="-mt-10 lg:mt-0">
        <div className="my-container flex justify-center">
          <Link href={"/"}>
            <Image
              src={globalData?.results?.logo}
              alt="logo"
              width={200}
              height={200}
              className={`${pathname.includes("admin" || "user") && "mt-10"}`}
            />
          </Link>
        </div>
        <div className="my-container flex flex-wrap justify-center gap-2 lg:gap-5 mb-10">
          {footerLinks?.map((item, i) => (
            <Link key={i} href={item?.to}>
              <p className="border border-primaryLight p-2 rounded-full text-xs hover:bg-primary hover:text-primaryLight duration-300">
                {item?.name}
              </p>
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center gap-4 my-container mb-10">
          <h3 className="text-2xl font-bold mb-2">Follow Us</h3>
          <div className="flex items-center gap-4">
            <Link
              href={globalData?.results?.businessFacebook ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaFacebook className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessYoutube ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaYoutube className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessLinkedin ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaLinkedin className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessInstagram ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaInstagram className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessTwitter ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaSquareXTwitter className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
          </div>
        </div>

        <div>
          <div className="my-container grid grid-cols-2 lg:grid-cols-4 gap-5">
            {footersData.map((footer, index) => (
              <div key={index}>
                <Link
                  href={footer.to}
                  target={
                    footer.to.startsWith("http") ||
                    footer.to.startsWith("mailto")
                      ? "_blank"
                      : "_self"
                  }
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 border border-primaryLight p-4 rounded hover:bg-primary hover:text-primaryLight duration-300"
                >
                  <div>
                    {React.createElement(footer.icon, {
                      className: "text-2xl",
                    })}
                  </div>
                  <div>
                    <div className="text-sm lg:text-lg font-medium mb-2">
                      {footer.name}
                    </div>
                    <div className="text-xs lg:text-sm">
                      {footer.description}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <hr className="mt-10 border-textColor" />

        <div className="py-5">
          <p className="font-semibold text-white my-container text-center text-sm">
            ©{new Date().getFullYear()}, All rights reserved
          </p>
        </div>
      </footer>
    </section>
  );
};

export default LandingFooter;
