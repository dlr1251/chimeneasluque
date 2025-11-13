const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Crear carpetas si no existen
const createDirectories = () => {
  const dirs = [
    'public/images/hornos',
    'public/images/chimeneas',
    'public/images/fogatas'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Función para descargar una imagen
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    // Asegurar que la URL sea absoluta
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('//')) {
        url = 'https:' + url;
      } else if (url.startsWith('/')) {
        url = 'https://www.chimeneasluque.com' + url;
      } else {
        url = 'https://www.chimeneasluque.com/' + url;
      }
    }
    
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Referer': 'https://www.chimeneasluque.com/'
      },
      timeout: 30000
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        const location = response.headers.location;
        return downloadImage(location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(new Error(`Failed to download: ${url} - Status: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(new Error('Download timeout'));
    });
  });
};

// URLs de imágenes - Estas son URLs comunes que podemos intentar
// Necesitarás inspeccionar el sitio web real para obtener las URLs exactas
const tryImageUrls = async (baseUrl, category, count) => {
  const urls = [];
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  // Intentar diferentes patrones de URLs
  const patterns = [
    // Patrón 1: /images/category/image1.jpg
    (i) => `${baseUrl}/images/${category}/${category}${i}${extensions[0]}`,
    (i) => `${baseUrl}/images/${category}/${category}${i}${extensions[1]}`,
    (i) => `${baseUrl}/images/${category}/${category}${i}${extensions[2]}`,
    (i) => `${baseUrl}/images/${category}/${category}${i}${extensions[3]}`,
    // Patrón 2: /images/category/image-1.jpg
    (i) => `${baseUrl}/images/${category}/${category}-${i}${extensions[0]}`,
    (i) => `${baseUrl}/images/${category}/${category}-${i}${extensions[1]}`,
    // Patrón 3: /images/category/1.jpg
    (i) => `${baseUrl}/images/${category}/${i}${extensions[0]}`,
    (i) => `${baseUrl}/images/${category}/${i}${extensions[1]}`,
    // Patrón 4: /assets/images/category/image1.jpg
    (i) => `${baseUrl}/assets/images/${category}/${category}${i}${extensions[0]}`,
    (i) => `${baseUrl}/assets/images/${category}/${category}${i}${extensions[1]}`,
    // Patrón 5: /img/category/image1.jpg
    (i) => `${baseUrl}/img/${category}/${category}${i}${extensions[0]}`,
    (i) => `${baseUrl}/img/${category}/${category}${i}${extensions[1]}`,
  ];
  
  // Intentar verificar si las URLs existen (solo para las primeras imágenes)
  console.log(`\nTrying to find images for ${category}...`);
  
  // Por ahora, vamos a intentar descargar con los patrones más comunes
  // En producción, deberías inspeccionar el sitio web primero para obtener las URLs reales
  for (let i = 1; i <= count; i++) {
    // Intentar cada patrón hasta encontrar uno que funcione
    let downloaded = false;
    for (const pattern of patterns) {
      try {
        const url = pattern(i);
        const extension = url.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
        const filename = `${category}${i}${extension}`;
        const filepath = path.join('public', 'images', category, filename);
        
        // Si ya existe, saltarla
        if (fs.existsSync(filepath)) {
          console.log(`⊘ Skipped (exists): ${filename}`);
          downloaded = true;
          break;
        }
        
        // Intentar descargar
        await downloadImage(url, filepath);
        downloaded = true;
        urls.push(url);
        break;
      } catch (error) {
        // Continuar con el siguiente patrón
        continue;
      }
    }
    
    if (!downloaded) {
      console.log(`✗ Could not find image ${i} for ${category}`);
    }
    
    // Esperar un poco entre descargas
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return urls;
};

// Función principal
const main = async () => {
  console.log('Starting image download process...\n');
  createDirectories();
  
  const baseUrl = 'https://www.chimeneasluque.com';
  
  // Intentar descargar imágenes por categoría
  // Nota: Este script intentará diferentes patrones de URLs
  // Si no encuentra las imágenes, necesitarás inspeccionar el sitio web manualmente
  // y proporcionar las URLs exactas
  
  const categories = [
    { name: 'hornos', count: 14 },
    { name: 'chimeneas', count: 32 },
    { name: 'fogatas', count: 14 }
  ];
  
  console.log('\n⚠️  NOTA: Este script intentará descargar imágenes usando patrones comunes.');
  console.log('Si no se encuentran imágenes, necesitarás:');
  console.log('1. Inspeccionar el sitio web https://www.chimeneasluque.com en el navegador');
  console.log('2. Abrir las herramientas de desarrollador (F12)');
  console.log('3. Buscar las URLs reales de las imágenes en la pestaña Network');
  console.log('4. Actualizar este script con las URLs reales\n');
  
  for (const category of categories) {
    console.log(`\n=== Processing ${category.name.toUpperCase()} ===`);
    await tryImageUrls(baseUrl, category.name, category.count);
  }
  
  console.log('\n✅ Download process completed!');
  console.log('\nSummary:');
  for (const category of categories) {
    const categoryPath = path.join('public', 'images', category.name);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath).filter(f => 
        f.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );
      console.log(`${category.name}: ${files.length} images`);
    } else {
      console.log(`${category.name}: 0 images`);
    }
  }
};

main().catch(console.error);

