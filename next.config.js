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

