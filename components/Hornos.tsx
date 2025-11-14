"use client";

import { useImages } from "@/hooks/useImages";
import { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import ImageGallery from "./ImageGallery";

export default function Hornos() {
  const { images, loading } = useImages('hornos');
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
      id="hornos"
      className="py-16 md:py-32 bg-gradient-to-b from-white via-secondary-50 to-white relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-3xl md:text-5xl font-heading font-bold text-primary mb-6 text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-shadow-md">HORNOS</span>
          </h2>
          <p
            className={`text-base md:text-lg text-primary-700 mb-12 text-center max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Nuevos hornos para pizzas. Mantienen el calor y soportan altas temperaturas.
            <br />
            Disfrute del placer de la cocina en su casa con nuestros hornos.
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
              categoryName="hornos"
            />
          </div>

          <div
            className={`text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <a
              href="/ar"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-accent text-white rounded-lg hover:shadow-glass-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Ver en Realidad Aumentada
            </a>
            <a
              href="#hornos"
              className="inline-flex items-center px-6 py-3 glass-card rounded-lg text-primary hover:text-accent-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glass-lg font-medium"
            >
              Ver hornos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

