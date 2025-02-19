/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove serverActions as it's now default
  },
  middleware: {
    runtime: 'nodejs'
  }
}

module.exports = nextConfig;
