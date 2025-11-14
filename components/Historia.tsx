"use client";

import { useEffect, useRef, useState } from "react";

export default function Historia() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  return (
    <section
      ref={sectionRef}
      id="informacion"
      className="py-16 md:py-32 bg-gradient-to-b from-white via-secondary-50 to-white relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-3xl md:text-5xl font-heading font-bold text-primary mb-12 text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-shadow-md">HISTORIA</span>
          </h2>
          <div
            className={`glass-card rounded-2xl p-8 md:p-12 shadow-glass-lg transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-base md:text-lg leading-relaxed text-primary-700 font-body">
                En 1957 emigró a Colombia la familia Luque Aguilera en busca de nuevas oportunidades con su familia, esta nueva aventura en un trasatlántico le dió la oportunidad de hacer amistades del nuevo mundo, él de origen cordobés, se dedicaba a proyectos de albañilería y conocía muy bien arte de la fumistería. El barco que llegó a Cartagena de Indias, dio la bienvenida a la originalidad, innovación y creatividad de la familia Luque, quienes asesorados por la buena gente de esta ciudad se radicaron pronto en Medellín para emprender la primera fábrica de chimeneas de leña en el país.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

