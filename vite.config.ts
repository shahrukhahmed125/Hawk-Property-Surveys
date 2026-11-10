import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          prePurchase: path.resolve(__dirname, 'pre-purchase-survey.html'),
          buildingCondition: path.resolve(__dirname, 'building-condition-survey.html'),
          dampMould: path.resolve(__dirname, 'damp-mould-survey.html'),
          timber: path.resolve(__dirname, 'timber-survey.html'),
          leakDetection: path.resolve(__dirname, 'leak-detection.html'),
          thermography: path.resolve(__dirname, 'thermography.html'),
          waterproofing: path.resolve(__dirname, 'waterproofing.html'),
          aerial: path.resolve(__dirname, 'aerial-survey.html'),
          cavityWall: path.resolve(__dirname, 'cavity-wall-survey.html'),
          partyWall: path.resolve(__dirname, 'party-wall-survey.html'),
          sampleReports: path.resolve(__dirname, 'sample-reports.html'),
          expertGuides: path.resolve(__dirname, 'expert-guides.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          locations: path.resolve(__dirname, 'locations.html'),
          faqs: path.resolve(__dirname, 'faqs.html'),
        },
      },
    },
  };
});
