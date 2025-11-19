/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.chimeneasluque.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
    unoptimized: false,
  },
  // Asegurar que los recursos estáticos se generen correctamente
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimizaciones para producción
  swcMinify: true,
  // Compilación experimental mejorada
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig

