/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver complètement l'export statique pour le développement
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Ensure trailing slashes are added to URLs
  trailingSlash: true,
  // Désactiver la génération statique pour les routes dynamiques
  experimental: {
    // Cela permet de contourner les erreurs de génération de chemins statiques
    disableStaticGenerationForPaths: true
  }
};

module.exports = nextConfig;
