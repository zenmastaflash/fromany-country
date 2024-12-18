/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we're using Node.js runtime for API routes
  experimental: {
    runtime: 'nodejs',
    serverComponentsExternalPackages: ['next-auth']
  }
}

module.exports = nextConfig