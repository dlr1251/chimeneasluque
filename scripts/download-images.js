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

// Descargar una imagen
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Seguir redirecciones
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${url} - Status: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
};

// URLs de imágenes del sitio web de Chimeneas Luque
// Estas URLs son aproximadas basadas en la estructura típica de sitios web
// Puedes ajustarlas después de inspeccionar el sitio real

const imageUrls = {
  hornos: [
    // URLs típicas - necesitarás actualizar estas con las URLs reales del sitio
    // Puedes obtenerlas inspeccionando el sitio web en el navegador
    'https://www.chimeneasluque.com/images/hornos/horno1.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno2.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno3.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno4.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno5.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno6.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno7.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno8.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno9.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno10.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno11.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno12.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno13.jpg',
    'https://www.chimeneasluque.com/images/hornos/horno14.jpg',
  ],
  chimeneas: Array.from({ length: 32 }, (_, i) => 
    `https://www.chimeneasluque.com/images/chimeneas/chimenea${i + 1}.jpg`
  ),
  fogatas: Array.from({ length: 14 }, (_, i) => 
    `https://www.chimeneasluque.com/images/fogatas/fogata${i + 1}.jpg`
  )
};

// Función principal
const main = async () => {
  createDirectories();
  
  console.log('Starting image downloads...');
  
  for (const [category, urls] of Object.entries(imageUrls)) {
    console.log(`\nDownloading ${category}...`);
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const extension = path.extname(url) || '.jpg';
      const filename = `${category}${i + 1}${extension}`;
      const filepath = path.join('public', 'images', category, filename);
      
      // Si la imagen ya existe, saltarla
      if (fs.existsSync(filepath)) {
        console.log(`Skipped (exists): ${filename}`);
        continue;
      }
      
      try {
        await downloadImage(url, filepath);
        // Esperar un poco entre descargas para no sobrecargar el servidor
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
        // Continuar con la siguiente imagen incluso si esta falla
      }
    }
  }
  
  console.log('\nDownload process completed!');
};

main().catch(console.error);

