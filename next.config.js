/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/wikipedia/commons/**',
      },
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.seriouseats.com',
        port: '',
        pathname: '/thmb/**',
      },
      {
        protocol: 'https',
        hostname: 'potatorolls.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'torontolife.mblycdn.com',
        port: '',
        pathname: '/tl/resized/**',
      },
      {
        protocol: 'https',
        hostname: 'images.themodernproper.com',
        port: '',
        pathname: '/production/posts/**',
      },
      {
        protocol: 'https',
        hostname: 'food.fnr.sndimg.com',
        port: '',
        pathname: '/content/dam/images/**',
      },
      {
        protocol: 'https',
        hostname: 'awrestaurants.com',
        port: '',
        pathname: '/_next/static/chunks/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
        port: '',
        pathname: '/thmb/**',
      },
    ],
  },
}

module.exports = nextConfig 