import { useState, useEffect } from 'react';

interface ImageInfo {
  id: number;
  src: string;
  alt: string;
}

/**
 * Hook para cargar imágenes dinámicamente desde la API
 */
export function useImages(category: 'hornos' | 'chimeneas' | 'fogatas') {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/images?category=${category}`);
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        } else {
          // Si no hay imágenes en la API, generar rutas esperadas como fallback
          const maxImages = category === 'chimeneas' ? 32 : 14;
          const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
          const fallbackImages: ImageInfo[] = [];
          
          for (let i = 1; i <= maxImages; i++) {
            // Intentar diferentes extensiones
            for (const ext of extensions) {
              fallbackImages.push({
                id: i,
                src: `/images/${category}/${category}${i}${ext}`,
                alt: `${category} ${i}`
              });
              break; // Solo agregar una por número
            }
          }
          
          setImages(fallbackImages);
        }
      } catch (error) {
        console.error(`Error loading images for ${category}:`, error);
        // Fallback: generar rutas esperadas
        const maxImages = category === 'chimeneas' ? 32 : 14;
        const fallbackImages: ImageInfo[] = [];
        
        for (let i = 1; i <= maxImages; i++) {
          fallbackImages.push({
            id: i,
            src: `/images/${category}/${category}${i}.jpg`,
            alt: `${category} ${i}`
          });
        }
        
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [category]);

  return { images, loading };
}

