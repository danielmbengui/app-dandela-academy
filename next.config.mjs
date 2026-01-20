import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  turbopack: {
    // ...
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "academy.dandela.com" },
      { protocol: "https", hostname: "app.academy.dandela.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "dnznrvs05pmza.cloudfront.net" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "google.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "fr.wikipedia.org" },
      { protocol: "https", hostname: "cdn.futura-sciences.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "kellerfahnen.ch" }
    ],
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  //disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === "document",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
      },
    },
    {
      urlPattern: ({ request }) =>
        request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com/,
      handler: "CacheFirst",
      options: {
        cacheName: "firebase-assets",
      },
    },
  ],
});

export default withPWAConfig(nextConfig);
