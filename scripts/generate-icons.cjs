/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.promises.copyFile(src, dest);
}

async function main() {
  const projectRoot = path.join(__dirname, "..");
  const srcPng = path.join(projectRoot, "assets", "logo.png");
  const outDir = path.join(projectRoot, "electron", "assets");
  const outPng = path.join(outDir, "icon.png");
  const outIco = path.join(outDir, "icon.ico");

  await ensureDir(outDir);

  // Always provide a PNG icon (Linux, window icon fallback)
  await copyFile(srcPng, outPng);
  console.log("✓ Wrote", path.relative(projectRoot, outPng));

  // Generate ICO for Windows installer/taskbar
  let pngToIco;
  try {
    pngToIco = require("png-to-ico");
  } catch {
    console.error(
      "Missing devDependency png-to-ico. Run: npm i -D png-to-ico (needed for Windows icon).",
    );
    process.exit(1);
  }

  const buf = await pngToIco(srcPng);
  await fs.promises.writeFile(outIco, buf);
  console.log("✓ Wrote", path.relative(projectRoot, outIco));
}

main().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});
