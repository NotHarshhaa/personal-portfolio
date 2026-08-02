/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true
}

// Bundle analyzer
let withBundleAnalyzer = (config) => config

if (process.env.ANALYZE === 'true') {
  const bundleAnalyzer = await import('@next/bundle-analyzer')
  withBundleAnalyzer = bundleAnalyzer.default({ enabled: true })
}

export default withBundleAnalyzer(nextConfig)
