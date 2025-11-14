"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Instagram } from "lucide-react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-warm animate-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="block text-shadow-md">CHIMENEAS Y HORNOS</span>
            <span className="block text-accent-500 mt-2 bg-gradient-accent bg-clip-text text-transparent">
              DE LEÑA
            </span>
          </h1>

          <div
            className={`mt-8 mb-6 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-2 text-shadow-sm">
              Somos fabricantes
            </h2>
            <p className="text-sm md:text-base text-primary-400 font-medium">Desde 1975</p>
          </div>

          <p
            className={`text-base md:text-lg text-primary-700 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Nuestra tradición de fabricación artesanal de chimeneas y hornos de leña en concreto es una herencia familiar que mantenemos por más de 40 años, conservando la calidad y garantía de buen funcionamiento en nuestros productos.
          </p>

          <blockquote
            className={`glass-card rounded-lg p-6 md:p-8 my-8 text-left max-w-2xl mx-auto shadow-glass transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-lg md:text-xl italic text-primary font-heading text-shadow-sm">
              &quot;Este mundo siempre fué, es y será fuego eternamente vivo.&quot;
            </p>
            <cite className="text-sm text-primary-400 mt-3 block font-medium">
              — Heráclito
            </cite>
          </blockquote>

          <div
            className={`flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-12 transition-all duration-1000 delay-500 ${
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
        </div>
      </div>
    </section>
  );
}

