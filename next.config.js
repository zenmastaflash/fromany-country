/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove serverActions as it's now default
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}

module.exports = nextConfig;
