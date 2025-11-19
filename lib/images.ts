import fs from 'fs';
import path from 'path';

export interface ImageInfo {
  src: string;
  alt: string;
  id: number;
  title?: string;
  description?: string;
  location?: string;
  type?: string;
  featured?: boolean;
}

/**
 * Base de datos estructurada de imágenes con metadatos detallados
 */
const IMAGES_DATABASE: Record<string, ImageInfo[]> = {
  chimeneas: [
    // Chimeneas de Leña - Tradicionales
    {
      id: 1,
      src: '/images/chimeneas/chimeneas1.png',
      alt: 'Chimenea de leña tradicional en sala rústica',
      title: 'Chimenea Tradicional Rústica',
      description: 'Diseño artesanal con acabados en piedra natural, perfecta para ambientes campestres',
      location: 'Zona rural, Antioquia',
      type: 'leña',
      featured: true
    },
    {
      id: 2,
      src: '/images/chimeneas/chimeneas2.png',
      alt: 'Chimenea moderna de leña con diseño minimalista',
      title: 'Chimenea Minimalista Moderna',
      description: 'Líneas limpias y elegantes, ideal para espacios contemporáneos',
      location: 'Medellín centro',
      type: 'leña',
      featured: true
    },
    {
      id: 4,
      src: '/images/chimeneas/chimeneas4.jpeg',
      alt: 'Chimenea de leña artesanal con detalles ornamentales',
      title: 'Chimenea Artesanal Ornamentada',
      description: 'Trabajo artesanal con detalles ornamentales tradicionales',
      location: 'Envigado, Antioquia',
      type: 'leña'
    },
    {
      id: 5,
      src: '/images/chimeneas/chimeneas5.jpeg',
      alt: 'Chimenea de leña en estilo colonial',
      title: 'Chimenea Estilo Colonial',
      description: 'Diseño inspirado en la arquitectura colonial antioqueña',
      location: 'Santa Fe de Antioquia',
      type: 'leña',
      featured: true
    },
    {
      id: 6,
      src: '/images/chimeneas/chimeneas6.jpg',
      alt: 'Chimenea de leña con hogar amplio',
      title: 'Chimenea con Hogar Amplio',
      description: 'Espacioso hogar perfecto para reuniones familiares',
      location: 'Rionegro, Antioquia',
      type: 'leña'
    },
    {
      id: 7,
      src: '/images/chimeneas/chimeneas7.jpg',
      alt: 'Chimenea de leña en piedra natural',
      title: 'Chimenea en Piedra Natural',
      description: 'Construcción en piedra de cantera local',
      location: 'Jericó, Antioquia',
      type: 'leña'
    },
    {
      id: 8,
      src: '/images/chimeneas/chimeneas8.jpg',
      alt: 'Chimenea moderna con acabados elegantes',
      title: 'Chimenea Moderna Elegante',
      description: 'Diseño contemporáneo con materiales premium',
      location: 'Medellín El Poblado',
      type: 'leña',
      featured: true
    },
    {
      id: 9,
      src: '/images/chimeneas/chimeneas9.jpg',
      alt: 'Chimenea de leña en ladrillo visto',
      title: 'Chimenea en Ladrillo Visto',
      description: 'Acabado industrial con ladrillo expuesto',
      location: 'Sabaneta, Antioquia',
      type: 'leña'
    },
    {
      id: 10,
      src: '/images/chimeneas/chimeneas10.jpg',
      alt: 'Chimenea artesanal con repisa de madera',
      title: 'Chimenea con Repisa de Madera',
      description: 'Diseño tradicional con elementos en madera noble',
      location: 'La Ceja, Antioquia',
      type: 'leña'
    },
    // Más imágenes de chimeneas...
    {
      id: 11,
      src: '/images/chimeneas/chimeneas11.jpg',
      alt: 'Chimenea contemporánea de leña',
      title: 'Chimenea Contemporánea',
      description: 'Estilo moderno con líneas geométricas',
      location: 'Medellín Laureles',
      type: 'leña'
    },
    {
      id: 15,
      src: '/images/chimeneas/chimeneas15.jpeg',
      alt: 'Chimenea artesanal de alta calidad',
      title: 'Chimenea Premium Artesanal',
      description: 'Fabricación artesanal con materiales de primera calidad',
      location: 'Medellín',
      type: 'leña',
      featured: true
    },
    {
      id: 16,
      src: '/images/chimeneas/chimeneas16.jpg',
      alt: 'Chimenea rústica en entorno natural',
      title: 'Chimenea Rústica Natural',
      description: 'Perfecta integración con ambientes naturales',
      location: 'Zona cafetera antioqueña',
      type: 'leña'
    },
    {
      id: 20,
      src: '/images/chimeneas/chimeneas20.jpg',
      alt: 'Chimenea tradicional antioqueña',
      title: 'Chimenea Tradicional Antioqueña',
      description: 'Diseño típico de la región con identidad local',
      location: 'Antioquia',
      type: 'leña',
      featured: true
    },
    {
      id: 25,
      src: '/images/chimeneas/chimeneas25.jpg',
      alt: 'Chimenea moderna funcional',
      title: 'Chimenea Moderna Funcional',
      description: 'Combina diseño moderno con máxima funcionalidad',
      location: 'Medellín norte',
      type: 'leña'
    },
    {
      id: 30,
      src: '/images/chimeneas/chimeneas30.jpg',
      alt: 'Chimenea artesanal premium',
      title: 'Chimenea Artesanal Premium',
      description: 'Trabajo artesanal de alta gama',
      location: 'Medellín',
      type: 'leña'
    }
  ],
  hornos: [
    {
      id: 2,
      src: '/images/hornos/hornos2.jpg',
      alt: 'Horno de leña artesanal para cocinar',
      title: 'Horno de Leña Artesanal',
      description: 'Horno tradicional para cocinar pizzas y panes',
      location: 'Medellín',
      type: 'cocina',
      featured: true
    }
  ],
  fogatas: [
    {
      id: 1,
      src: '/images/fogatas/fogata1.jpg', // Placeholder - usar URL de Unsplash si no existe
      alt: 'Fogata exterior moderna',
      title: 'Fogata Moderna Exterior',
      description: 'Diseño contemporáneo para espacios exteriores',
      location: 'Jardín residencial, Antioquia',
      type: 'exterior',
      featured: true
    },
    {
      id: 2,
      src: '/images/fogatas/fogata2.jpg', // Placeholder - usar URL de Unsplash si no existe
      alt: 'Fogata rústica de piedra',
      title: 'Fogata Rústica en Piedra',
      description: 'Construcción artesanal con piedras locales',
      location: 'Finca, Antioquia',
      type: 'exterior'
    },
    {
      id: 3,
      src: '/images/fogatas/fogata3.jpg', // Placeholder - usar URL de Unsplash si no existe
      alt: 'Fogata interior minimalista',
      title: 'Fogata Interior Minimalista',
      description: 'Diseño elegante para espacios interiores modernos',
      location: 'Sala contemporánea',
      type: 'interior',
      featured: true
    }
  ]
};

/**
 * Obtiene la lista de imágenes disponibles para una categoría
 * Ahora usa la base de datos estructurada en lugar de archivos dinámicos
 */
export function getImagesForCategory(category: 'hornos' | 'chimeneas' | 'fogatas'): ImageInfo[] {
  return IMAGES_DATABASE[category] || [];
}

/**
 * Obtiene solo las imágenes destacadas de una categoría
 */
export function getFeaturedImages(category: 'hornos' | 'chimeneas' | 'fogatas'): ImageInfo[] {
  return getImagesForCategory(category).filter(img => img.featured);
}

/**
 * Obtiene estadísticas de imágenes por categoría
 */
export function getImageStats() {
  const stats = {
    chimeneas: {
      total: IMAGES_DATABASE.chimeneas.length,
      featured: IMAGES_DATABASE.chimeneas.filter(img => img.featured).length,
      types: {} as Record<string, number>
    },
    hornos: {
      total: IMAGES_DATABASE.hornos.length,
      featured: IMAGES_DATABASE.hornos.filter(img => img.featured).length,
      types: {} as Record<string, number>
    },
    fogatas: {
      total: IMAGES_DATABASE.fogatas.length,
      featured: IMAGES_DATABASE.fogatas.filter(img => img.featured).length,
      types: {} as Record<string, number>
    }
  };

  // Contar tipos
  Object.keys(IMAGES_DATABASE).forEach(category => {
    const images = IMAGES_DATABASE[category];
    images.forEach(img => {
      if (img.type) {
        stats[category].types[img.type] = (stats[category].types[img.type] || 0) + 1;
      }
    });
  });

  return stats;
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

