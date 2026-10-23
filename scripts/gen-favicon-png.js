const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const svgPath = path.join(__dirname, "../public/favicon.svg");
const outDir = path.join(__dirname, "../src/app");

async function main() {
  const svgBuffer = fs.readFileSync(svgPath);

  // 32×32 for standard favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(outDir, "favicon.png"));
  console.log("✓ favicon.png (32×32)");

  // 192×192 for Next.js icon.png (auto-served as favicon + PWA)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(outDir, "icon.png"));
  console.log("✓ icon.png (192×192)");

  // 512×512 for apple-icon.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, "apple-icon.png"));
  console.log("✓ apple-icon.png (512×512)");

  // Also copy 192 to public for direct access
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, "../public/icon-192.png"));
  console.log("✓ public/icon-192.png (192×192)");

  console.log("\nDone! PNG favicons generated.");
}

main().catch(console.error);
