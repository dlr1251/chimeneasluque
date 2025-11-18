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
    // Deshabilitar optimización para imágenes locales que pueden no existir
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
  },
  // Configuración para A-Frame y AR.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // Permitir scripts externos para A-Frame y AR.js
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://aframe.io https://cdn.jsdelivr.net https://raw.githack.com https://raw.githubusercontent.com;",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

