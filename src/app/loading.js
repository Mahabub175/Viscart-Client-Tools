import logo from "@/assets/images/logo-white.png";
import Image from "next/image";

const loading = () => {
  return (
    <section className="h-screen flex items-center justify-center">
      <Image
        src={logo}
        alt="logo"
        height={200}
        width
        className="animate-pulse"
      />
    </section>
  );
};

export default loading;
