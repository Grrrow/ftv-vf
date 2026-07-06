import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSocialCard() {
  const assetsDir = path.join(__dirname, '..', 'src', 'assets', 'events_images');
  const outputFilePath = path.join(__dirname, '..', 'public', 'og-artists.jpg');

  // Las tres imágenes que tenemos disponibles
  const images = [
    path.join(assetsDir, 'Pablo Sainz - Villegas.webp'),
    path.join(assetsDir, 'Mirei Tsuji.jpg'),
    path.join(assetsDir, 'niklas liepe.webp')
  ];

  console.log('Generando imagen Open Graph (1200x630)...');

  // Cada imagen ocupará 1/3 del ancho (400px) y todo el alto (630px)
  const width = 1200;
  const height = 630;
  const colWidth = width / 3;

  try {
    // Redimensionar y recortar (cover) cada imagen
    const processedImages = await Promise.all(
      images.map(async (imgPath) => {
        const buffer = await sharp(imgPath)
          .resize({ width: colWidth, height: height, fit: 'cover', position: 'entropy' })
          .toBuffer();
        return buffer;
      })
    );

    // Componer las 3 imágenes en un solo canvas negro
    await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 11, g: 19, b: 43, alpha: 1 } // Midnight color
      }
    })
    .composite([
      { input: processedImages[0], left: 0, top: 0 },
      { input: processedImages[1], left: colWidth, top: 0 },
      { input: processedImages[2], left: colWidth * 2, top: 0 }
    ])
    .jpeg({ quality: 90 })
    .toFile(outputFilePath);

    console.log(`✅ Imagen generada correctamente en: ${outputFilePath}`);
  } catch (err) {
    console.error('❌ Error al generar la imagen:', err);
  }
}

generateSocialCard();
