export default function Disenos() {
  return (
    <section id="disenos" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            DISEÑOS ESPECIALES
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-8 text-center">
            Nuestra amplia experiencia en la industria de la construcción nos ha dado la fortaleza de resolver todo tipo de requerimientos técnicos desde el diseño hasta la instalación de su chimenea garantizando su buen funcionamiento.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-8 text-center">
            Si usted es diseñador de espacios, arquitecto, constructor o interiorista, cuente con nuestra asesoría personalizada para sus proyectos, acompañamos durante todo el proceso hasta su entrega.
          </p>
          
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

          <p className="text-center text-sm text-gray-600 mt-8">
            Horario de atención: Lunes a Viernes de 8:00am a 5:00pm
          </p>
        </div>
      </div>
    </section>
  );
}

