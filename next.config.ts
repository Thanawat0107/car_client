import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/cs66/next/s07/wepcar",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

// const nextConfig: NextConfig = {
//   output: "export",
//   images: { unoptimized: true },
//   basePath: process.env.BASE_PATH,
//   env: {
//     BASE_URL: process.env.BASE_URL,
//   },
// };

// export default nextConfig;