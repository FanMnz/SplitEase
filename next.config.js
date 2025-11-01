/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongodb'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig