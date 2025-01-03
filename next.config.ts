import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: 'export',
    basePath: '/dg-simulator',
    assetPrefix: '/dg-simulator/',
    trailingSlash: true,
};

export default nextConfig;