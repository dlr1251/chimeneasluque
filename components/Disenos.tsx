"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, Instagram, Clock } from "lucide-react";

export default function Disenos() {
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
      id="disenos"
      className="py-16 md:py-32 bg-gradient-to-b from-secondary via-white to-secondary relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-3xl md:text-5xl font-heading font-bold text-primary mb-12 text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-shadow-md">DISEÑOS ESPECIALES</span>
          </h2>

          <div
            className={`space-y-6 mb-12 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-base md:text-lg text-primary-700 text-center leading-relaxed">
              Nuestra amplia experiencia en la industria de la construcción nos ha dado la fortaleza de resolver todo tipo de requerimientos técnicos desde el diseño hasta la instalación de su chimenea garantizando su buen funcionamiento.
            </p>
            <p className="text-base md:text-lg text-primary-700 text-center leading-relaxed">
              Si usted es diseñador de espacios, arquitecto, constructor o interiorista, cuente con nuestra asesoría personalizada para sus proyectos, acompañamos durante todo el proceso hasta su entrega.
            </p>
          </div>

          <div
            className={`flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-12 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <a
              href="mailto:info@chimeneasluque.com"
              className="group flex items-center gap-2 px-6 py-3 glass-card rounded-lg text-primary hover:text-accent-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glass-lg"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm md:text-base font-medium">info@chimeneasluque.com</span>
            </a>
            <a
              href="tel:+573052925725"
              className="group flex items-center gap-2 px-6 py-3 glass-card rounded-lg text-primary hover:text-accent-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glass-lg"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm md:text-base font-medium">305 292 5725</span>
            </a>
            <a
              href="https://instagram.com/chimeneasluque"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 glass-card rounded-lg text-primary hover:text-accent-500 transition-all duration-300 transform hover:scale-105 hover:shadow-glass-lg"
            >
              <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm md:text-base font-medium">@chimeneasluque</span>
            </a>
          </div>

          <div
            className={`mt-12 flex items-center justify-center gap-2 text-sm text-primary-500 font-medium transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Clock className="w-4 h-4" />
            <p>Horario de atención: Lunes a Viernes de 8:00am a 5:00pm</p>
          </div>
        </div>
      </div>
    </section>
  );
}

