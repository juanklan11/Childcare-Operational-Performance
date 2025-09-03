/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // required so the PDF parsers can be bundled server-side without file-system shenanigans
    serverComponentsExternalPackages: ["pdf-parse", "pdfjs-dist"]
  },
  // keep typechecking on so CI catches real mistakes
  typescript: {
    ignoreBuildErrors: false
  }
};

module.exports = nextConfig;
