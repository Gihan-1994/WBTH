/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/lib"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

module.exports = nextConfig;
