import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  if (!category || !['hornos', 'chimeneas', 'fogatas'].includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', category);
    
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ images: [] });
    }
    
    const files = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        // Extraer el número del nombre del archivo
        const match = file.match(/\d+/);
        const num = match ? parseInt(match[0]) : 0;
        return { file, num };
      })
      .sort((a, b) => a.num - b.num)
      .map(({ file, num }) => ({
        id: num,
        src: `/images/${category}/${file}`,
        alt: `${category} ${num}`
      }));
    
    return NextResponse.json({ images: files });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ error: 'Failed to read images' }, { status: 500 });
  }
}

