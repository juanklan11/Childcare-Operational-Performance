/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep both external so Next doesn't bundle them (which can break on Vercel)
    serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  },
  // Standalone output keeps the server environment predictable for Node libs
  output: 'standalone',
};

export default nextConfig;
