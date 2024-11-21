import React from "react";
import ContactForm from "./ContactForm";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const ContactDetails = () => {
  return (
    <section className="my-container lg:my-20">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-10">
        <div>
          <div className="bg-white p-5 rounded-xl shadow-xl mb-10">
            <h2 className="text-xl font-bold text-black/80 mb-4 border-b pb-2">
              Working Days
            </h2>
            <p>Monday - Friday: 10:00 AM - 8:00 PM</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-xl mb-10">
            <h2 className="text-xl font-bold text-black/80 mb-4 border-b pb-2">
              Store address
            </h2>
            <div className="flex flex-col gap-4 mt-4">
              <p>Our address information</p>
              <p>
                335/B. 3rd Floor, Senpara parbata, Mirpur 10, Dhaka Bangladesh
              </p>
              <p>01842-746065</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
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
        </div>
        <div className="col-span-2 bg-white p-5 rounded-xl shadow-xl">
          <h2 className="text-3xl font-medium mb-4">Tell Us Your Message :</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactDetails;
