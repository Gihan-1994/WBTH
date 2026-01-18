/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/lib"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

module.exports = nextConfig;
