/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  }
}

module.exports = nextConfig