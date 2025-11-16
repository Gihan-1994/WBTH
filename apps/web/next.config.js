/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/lib"], // Adjust based on your actual shared packages
};

module.exports = nextConfig;
