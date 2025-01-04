import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    ...(process.env.NODE_ENV === 'production' ? {
        output: 'export',
        basePath: '',  // Remove /dg-simulator since you're deploying to root domain
        trailingSlash: true,
    } : {})
};

export default nextConfig;
