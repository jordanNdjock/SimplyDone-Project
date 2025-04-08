import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === "development",
})
const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = withPWA({
  StrictMode: false,
  images: {
    remotePatterns: [
      {
      protocol: "https",
      hostname: "cloud.appwrite.io",
      port: '',
      pathname: "/v1/storage/buckets/**",
      }
    ],
    localPatterns: [
      {
        pathname: '/assets/img/**',
        search: '',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
  
});
export default withPWA(nextConfig);
