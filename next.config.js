/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const isDevelopment = process.env.NODE_ENV !== "production";
const rewritesConfig = isDevelopment
  ? [
      {
        source: "/api/:path*",
        destination: 'https://tssearch.ceymox.net/:path*',
      },
    ]
  : [
    {
      source: "/api/:path*",
      destination: 'https://tssearch.ceymox.net/:path*',
    },
  ];

  const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['tssearch.ceymox.net'],
    },
  }
  
  module.exports = withPWA({

    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
    },
    ...nextConfig,
  });
  

  module.exports = {
    async rewrites() {
      return rewritesConfig;
    },
  };