/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver complètement l'export statique pour le développement
  // output: 'export',
  // Use 'standalone' output for better handling of dynamic routes
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Ensure trailing slashes are added to URLs
  trailingSlash: true,
  // Removed unsupported experimental option 'disableStaticGenerationForPaths'
  // If you need to handle dynamic routes, use the 'output' setting above
  experimental: {
    // Empty for now, add supported experimental features here if needed
  }
};

module.exports = nextConfig;
