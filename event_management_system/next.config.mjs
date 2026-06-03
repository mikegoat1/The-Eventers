/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Disable Webpack's default caching to troubleshoot caching issues
    config.cache = true;

    return config;
  },
};

export default nextConfig;
