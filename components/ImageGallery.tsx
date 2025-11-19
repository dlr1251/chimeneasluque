"use client";

import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  description?: string;
  location?: string;
  badge?: string;
  isPlaceholder?: boolean;
}

interface ImageGalleryProps {
  images: ImageItem[];
  loading: boolean;
  imageErrors: Set<number>;
  onImageError: (id: number) => void;
  categoryName: string;
}

const PLACEHOLDER_IMAGES: ImageItem[] = [
  {
    id: -1,
    src: "https://images.unsplash.com/photo-1484945571643-25e7f90f7698?auto=format&fit=crop&w=1200&q=80",
    alt: "Chimenea de leña en sala rústica",
    description: "Calor de hogar en cabaña andina",
    location: "Boyacá, Colombia",
    badge: "Inspiración rural",
    isPlaceholder: true,
  },
  {
    id: -2,
    src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
    alt: "Chimenea exterior en casa de campo",
    description: "Fuego al aire libre",
    location: "Cundinamarca",
    badge: "Vida en el campo",
    isPlaceholder: true,
  },
  {
    id: -3,
    src: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80",
    alt: "Fogata nocturna",
    description: "Fogata nocturna rodeada de naturaleza",
    location: "Antioquia",
    badge: "Candela viva",
    isPlaceholder: true,
  },
  {
    id: -4,
    src: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1200&q=80",
    alt: "Horno de leña artesanal",
    description: "Sabores hechos a fuego lento",
    location: "Eje Cafetero",
    badge: "Artesanal",
    isPlaceholder: true,
  },
  {
    id: -5,
    src: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1200&q=80",
    alt: "Interior moderno con chimenea",
    description: "Diseño contemporáneo y calidez",
    location: "Bogotá",
    badge: "Diseño interior",
    isPlaceholder: true,
  },
  {
    id: -6,
    src: "https://images.unsplash.com/photo-1459535653751-d571815e906b?auto=format&fit=crop&w=1200&q=80",
    alt: "Chimenea en lodge de montaña",
    description: "Refugio cálido en la montaña",
    location: "Sierra Nevada",
    badge: "Montaña",
    isPlaceholder: true,
  },
  {
    id: -7,
    src: "https://images.unsplash.com/photo-1447094319855-0d5c84b70063?auto=format&fit=crop&w=1200&q=80",
    alt: "Velada campestre junto al fuego",
    description: "Reuniones familiares junto al fuego",
    location: "Altiplano Cundiboyacense",
    badge: "Tradición",
    isPlaceholder: true,
  },
  {
    id: -8,
    src: "https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=1200&q=80",
    alt: "Espacio exterior con chimenea moderna",
    description: "Ambientes exteriores con estilo",
    location: "Sabana de Bogotá",
    badge: "Exterior premium",
    isPlaceholder: true,
  },
];

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
  const hasRealImages = validImages.length > 0;
  const galleryImages = hasRealImages ? validImages : PLACEHOLDER_IMAGES;

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
    // Asegurar que solo abrimos el lightbox con imágenes reales válidas
    if (!hasRealImages || validImages.length === 0) return;
    
    // Encontrar el índice correcto en validImages
    const image = galleryImages[index];
    if (image.isPlaceholder) return;
    
    const validIndex = validImages.findIndex((img) => img.id === image.id);
    if (validIndex === -1) return;
    
    setSelectedImage(validIndex);
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

  const handleImageError = (
    e: SyntheticEvent<HTMLImageElement, Event>,
    image: ImageItem,
    baseSrc: string,
    extensions: string[]
  ) => {
    // Prevenir loops infinitos
    if (localImageErrors.has(image.id)) {
      return;
    }

    // No intentar múltiples extensiones para URLs externas
    if (image.src.startsWith("http")) {
      setLocalImageErrors((prev) => {
        const newSet = new Set(prev);
        newSet.add(image.id);
        return newSet;
      });
      onImageError(image.id);
      return;
    }

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

    // Intentar siguiente extensión solo si hay más opciones
    const nextExtIndex = attempts + 1;
    if (nextExtIndex < extensions.length && baseSrc) {
      const nextSrc = baseSrc + extensions[nextExtIndex];
      setImageRetryAttempts((prev) => {
        const newMap = new Map(prev);
        newMap.set(image.id, attempts + 1);
        return newMap;
      });

      // Usar requestAnimationFrame para evitar problemas de timing
      requestAnimationFrame(() => {
        const imgElement = e.currentTarget;
        if (imgElement && imgElement.src !== nextSrc) {
          imgElement.src = nextSrc;
        }
      });
    } else {
      // No hay más extensiones, marcar como error
      setLocalImageErrors((prev) => {
        const newSet = new Set(prev);
        newSet.add(image.id);
        return newSet;
      });
      onImageError(image.id);
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
      {!hasRealImages && (
        <div className="mb-6 rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-6 text-primary-700 shadow-soft">
          <p className="font-semibold text-sm uppercase tracking-[0.2em] text-accent-600 mb-2">
            Galería en preparación
          </p>
          <p className="text-sm leading-relaxed">
            Pronto compartiremos fotografías reales de nuestros proyectos de {categoryName.toLowerCase()}. Mientras tanto, disfruta de esta
            selección inspiracional de chimeneas de leña y vida de campo a la luz de la candela.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image, index) => {
          // Solo procesar extensiones para imágenes locales
          const isExternal = image.src.startsWith("http");
          const extensions = isExternal ? [] : [".jpg", ".jpeg", ".png", ".webp"];
          const baseSrc = isExternal ? "" : image.src.replace(/\.(jpg|jpeg|png|webp)$/i, "");
          const isPlaceholder = Boolean(image.isPlaceholder);
          const description =
            image.description || image.alt || `${categoryName} artesanal`;

          const handleTileClick = () => {
            if (isPlaceholder || !hasRealImages) return;
            openLightbox(index);
          };

          return (
            <div
              key={`${image.id}-${index}`}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden transform transition-all duration-300 will-change-transform ${
                isPlaceholder ? "bg-primary/5 cursor-default" : "bg-secondary cursor-pointer hover:scale-[1.03] hover:shadow-glass-lg"
              }`}
              onClick={handleTileClick}
            >
              {!isPlaceholder && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 transform group-hover:scale-100 scale-90">
                    <div className="glass-card rounded-full p-4 shadow-glass">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}

              {image.badge && (
                <span className="absolute top-3 left-3 z-30 text-[11px] uppercase tracking-[0.3em] bg-black/60 text-white px-3 py-1 rounded-full">
                  {image.badge}
                </span>
              )}

              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover transition-transform duration-500 will-change-transform ${
                  isPlaceholder ? "group-hover:scale-100" : "group-hover:scale-110"
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                {...(isPlaceholder || !hasRealImages || index !== 0
                  ? { loading: "lazy" as const }
                  : { priority: true })}
                onError={
                  isPlaceholder || image.src.startsWith("http")
                    ? undefined
                    : (e) => handleImageError(e, image, baseSrc, extensions)
                }
                unoptimized={isPlaceholder}
              />

              <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
                <p className="text-sm font-semibold drop-shadow-md">{description}</p>
                {image.location && (
                  <span className="text-xs text-white/80">{image.location}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage !== null && selectedImage >= 0 && selectedImage < validImages.length && validImages.length > 0 && (
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
              {validImages[selectedImage] && (
                <Image
                  src={validImages[selectedImage].src}
                  alt={validImages[selectedImage].alt || "Imagen de galería"}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  unoptimized={validImages[selectedImage].src.startsWith("http")}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

