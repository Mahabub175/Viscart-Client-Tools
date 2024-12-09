import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import AntDProvider from "@/components/Shared/AntDProvider";

const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Viscart",
  description: "Complete E-Commerce Site",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <AntDProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </AntDProvider>
      </body>
    </html>
  );
};

export default RootLayout;
