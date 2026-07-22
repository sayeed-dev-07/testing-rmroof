/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.2.101'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.**.com",
      },

    ],
  },
};

export default nextConfig;
