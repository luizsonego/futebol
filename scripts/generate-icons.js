const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Criar um SVG simples para o ícone
const createIconSVG = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">⚽</text>
</svg>`;
};

// Criar diretório se não existir
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sizes = [192, 512];

async function generateIcons() {
  for (const size of sizes) {
    const svgContent = Buffer.from(createIconSVG(size));
    const pngPath = path.join(publicDir, `icon-${size}.png`);
    
    await sharp(svgContent)
      .png()
      .resize(size, size)
      .toFile(pngPath);
    
    console.log(`✓ Criado: icon-${size}.png`);
  }
  
  // Criar também favicon.ico (usando o tamanho 192)
  const faviconSvg = Buffer.from(createIconSVG(32));
  const faviconPath = path.join(publicDir, 'favicon.ico');
  
  await sharp(faviconSvg)
    .png()
    .resize(32, 32)
    .toFile(faviconPath.replace('.ico', '.png'));
  
  console.log(`✓ Criado: favicon.png`);
  console.log('\n✅ Todos os ícones foram gerados com sucesso!');
}

generateIcons().catch(console.error);

