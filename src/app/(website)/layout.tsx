import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navpar from "@/component/Navbar";
import Fotter from "@/component/Footer";
import Whatsappicon from "@/component/Whatsappicon";
import Scrollbutton from "@/component/Buttonscroll";
import Providers from "@/component/Providers"; 
import Shopping from "./shopping/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased
    //      bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100

    //      `}
    //   >
    //     <Providers>
          <div className="flex flex-col  gap-[50px] items-center justify-between w-full">
            <Navpar/>
          <Shopping/>
            {children}                
            
              <Fotter />
              <div className="fixed bottom-[50px] max-sm:right-2 right-[50px]">
                <Whatsappicon />
              </div>
            
          </div>
           
    //     </Providers>
    //   </body>
    // </html>
  );
}
