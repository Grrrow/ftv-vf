import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const getSiteURL = () => {
  // Lógica específica para Vercel según las directrices:
  // "el año actual sera master"
  const branch = process.env.VERCEL_GIT_COMMIT_REF;
  
  if (!branch) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_URL) {
      return 'https://musicaenvillafranca.com';
    }
    return 'http://localhost:4321'; // Desarrollo local
  }
  
  if (branch === 'master' || branch === 'main') {
    return 'https://musicaenvillafranca.com';
  }
  
  return `https://${branch}.musicaenvillafranca.com`;
};

// https://astro.build/config
export default defineConfig({
  site: getSiteURL(),
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always'
  }
});