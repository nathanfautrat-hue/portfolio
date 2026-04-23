// Resize and compress L'Ardoise photos for web use
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.join(__dirname, '..', 'images', 'lardoise');
const OUT = path.join(__dirname, '..', 'images', 'optimized');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const tasks = [
  // Hero — wide, landscape, big but compressed
  { src: 'hero-salle.jpg', out: 'hero-salle.jpg', width: 1920, quality: 82 },
  { src: 'hero-salle.jpg', out: 'hero-salle.webp', width: 1920, quality: 75, format: 'webp' },

  // About — portrait/landscape
  { src: 'about-gravlax.jpg', out: 'about-gravlax.jpg', width: 1400, quality: 82 },
  { src: 'about-gravlax.jpg', out: 'about-gravlax.webp', width: 1400, quality: 75, format: 'webp' },

  // Signatures — portrait 4:5 ratio
  { src: 'signature-saint-jacques.jpg', out: 'signature-saint-jacques.jpg', width: 1200, quality: 82 },
  { src: 'signature-saint-jacques.jpg', out: 'signature-saint-jacques.webp', width: 1200, quality: 75, format: 'webp' },

  { src: 'signature-ballotine.jpg', out: 'signature-ballotine.jpg', width: 1200, quality: 82 },
  { src: 'signature-ballotine.jpg', out: 'signature-ballotine.webp', width: 1200, quality: 75, format: 'webp' },

  { src: 'signature-dessert.jpg', out: 'signature-dessert.jpg', width: 1200, quality: 82 },
  { src: 'signature-dessert.jpg', out: 'signature-dessert.webp', width: 1200, quality: 75, format: 'webp' },
];

(async () => {
  for (const t of tasks) {
    const input = path.join(SRC, t.src);
    const output = path.join(OUT, t.out);
    const pipeline = sharp(input).rotate().resize({ width: t.width, withoutEnlargement: true });
    const final = t.format === 'webp'
      ? pipeline.webp({ quality: t.quality, effort: 5 })
      : pipeline.jpeg({ quality: t.quality, progressive: true, mozjpeg: true });
    await final.toFile(output);
    const { size } = fs.statSync(output);
    const meta = await sharp(output).metadata();
    console.log(`${t.out.padEnd(36)} ${meta.width}x${meta.height}  ${(size/1024).toFixed(0)} KB`);
  }
})().catch(e => { console.error(e); process.exit(1); });
