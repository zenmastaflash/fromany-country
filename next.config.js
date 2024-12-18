/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    runtime: 'nodejs',
    serverComponentsExternalPackages: ['next-auth']
  }
}

module.exports = nextConfig;