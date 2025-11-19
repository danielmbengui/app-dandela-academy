/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'dnznrvs05pmza.cloudfront.net' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'google.com' },
      { protocol: 'https', hostname: 'fr.wikipedia.org' },
      { protocol: 'https', hostname: 'www.google.com' },
      { protocol: 'https', hostname: 'cdn.futura-sciences.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'kellerfahnen.ch' },
      //https://fr.wikipedia.org/wiki/Google#/media/Fichier:Google_Favicon_2025.svg
    ],
  },
};

export default nextConfig;
