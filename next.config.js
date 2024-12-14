/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic config
  swcMinify: true,
  output: 'standalone',
  
  // Image domains
  images: {
    domains: ['fromany-country-docs.s3.eu-north-1.amazonaws.com']
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_AWS_REGION: process.env.AWS_REGION,
  }
}

module.exports = nextConfig