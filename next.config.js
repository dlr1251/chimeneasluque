/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.chimeneasluque.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'cdn.pixabay.com',
    ],
    unoptimized: false,
  },
}

module.exports = nextConfig

