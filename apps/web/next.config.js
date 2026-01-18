/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/lib"], // Adjust based on your actual shared packages
  webpack: (config, { isServer }) => {
    // Fix Prisma client path resolution in monorepo
    config.resolve.alias['.prisma/client'] = path.join(__dirname, '../../node_modules/.prisma/client');

    return config;
  },
};

module.exports = nextConfig;
