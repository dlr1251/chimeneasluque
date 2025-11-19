import { NextResponse } from 'next/server';
import { getImagesForCategory } from '@/lib/images';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';

  if (!category || !['hornos', 'chimeneas', 'fogatas'].includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    // Obtener imágenes de la base de datos estructurada
    let images = getImagesForCategory(category as 'hornos' | 'chimeneas' | 'fogatas');

    // Filtrar por destacadas si se solicita
    if (featured) {
      images = images.filter(img => img.featured);
    }

    // Verificar que las imágenes realmente existen en el sistema de archivos
    const verifiedImages = [];
    for (const image of images) {
      try {
        const imagePath = path.join(process.cwd(), 'public', image.src);
        if (fs.existsSync(imagePath)) {
          verifiedImages.push(image);
        } else {
          console.warn(`Image not found: ${image.src}`);
        }
      } catch (error) {
        console.warn(`Error checking image ${image.src}:`, error);
      }
    }

    return NextResponse.json({
      images: verifiedImages,
      total: verifiedImages.length,
      category: category,
      featured: featured
    });
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
}

