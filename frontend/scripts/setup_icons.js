import fs from 'fs';
import path from 'path';
import { Jimp, rgbaToInt } from 'jimp';

async function setupIcons() {
  const assetsDir = path.join(process.cwd(), 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }

  // 1. Convert JPG to assets/icon.png
  const sourceImage = path.join(process.cwd(), 'public', 'mobile-icon.jpg');
  console.log('Reading source image...', sourceImage);
  const image = await Jimp.read(sourceImage);
  image.resize({ w: 1024, h: 1024 });
  await image.write(path.join(assetsDir, 'icon.png'));
  console.log('App icon saved to assets/icon.png');

  // 2. Generate a simple white notification icon for Android
  console.log('Generating ic_notification.png...');
  // A solid white circle for a sleek minimalist look, or a white 'E'.
  // We'll create a 96x96 transparent image with a 72x72 white circle inside
  const notifIcon = new Jimp({ width: 96, height: 96, color: 0x00000000 });
  const whiteColor = rgbaToInt(255, 255, 255, 255);
  const center = 48;
  const radius = 36;
  
  for (let y = 0; y < 96; y++) {
    for (let x = 0; x < 96; x++) {
      const dist = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
      if (dist <= radius) {
        notifIcon.setPixelColor(whiteColor, x, y);
      }
    }
  }

  // Draw an 'E' cutout (transparent) inside the white circle
  const transparentColor = 0x00000000;
  // Simple 'E' shape
  for (let y = 30; y < 66; y++) {
    for (let x = 30; x < 66; x++) {
       // Vertical stem
       if (x >= 32 && x <= 42) notifIcon.setPixelColor(transparentColor, x, y);
       // Top bar
       if (y >= 30 && y <= 40 && x >= 32 && x <= 64) notifIcon.setPixelColor(transparentColor, x, y);
       // Middle bar
       if (y >= 44 && y <= 52 && x >= 32 && x <= 54) notifIcon.setPixelColor(transparentColor, x, y);
       // Bottom bar
       if (y >= 56 && y <= 66 && x >= 32 && x <= 64) notifIcon.setPixelColor(transparentColor, x, y);
    }
  }

  const drawableDir = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'res', 'drawable');
  if (!fs.existsSync(drawableDir)) fs.mkdirSync(drawableDir, { recursive: true });
  await notifIcon.write(path.join(drawableDir, 'ic_notification.png'));
  console.log('Notification icon saved to drawable/ic_notification.png');
}

setupIcons().catch(console.error);
