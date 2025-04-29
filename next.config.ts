import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["heshammoawad120.pythonanywhere.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heshammoawad120.pythonanywhere.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      }
    ],
  },
 
};


export default nextConfig;
