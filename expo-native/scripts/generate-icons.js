const fs = require('fs');
const path = require('path');

// Simple PNG generator for placeholder icons
// Creates a 1024x1024 PNG with neon lime logo on dark background

function createPNG() {
  // Minimal valid PNG with solid color (1x1 pixel, then we'll describe what to do)
  console.log('Creating placeholder icons...');
  
  // For now, create simple SVG files that Expo can use
  const iconSVG = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" rx="256" fill="#09090b"/>
    <rect x="256" y="256" width="512" height="512" rx="128" fill="#1a2d0a"/>
    <path d="M512 384L512 640" stroke="#a3e635" stroke-width="48" stroke-linecap="round"/>
    <circle cx="512" cy="448" r="32" fill="#a3e635"/>
    <circle cx="512" cy="576" r="32" fill="#a3e635"/>
  </svg>`;

  const splashSVG = `<svg width="2048" height="2048" viewBox="0 0 2048 2048" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="2048" height="2048" fill="#09090b"/>
    <rect x="512" y="512" width="1024" height="1024" rx="256" fill="#1a2d0a"/>
    <path d="M1024 768L1024 1280" stroke="#a3e635" stroke-width="96" stroke-linecap="round"/>
    <circle cx="1024" cy="896" r="64" fill="#a3e635"/>
    <circle cx="1024" cy="1152" r="64" fill="#a3e635"/>
  </svg>`;

  const adaptiveSVG = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" fill="#09090b"/>
    <rect x="256" y="256" width="512" height="512" rx="128" fill="#a3e635"/>
  </svg>`;

  const faviconSVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#a3e635"/>
  </svg>`;

  const assetsDir = path.join(__dirname, '..', 'assets', 'images');
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSVG);
  fs.writeFileSync(path.join(assetsDir, 'splash-icon.svg'), splashSVG);
  fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), adaptiveSVG);
  fs.writeFileSync(path.join(assetsDir, 'favicon.svg'), faviconSVG);

  console.log('✓ SVG icons created in assets/images/');
  console.log('\n⚠ To create PNG files, run one of these:');
  console.log('  - npx expo-generate-icon (recommended)');
  console.log('  - Use an online SVG to PNG converter');
  console.log('  - Use ImageMagick: convert icon.svg icon.png');
}

createPNG();
