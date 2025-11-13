import fs from 'fs';
import path from 'path';

export interface ImageInfo {
  src: string;
  alt: string;
  id: number;
}

/**
 * Obtiene la lista de imágenes disponibles para una categoría
 * En producción, esto podría venir de un CMS o API
 */
export function getImagesForCategory(category: 'hornos' | 'chimeneas' | 'fogatas'): ImageInfo[] {
  const images: ImageInfo[] = [];
  const publicPath = path.join(process.cwd(), 'public', 'images', category);
  
  // En tiempo de ejecución, las imágenes estarán en public/images/
  // Pero no podemos usar fs en el cliente, así que usamos rutas estáticas
  // Por ahora, retornamos un array con las rutas esperadas
  const maxImages = category === 'chimeneas' ? 32 : 14;
  
  for (let i = 1; i <= maxImages; i++) {
    // Intentar diferentes extensiones
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    let imageFound = false;
    
    for (const ext of extensions) {
      const imagePath = `/images/${category}/${category}${i}${ext}`;
      images.push({
        src: imagePath,
        alt: `${category} ${i}`,
        id: i
      });
      imageFound = true;
      break; // Solo necesitamos una imagen por índice
    }
  }
  
  return images;
}

/**
 * Verifica si una imagen existe en el servidor
 * Solo funciona en el servidor (getServerSideProps, getStaticProps, API routes)
 */
export function checkImageExists(imagePath: string): boolean {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

