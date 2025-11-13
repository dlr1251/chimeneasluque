const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { JSDOM } = require('jsdom');
const axios = require('axios');

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

// Descargar HTML del sitio
const fetchHTML = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
};

// Extraer URLs de imágenes del HTML
const extractImageUrls = (html, category) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const images = [];
  
  // Buscar todas las imágenes
  const imgTags = document.querySelectorAll('img');
  
  imgTags.forEach((img, index) => {
    let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    
    if (src) {
      // Convertir URLs relativas a absolutas
      if (src.startsWith('//')) {
        src = 'https:' + src;
      } else if (src.startsWith('/')) {
        src = 'https://www.chimeneasluque.com' + src;
      } else if (!src.startsWith('http')) {
        src = 'https://www.chimeneasluque.com/' + src;
      }
      
      // Filtrar imágenes por categoría basándose en la URL o contexto
      const lowerSrc = src.toLowerCase();
      if (category === 'hornos' && (lowerSrc.includes('horno') || lowerSrc.includes('oven'))) {
        images.push(src);
      } else if (category === 'chimeneas' && (lowerSrc.includes('chimenea') || lowerSrc.includes('fireplace'))) {
        images.push(src);
      } else if (category === 'fogatas' && (lowerSrc.includes('fogata') || lowerSrc.includes('bonfire'))) {
        images.push(src);
      }
    }
  });
  
  // Si no encontramos imágenes específicas, buscar en contenedores por ID o clase
  const categorySelectors = {
    hornos: ['#hornos', '.hornos', '[id*="horno"]', '[class*="horno"]'],
    chimeneas: ['#chimeneas', '.chimeneas', '[id*="chimenea"]', '[class*="chimenea"]'],
    fogatas: ['#fogatas', '.fogatas', '[id*="fogata"]', '[class*="fogata"]']
  };
  
  categorySelectors[category].forEach(selector => {
    try {
      const section = document.querySelector(selector);
      if (section) {
        const sectionImages = section.querySelectorAll('img');
        sectionImages.forEach(img => {
          let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
          if (src && !images.includes(src)) {
            if (src.startsWith('//')) {
              src = 'https:' + src;
            } else if (src.startsWith('/')) {
              src = 'https://www.chimeneasluque.com' + src;
            } else if (!src.startsWith('http')) {
              src = 'https://www.chimeneasluque.com/' + src;
            }
            images.push(src);
          }
        });
      }
    } catch (e) {
      // Ignorar errores de selector
    }
  });
  
  // Eliminar duplicados
  return [...new Set(images)];
};

// Descargar una imagen
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    // Filtrar URLs que no sean imágenes
    if (!url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !url.includes('image')) {
      // Si la URL no tiene extensión, asumimos que es una imagen y agregamos .jpg
      if (!filepath.endsWith('.jpg') && !filepath.endsWith('.png') && !filepath.endsWith('.gif')) {
        filepath += '.jpg';
      }
    }
    
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Seguir redirecciones
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(new Error(`Failed to download: ${url} - Status: ${response.statusCode}`));
        return;
      }
      
      // Detectar tipo de contenido
      const contentType = response.headers['content-type'];
      if (contentType && contentType.startsWith('image/')) {
        const ext = contentType.split('/')[1].split(';')[0];
        if (ext !== 'jpeg' && ext !== 'png' && ext !== 'gif' && ext !== 'webp') {
          // Mantener la extensión original del archivo
        } else {
          // Actualizar extensión si es necesario
          const currentExt = path.extname(filepath).substring(1);
          if (currentExt !== ext && !filepath.endsWith(ext)) {
            filepath = filepath.replace(/\.[^.]+$/, `.${ext}`);
            const newFile = fs.createWriteStream(filepath);
            response.pipe(newFile);
            newFile.on('finish', () => {
              newFile.close();
              console.log(`Downloaded: ${filepath}`);
              resolve();
            });
            return;
          }
        }
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
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

// Función principal
const main = async () => {
  createDirectories();
  
  console.log('Fetching website content...');
  const baseUrl = 'https://www.chimeneasluque.com';
  const html = await fetchHTML(baseUrl);
  
  if (!html) {
    console.error('Failed to fetch website HTML');
    return;
  }
  
  console.log('Extracting image URLs...');
  
  const categories = ['hornos', 'chimeneas', 'fogatas'];
  const imageMap = {};
  
  for (const category of categories) {
    console.log(`\nProcessing ${category}...`);
    const urls = extractImageUrls(html, category);
    imageMap[category] = urls;
    console.log(`Found ${urls.length} images for ${category}`);
    
    if (urls.length === 0) {
      console.log(`No images found for ${category}, trying alternative method...`);
      // Si no encontramos imágenes específicas, buscar todas las imágenes
      const allUrls = extractImageUrls(html, 'all');
      imageMap[category] = allUrls.slice(0, category === 'chimeneas' ? 32 : 14);
    }
  }
  
  // Descargar imágenes
  console.log('\nStarting downloads...');
  
  for (const [category, urls] of Object.entries(imageMap)) {
    if (urls.length === 0) {
      console.log(`\nSkipping ${category} - no images found`);
      continue;
    }
    
    console.log(`\nDownloading ${category}...`);
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const urlObj = new URL(url);
      const extension = path.extname(urlObj.pathname) || '.jpg';
      const filename = `${category}${i + 1}${extension}`;
      const filepath = path.join('public', 'images', category, filename);
      
      // Si la imagen ya existe, saltarla
      if (fs.existsSync(filepath)) {
        console.log(`Skipped (exists): ${filename}`);
        continue;
      }
      
      try {
        await downloadImage(url, filepath);
        // Esperar un poco entre descargas
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
      }
    }
  }
  
  console.log('\nDownload process completed!');
  console.log('\nSummary:');
  for (const [category, urls] of Object.entries(imageMap)) {
    const files = fs.readdirSync(path.join('public', 'images', category))
      .filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    console.log(`${category}: ${files.length} images downloaded`);
  }
};

main().catch(console.error);

