/* eslint-disable @next/next/no-img-element */
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import AntDProvider from "@/components/Shared/AntDProvider";
// import Script from "next/script";

const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Viscart",
  description: "Complete E-Commerce Site",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      {/* <head>
        <Script
          strategy="afterInteractive"
          src="https://connect.facebook.net/en_US/fbevents.js"
        />
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.fbq = window.fbq || function() {
                (window.fbq.q = window.fbq.q || []).push(arguments);
              };
              fbq('init', '1110726624027987');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            src="https://www.facebook.com/tr?id=1110726624027987&ev=PageView&noscript=1"
            alt="Facebook Pixel"
            height="1"
            width="1"
            style={{ display: "none" }}
          />
        </noscript>
      </head> */}
      <body className={openSans.className}>
        <AntDProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </AntDProvider>
      </body>
    </html>
  );
};

export default RootLayout;
