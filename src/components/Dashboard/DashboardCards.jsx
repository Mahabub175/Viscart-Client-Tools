import Link from "next/link";
import React from "react";

const DashboardCards = ({ icon, title, data, href }) => {
  return (
    <Link
      href={href}
      className="bg-white p-5 rounded-xl shadow-xl text-base font-bold text-end flex flex-col justify-center lg:justify-around items-center gap-2 hover:text-primary"
    >
      {React.createElement(icon, {
        className: "text-[40px] lg:text-[50px] text-primary",
      })}
      {data >= 0 && (
        <div className="flex items-center gap-2 lg:gap-4 text-center">
          <p>Total {title}</p>
          <p className="text-4xl">{data}</p>
        </div>
      )}
      {!data && data !== 0 && <p className="text-center">{title}</p>}
    </Link>
  );
};

export default DashboardCards;
