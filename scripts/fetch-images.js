const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Crear carpetas
const createDirectories = () => {
  ['public/images/hornos', 'public/images/chimeneas', 'public/images/fogatas'].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created: ${dir}`);
    }
  });
};

// Descargar HTML
const fetchHTML = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    let data = '';
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

// Extraer URLs de imágenes usando regex básico
const extractImageUrls = (html) => {
  const urls = [];
  // Buscar todas las URLs de imágenes en el HTML
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  const dataSrcRegex = /data-src=["']([^"']+)["']/gi;
  const dataLazyRegex = /data-lazy-src=["']([^"']+)["']/gi;
  
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  while ((match = dataSrcRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  while ((match = dataLazyRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  
  // Limpiar y normalizar URLs
  return urls.map(url => {
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return 'https://www.chimeneasluque.com' + url;
    if (!url.startsWith('http')) return 'https://www.chimeneasluque.com/' + url;
    return url;
  }).filter((url, index, self) => self.indexOf(url) === index);
};

// Descargar imagen
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        return reject(new Error(`Status ${res.statusCode}`));
      }
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
};

// Clasificar imágenes por categoría
const classifyImages = (urls) => {
  const categories = {
    hornos: [],
    chimeneas: [],
    fogatas: [],
    other: []
  };
  
  urls.forEach(url => {
    const lower = url.toLowerCase();
    if (lower.includes('horno') || lower.includes('oven')) {
      categories.hornos.push(url);
    } else if (lower.includes('chimenea') || lower.includes('fireplace')) {
      categories.chimeneas.push(url);
    } else if (lower.includes('fogata') || lower.includes('bonfire')) {
      categories.fogatas.push(url);
    } else if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      categories.other.push(url);
    }
  });
  
  return categories;
};

// Función para intentar descargar imágenes usando patrones comunes
const tryDownloadByPattern = async (baseUrl, category, count) => {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const patterns = [
    (i, ext) => `${baseUrl}/images/${category}/${category}${i}${ext}`,
    (i, ext) => `${baseUrl}/images/${category}/${category}-${i}${ext}`,
    (i, ext) => `${baseUrl}/images/${category}/${i}${ext}`,
    (i, ext) => `${baseUrl}/assets/images/${category}/${category}${i}${ext}`,
    (i, ext) => `${baseUrl}/img/${category}/${category}${i}${ext}`,
    (i, ext) => `${baseUrl}/wp-content/uploads/${category}/${category}${i}${ext}`,
  ];
  
  let downloaded = 0;
  
  for (let i = 1; i <= count; i++) {
    const filename = `${category}${i}.jpg`;
    const filepath = path.join('public', 'images', category, filename);
    
    if (fs.existsSync(filepath)) {
      console.log(`⊘ Skipped (exists): ${filename}`);
      downloaded++;
      continue;
    }
    
    let success = false;
    for (const pattern of patterns) {
      for (const ext of extensions) {
        try {
          const url = pattern(i, ext);
          await downloadImage(url, filepath);
          downloaded++;
          success = true;
          await new Promise(r => setTimeout(r, 300));
          break;
        } catch (error) {
          // Continuar con el siguiente patrón
          continue;
        }
      }
      if (success) break;
    }
    
    if (!success) {
      console.log(`✗ Could not find image ${i} for ${category}`);
    }
  }
  
  return downloaded;
};

// Función principal
const main = async () => {
  console.log('🔍 Fetching website...');
  createDirectories();
  
  const baseUrl = 'https://www.chimeneasluque.com';
  
  try {
    const html = await fetchHTML(baseUrl);
    console.log('✓ HTML fetched');
    
    const allUrls = extractImageUrls(html);
    console.log(`✓ Found ${allUrls.length} image URLs in HTML`);
    
    const categories = classifyImages(allUrls);
    console.log('\n📊 Image categories found in HTML:');
    console.log(`  Hornos: ${categories.hornos.length}`);
    console.log(`  Chimeneas: ${categories.chimeneas.length}`);
    console.log(`  Fogatas: ${categories.fogatas.length}`);
    console.log(`  Other: ${categories.other.length}`);
    
    // Descargar imágenes encontradas en HTML
    for (const [category, urls] of Object.entries(categories)) {
      if (category === 'other' || urls.length === 0) continue;
      
      console.log(`\n📥 Downloading ${category} from HTML...`);
      const maxImages = category === 'chimeneas' ? 32 : 14;
      const imagesToDownload = urls.slice(0, maxImages);
      
      for (let i = 0; i < imagesToDownload.length; i++) {
        const url = imagesToDownload[i];
        try {
          const urlObj = new URL(url);
          const ext = path.extname(urlObj.pathname) || '.jpg';
          const filename = `${category}${i + 1}${ext}`;
          const filepath = path.join('public', 'images', category, filename);
          
          if (fs.existsSync(filepath)) {
            console.log(`⊘ Skipped (exists): ${filename}`);
            continue;
          }
          
          await downloadImage(url, filepath);
          await new Promise(r => setTimeout(r, 500));
        } catch (error) {
          console.log(`✗ Failed: ${url} - ${error.message}`);
        }
      }
    }
    
    // Si no encontramos suficientes imágenes, intentar con patrones comunes
    console.log('\n🔍 Trying common URL patterns...');
    const categoryCounts = {
      hornos: 14,
      chimeneas: 32,
      fogatas: 14
    };
    
    for (const [category, count] of Object.entries(categoryCounts)) {
      const dir = path.join('public', 'images', category);
      const existingFiles = fs.existsSync(dir) 
        ? fs.readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        : [];
      
      if (existingFiles.length < count) {
        console.log(`\n📥 Trying to download more ${category} images...`);
        const downloaded = await tryDownloadByPattern(baseUrl, category, count);
        console.log(`  Downloaded ${downloaded} ${category} images`);
      }
    }
    
    console.log('\n✅ Done!');
    
    // Resumen
    console.log('\n📊 Summary:');
    for (const category of ['hornos', 'chimeneas', 'fogatas']) {
      const dir = path.join('public', 'images', category);
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i));
        console.log(`  ${category}: ${files.length} images`);
      } else {
        console.log(`  ${category}: 0 images`);
      }
    }
    
    if (fs.existsSync(path.join('public', 'images', 'hornos'))) {
      const hornosFiles = fs.readdirSync(path.join('public', 'images', 'hornos')).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i));
      const chimeneasFiles = fs.existsSync(path.join('public', 'images', 'chimeneas'))
        ? fs.readdirSync(path.join('public', 'images', 'chimeneas')).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        : [];
      const fogatasFiles = fs.existsSync(path.join('public', 'images', 'fogatas'))
        ? fs.readdirSync(path.join('public', 'images', 'fogatas')).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        : [];
      
      const total = hornosFiles.length + chimeneasFiles.length + fogatasFiles.length;
      
      if (total === 0) {
        console.log('\n⚠️  No images were downloaded.');
        console.log('💡 You may need to manually download images. See README-IMAGES.md for instructions.');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n💡 Tip: You may need to manually download images. See README-IMAGES.md');
  }
};

main();

