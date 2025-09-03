/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // keep pdf parsers server-side friendly
    serverComponentsExternalPackages: ["pdf-parse", "pdfjs-dist"]
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

module.exports = nextConfig;
