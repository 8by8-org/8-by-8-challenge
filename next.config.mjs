import { createCSP } from './scripts/create-content-security-policy.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
    Cache images and other static assets for one year. This prevents a
    flickering effect that can occur when client components load, among
    other benefits.
  */
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)',

        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [createCSP()],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/register',
        destination: '/register/eligibility',
        permanent: true,
      },
      {
        /*
          The Wix site (https://8by8.us) contains a link to /homepage, which 
          doesn't exist in the new 8by8 challenge application. Redirect to 
          / for now until the Wix site can be updated. 
        */
        source: '/homepage',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
