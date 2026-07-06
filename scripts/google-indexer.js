import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración inicial
const KEY_FILE = path.join(__dirname, '..', 'service_account.json');
const SITEMAP_PATH = path.join(__dirname, '..', 'dist', 'sitemap-0.xml');
const BATCH_SIZE = 100; // Límite por request en la API

async function getUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(`No se encontró el sitemap en ${SITEMAP_PATH}. Asegúrate de ejecutar 'npm run build' primero.`);
  }

  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  // Extraer todas las URLs dentro de las etiquetas <loc> usando regex
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  const urls = [];

  while ((match = regex.exec(sitemapContent)) !== null) {
    let url = match[1];
    if (url.includes('localhost')) {
      url = url.replace(/http:\/\/localhost:\d+/, 'https://www.musicaenvillafranca.com');
    }
    urls.push(url);
  }

  return urls;
}

async function indexUrls() {
  console.log('🎵 Iniciando Google Indexing Script...');

  if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ ERROR: No se ha encontrado el archivo service_account.json en la raíz del proyecto.');
    console.error('Sigue las instrucciones proporcionadas por el asistente para obtenerlo.');
    process.exit(1);
  }

  let urls = [];
  try {
    urls = await getUrlsFromSitemap();
    console.log(`✅ Se encontraron ${urls.length} URLs en el sitemap.`);
  } catch (err) {
    console.error('❌ ERROR al leer el sitemap:', err.message);
    process.exit(1);
  }

  const jwtClient = new google.auth.JWT({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  console.log('⏳ Autenticando con Google Cloud...');
  
  try {
    await jwtClient.authorize();
    console.log('✅ Autenticación completada con éxito.');
  } catch (err) {
    console.error('❌ ERROR en la autenticación:', err.message);
    process.exit(1);
  }

  const indexing = google.indexing({ version: 'v3', auth: jwtClient });

  console.log(`🚀 Enviando URLs a Google Search Console...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      successCount++;
      console.log(`[${i+1}/${urls.length}] 🟢 OK: ${url}`);
    } catch (error) {
      errorCount++;
      console.error(`[${i+1}/${urls.length}] 🔴 ERROR en: ${url}`);
      if (error.response && error.response.data && error.response.data.error) {
         console.error(`   Motivo: ${error.response.data.error.message}`);
      } else {
         console.error(`   Motivo: ${error.message}`);
      }
    }
    
    // Pequeño delay para no saturar la API
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=======================================');
  console.log('🎯 RESULTADOS FINALES:');
  console.log(`✅ Éxitos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log('=======================================');
  console.log('NOTA: Aunque se hayan enviado con éxito, Google decide cuándo rastrearlas, pero esto les da la máxima prioridad posible. Habitualmente estarán indexadas entre unos minutos y un par de horas.');
}

indexUrls();
