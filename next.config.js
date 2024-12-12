/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce build size and improve performance
  swcMinify: true,
  
  // Optimize production builds
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize image handling
  images: {
    domains: ['fromany-country-docs.s3.eu-north-1.amazonaws.com'],
    formats: ['image/webp'],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true,
        },
      };
    }
    
    // Optimize module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },

  // Enable static exports for specific pages
  output: 'standalone',
  
  // Experimental features for performance
  experimental: {
    // Optimize page loading
    optimizeCss: true
  },
  
  // Environment variable configuration
  env: {
    NEXT_PUBLIC_AWS_REGION: process.env.AWS_REGION,
  },
}

module.exports = nextConfig