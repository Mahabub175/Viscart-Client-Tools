"use client";

import { footerData } from "@/assets/data/footerData";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import ContactInfo from "./ContactInfo";

const LandingFooter = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();

  return (
    <section className="bg-white border-t mt-10">
      <footer className="my-container py-10">
        <div className="grid lg:grid-cols-5 items-start justify-center">
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-2xl font-bold mb-2">Social</h3>
            <Link
              href={globalData?.results?.businessFacebook ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaFacebook className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Facebook</p>
            </Link>
            <Link
              href={globalData?.results?.businessLinkedin ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaLinkedin className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Linkedin</p>
            </Link>
            <Link
              href={globalData?.results?.businessInstagram ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaInstagram className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Instagram</p>
            </Link>
            <Link
              href={globalData?.results?.businessTwitter ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaSquareXTwitter className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Twitter</p>
            </Link>
          </div>
          <div className="lg:flex justify-between items-start gap-10 col-span-4">
            {footerData?.map((item, i) => (
              <div key={i} className="mt-10 lg:mt-0">
                <h3 className="text-2xl font-bold mb-6">{item?.title}</h3>
                <ul>
                  {item?.links?.map((item, i) => (
                    <Link key={i} href={item?.to}>
                      <p className="mt-2 hover:underline hover:text-primary duration-300">
                        {item?.name}
                      </p>
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
            <ContactInfo globalData={globalData} />
          </div>
        </div>
        <hr className="my-10" />
        <div className="flex flex-col md:flex-row gap-5 lg:gap-0 justify-between items-center">
          <p className="font-semibold text-textColor">
            ©{new Date().getFullYear()}, All rights reserved
          </p>
        </div>
      </footer>
    </section>
  );
};

export default LandingFooter;
