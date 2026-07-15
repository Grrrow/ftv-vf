import sharp from 'sharp';
import path from 'path';

async function main() {
  const img1Path = path.resolve('src/assets/events_images/marmoran2.jpg');
  const img2Path = path.resolve('src/assets/events_images/pedrohalffter.jpg');
  const outPath = path.resolve('src/assets/events_images/marmoran2-halffter-final.png');

  const width = 400;
  const height = 600;

  // Normal crop for both (no small padding, just regular object-fit cover)
  const buf1 = await sharp(img1Path)
    .resize(width, height, { fit: 'cover', position: sharp.strategy.attention })
    .toBuffer();

  const buf2 = await sharp(img2Path)
    .resize(width, height, { fit: 'cover', position: sharp.strategy.attention })
    .toBuffer();

  const totalHeight = height * 2;

  await sharp({
    create: {
      width: width,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: buf1, left: 0, top: 0 },
      { input: buf2, left: 0, top: height }
    ])
    .png()
    .toFile(outPath);

  console.log(`Saved composite to ${outPath}`);
}

main().catch(console.error);
