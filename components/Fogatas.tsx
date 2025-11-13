"use client";

import { useImages } from "@/hooks/useImages";
import Image from "next/image";
import { useState } from "react";

export default function Fogatas() {
  const { images, loading } = useImages('fogatas');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  return (
    <section id="fogatas" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
            FOGATAS
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-12 text-center max-w-2xl mx-auto">
            La artesanía del fuego, su tradición milenaria, su esencia purificadora y su ambientación en jardines en donde florece a diario la naturaleza son nuestra motivación. Tenemos el gusto de presentarle nuestras fogatas prefabricadas y otros elementos para su jardín.
          </p>

          {/* Image Gallery */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => {
                const hasError = imageErrors.has(image.id);
                
                // Intentar diferentes extensiones si la primera falla
                const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
                const baseSrc = image.src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
                const currentExt = image.src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
                const extIndex = extensions.indexOf(currentExt);
                const nextExtIndex = extIndex < extensions.length - 1 ? extIndex + 1 : -1;
                
                return (
                  <div
                    key={image.id}
                    className="aspect-[4/3] bg-secondary rounded-lg overflow-hidden group cursor-pointer hover:opacity-90 transition-opacity relative"
                  >
                    {hasError ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Fogata {image.id}</span>
                      </div>
                    ) : (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        onError={(e) => {
                          if (nextExtIndex >= 0) {
                            // Intentar siguiente extensión
                            const nextSrc = baseSrc + extensions[nextExtIndex];
                            (e.target as HTMLImageElement).src = nextSrc;
                          } else {
                            // Mostrar placeholder si todas las extensiones fallan
                            setImageErrors(prev => new Set(prev).add(image.id));
                          }
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8">
            <a
              href="#fogatas"
              className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-accent transition-colors"
            >
              Ver fogatas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

