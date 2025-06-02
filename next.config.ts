import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: process.env.BASE_PATH,
  env: {
    BASE_URL: process.env.BASE_URL,
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