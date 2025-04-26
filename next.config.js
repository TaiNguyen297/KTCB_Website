/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/change-password',
        destination: '/',
        permanent: true,
      },
      {
        source: '/expense-management',
        destination: '/',
        permanent: true,
      },
      {
        source: '/member-list',
        destination: '/',
        permanent: true,
      },
      {
        source: '/member-management',
        destination: '/',
        permanent: true,
      },
      {
        source: '/profile',
        destination: '/',
        permanent: true,
      },
      {
        source: '/recruitment-management',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
