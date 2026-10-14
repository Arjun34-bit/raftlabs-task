import type { NextConfig } from "next";
const config: NextConfig = { transpilePackages: ["@raftlabs/shared"], images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] } };
export default config;
