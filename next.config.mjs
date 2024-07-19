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
    ];
  },
};

export default nextConfig;
