import Image from "next/image";
import payment from "@/assets/images/Payment.png";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Link from "next/link";
import ContactInfo from "./ContactInfo";
import { footerData } from "@/assets/data/footerData";

const LandingFooter = () => {
  return (
    <>
      <footer className="my-container border-t py-10 mt-10">
        <div className="grid lg:grid-cols-5 items-start justify-center">
          <ContactInfo />
          <div className="lg:flex justify-between items-start gap-20 col-span-3">
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
          </div>
        </div>
        <hr className="my-10" />
        <div className="flex flex-col md:flex-row gap-5 lg:gap-0 justify-between items-center">
          <p className="font-semibold text-textColor">
            ©{new Date().getFullYear()}, All rights reserved
          </p>
          <Image src={payment} alt="payment" width height />
          <div className="flex items-center gap-4">
            <Link href={"/"} target="_blank">
              <FaFacebook className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link href={"/"} target="_blank">
              <FaLinkedin className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link href={"/"} target="_blank">
              <FaInstagram className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
            <Link href={"/"} target="_blank">
              <FaSquareXTwitter className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingFooter;
