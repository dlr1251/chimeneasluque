"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  loading: boolean;
  imageErrors: Set<number>;
  onImageError: (id: number) => void;
  categoryName: string;
}

export default function ImageGallery({
  images,
  loading,
  imageErrors,
  onImageError,
  categoryName,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [localImageErrors, setLocalImageErrors] = useState<Set<number>>(imageErrors);
  const [imageRetryAttempts, setImageRetryAttempts] = useState<Map<number, number>>(new Map());

  // Sincronizar localImageErrors con imageErrors del padre
  useEffect(() => {
    setLocalImageErrors(new Set(imageErrors));
  }, [imageErrors]);

  const validImages = images.filter((img) => !localImageErrors.has(img.id));

  // Manejar navegación con teclado
  useEffect(() => {
    if (!isLightboxOpen || validImages.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft" && selectedImage !== null) {
        const prevIndex = selectedImage > 0 ? selectedImage - 1 : validImages.length - 1;
        setSelectedImage(prevIndex);
      } else if (e.key === "ArrowRight" && selectedImage !== null) {
        const nextIndex = selectedImage < validImages.length - 1 ? selectedImage + 1 : 0;
        setSelectedImage(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, selectedImage, validImages.length]);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    if (selectedImage !== null && validImages.length > 0) {
      const prevIndex = selectedImage > 0 ? selectedImage - 1 : validImages.length - 1;
      setSelectedImage(prevIndex);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null && validImages.length > 0) {
      const nextIndex = selectedImage < validImages.length - 1 ? selectedImage + 1 : 0;
      setSelectedImage(nextIndex);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] bg-secondary rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {validImages.map((image, index) => {
          const extensions = [".jpg", ".jpeg", ".png", ".webp"];
          const baseSrc = image.src.replace(/\.(jpg|jpeg|png|webp)$/i, "");

          return (
            <div
              key={image.id}
              className="group relative aspect-[4/3] bg-secondary rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.03] hover:shadow-glass-lg will-change-transform"
              onClick={() => openLightbox(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 transform group-hover:scale-100 scale-90">
                <div className="glass-card rounded-full p-4 shadow-glass">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
                onError={(e) => {
                  // Prevenir loops: verificar si ya está marcada como error
                  if (localImageErrors.has(image.id)) {
                    return;
                  }

                  // Obtener intentos actuales
                  const attempts = imageRetryAttempts.get(image.id) || 0;
                  
                  // Si ya intentamos todas las extensiones, marcar como error
                  if (attempts >= extensions.length - 1) {
                    setLocalImageErrors((prev) => {
                      const newSet = new Set(prev);
                      newSet.add(image.id);
                      return newSet;
                    });
                    onImageError(image.id);
                    return;
                  }

                  // Intentar siguiente extensión
                  const nextExtIndex = attempts + 1;
                  if (nextExtIndex < extensions.length) {
                    const nextSrc = baseSrc + extensions[nextExtIndex];
                    setImageRetryAttempts((prev) => {
                      const newMap = new Map(prev);
                      newMap.set(image.id, attempts + 1);
                      return newMap;
                    });
                    // Usar setTimeout para evitar loops inmediatos
                    setTimeout(() => {
                      (e.target as HTMLImageElement).src = nextSrc;
                    }, 0);
                  } else {
                    // No hay más extensiones, marcar como error
                    setLocalImageErrors((prev) => {
                      const newSet = new Set(prev);
                      newSet.add(image.id);
                      return newSet;
                    });
                    onImageError(image.id);
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 glass-card text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-glass-lg transform"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 glass-card text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-glass-lg transform"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {validImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 glass-card text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-glass-lg transform"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 glass-card text-white px-4 py-2 rounded-full text-sm font-medium shadow-glass">
              {selectedImage + 1} / {validImages.length}
            </div>
          )}

          {/* Main Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={validImages[selectedImage].src}
                alt={validImages[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

