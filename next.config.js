/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig