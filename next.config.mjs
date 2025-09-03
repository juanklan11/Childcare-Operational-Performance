/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep any options you already had; add the block below:
  experimental: {
    // Prevent Next from bundling pdf-parse (which makes it look for local test files)
    serverComponentsExternalPackages: ['pdf-parse'],
  },

  // Optional but harmless: ensures we stay on Node APIs at build time
  output: 'standalone',
};

export default nextConfig;
