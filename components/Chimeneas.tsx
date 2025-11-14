"use client";

import { useImages } from "@/hooks/useImages";
import { useState, useEffect, useRef } from "react";
import ImageGallery from "./ImageGallery";

export default function Chimeneas() {
  const { images, loading } = useImages('chimeneas');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleImageError = (id: number) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  return (
    <section
      ref={sectionRef}
      id="chimeneas"
      className="py-16 md:py-32 bg-gradient-to-b from-secondary via-white to-secondary relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-3xl md:text-5xl font-heading font-bold text-primary mb-6 text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-shadow-md">CHIMENEAS</span>
          </h2>
          <p
            className={`text-base md:text-lg text-primary-700 mb-12 text-center max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Nuestras chimeneas artesanales tienen garantía de buen funcionamiento.
            <br />
            Prefabricadas en concreto, ladrillo refractario o cocido, hierro y otros materiales de alta calidad, han resistido la prueba del tiempo y han adornado hogares durante generaciones.
          </p>

          {/* Modern Image Gallery */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <ImageGallery
              images={images}
              loading={loading}
              imageErrors={imageErrors}
              onImageError={handleImageError}
              categoryName="chimeneas"
            />
          </div>

          <div
            className={`text-center mt-12 transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <a
              href="#chimeneas"
              className="inline-flex items-center px-6 py-3 glass-card rounded-lg text-primary hover:text-accent-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glass-lg font-medium"
            >
              Ver chimeneas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

