export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-secondary to-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            CHIMENEAS Y HORNOS
            <br />
            <span className="text-accent">DE LEÑA</span>
          </h1>
          
          <div className="mt-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
              Somos fabricantes
            </h2>
            <p className="text-sm md:text-base text-gray-600">Desde 1975</p>
          </div>

          <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Nuestra tradición de fabricación artesanal de chimeneas y hornos de leña en concreto es una herencia familiar que mantenemos por más de 40 años, conservando la calidad y garantía de buen funcionamiento en nuestros productos.
          </p>

          <blockquote className="border-l-4 border-accent pl-6 my-8 text-left max-w-2xl mx-auto">
            <p className="text-lg md:text-xl italic text-primary">
              &quot;Este mundo siempre fué, es y será fuego eternamente vivo.&quot;
            </p>
            <cite className="text-sm text-gray-600 mt-2 block">— Heráclito</cite>
          </blockquote>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 text-sm md:text-base">
            <a
              href="mailto:info@chimeneasluque.com"
              className="text-primary hover:text-accent transition-colors"
            >
              info@chimeneasluque.com
            </a>
            <a
              href="tel:+573052925725"
              className="text-primary hover:text-accent transition-colors"
            >
              305 292 5725
            </a>
            <a
              href="https://instagram.com/chimeneasluque"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              @chimeneasluque
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

