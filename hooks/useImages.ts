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
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
          // Solo usar imágenes que realmente existen según la API
          setImages(data.images);
        } else {
          // Si no hay imágenes, usar array vacío - el componente mostrará placeholders
          setImages([]);
        }
      } catch (error) {
        console.error(`Error loading images for ${category}:`, error);
        // En caso de error, no generar rutas falsas - usar array vacío
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [category]);

  return { images, loading };
}

