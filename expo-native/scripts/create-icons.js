const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const { spawn } = require('child_process');

// Create a simple colored square PNG using pure JavaScript
// This creates a 1024x1024 PNG with the app logo colors

function createSimplePNG(width, height, color, filename) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // For simplicity, we'll create a 1x1 pixel PNG and let the user know
  // to replace it with proper icons
  
  // Minimal 1x1 PNG
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width = 1
    0x00, 0x00, 0x00, 0x01, // height = 1
    0x08, 0x02,             // bit depth = 8, color type = 2 (RGB)
    0x00, 0x00, 0x00,       // compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // IHDR CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0xD7, 0x63,       // compressed data
    (color.r >> 16) & 0xFF, // R
    (color.g >> 8) & 0xFF,  // G
    color.b & 0xFF,         // B
    0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, // more compressed
    0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND
  ]);
  
  // Actually, let's use a different approach - create data URL style minimal PNG
  // Using pre-computed 1x1 PNG for each color
  
  const colors = {
    dark: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
    lime: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64'),
  };
  
  return colors.dark; // placeholder
}

async function generateIcons() {
  const assetsDir = path.join(__dirname, '..', 'assets', 'images');
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('📱 Generating placeholder PNG icons...\n');
  
  // Check if sharp is available
  try {
    const sharp = require('sharp');
    
    // Create icon.png (1024x1024)
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 3,
        background: { r: 9, g: 9, b: 11 }
      }
    })
    .composite([{
      input: {
        create: {
          width: 512,
          height: 512,
          channels: 3,
          background: { r: 26, g: 45, b: 10 }
        }
      },
      top: 256,
      left: 256
    }, {
      input: {
        create: {
          width: 48,
          height: 48,
          channels: 3,
          background: { r: 163, g: 230, b: 53 }
        }
      },
      top: 400,
      left: 488
    }])
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
    
    // Create splash-icon.png (2048x2048)
    await sharp({
      create: {
        width: 2048,
        height: 2048,
        channels: 3,
        background: { r: 9, g: 9, b: 11 }
      }
    })
    .composite([{
      input: {
        create: {
          width: 1024,
          height: 1024,
          channels: 3,
          background: { r: 163, g: 230, b: 53 }
        }
      },
      top: 512,
      left: 512
    }])
    .png()
    .toFile(path.join(assetsDir, 'splash-icon.png'));
    
    // Create adaptive-icon.png (1024x1024)
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 3,
        background: { r: 9, g: 9, b: 11 }
      }
    })
    .composite([{
      input: {
        create: {
          width: 512,
          height: 512,
          channels: 3,
          background: { r: 163, g: 230, b: 53 }
        }
      },
      top: 256,
      left: 256
    }])
    .png()
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    
    // Create favicon.png (32x32)
    await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 3,
        background: { r: 163, g: 230, b: 53 }
      }
    })
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
    
    console.log('✅ Icons generated successfully with sharp!\n');
    
  } catch (err) {
    console.log('⚠️  sharp not available, creating simple placeholders...\n');
    
    // Create minimal valid PNG files (1x1 pixel)
    // Dark background PNG
    const darkPNG = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xD7, 0x63, 0x09, 0x09, 0x09, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    // Lime color PNG
    const limePNG = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xD7, 0x63, 0xA3, 0xE6, 0x35, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(path.join(assetsDir, 'icon.png'), darkPNG);
    fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), limePNG);
    fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), limePNG);
    fs.writeFileSync(path.join(assetsDir, 'favicon.png'), limePNG);
    
    console.log('⚠️  Created 1x1 placeholder PNG files\n');
    console.log('📝 To generate proper icons, run:');
    console.log('   npx expo-generate-icon\n');
    console.log('Or install sharp:');
    console.log('   pnpm add sharp\n');
  }
}

generateIcons().catch(console.error);
