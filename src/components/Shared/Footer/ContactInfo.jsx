import { FaLocationDot, FaPhone, FaClock } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import logo from "@/assets/images/logo-white.png";
import Image from "next/image";

const ContactInfo = () => {
  return (
    <div className="col-span-2">
      <Image src={logo} alt="logo" height={200} width className="-mt-10" />
      <div className="flex items-center gap-2 lg:w-5/6 -mt-2">
        <FaLocationDot className="text-primary" />
        <p className="text-textColor">
          <span className="font-semibold">Address: </span>
          1762 School House Road
        </p>
      </div>
      <div className="flex items-center gap-2 lg:w-5/6 mt-2">
        <FaPhone className="text-primary" />
        <p className="text-textColor">
          <span className="font-semibold">Phone:</span> 1233-777
        </p>
      </div>
      <div className="flex items-center gap-2 lg:w-5/6 mt-2">
        <MdEmail className="text-primary" />
        <p className="text-textColor">
          <span className="font-semibold">Email:</span>{" "}
          viscart.support@viscart.com
        </p>
      </div>
      <div className="flex items-center gap-2 lg:w-5/6 mt-2">
        <FaClock className="text-primary" />
        <p className="text-textColor">
          <span className="font-semibold">Work hours:</span> 8:00 - 20:00,
          Sunday - Thursday
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
