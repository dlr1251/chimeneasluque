"use client";

import { useState } from "react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    descripcion: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se implementaría la lógica de envío del formulario
    const emailBody = encodeURIComponent(
      `Descripción del proyecto:\n\n${formData.descripcion}`
    );
    window.location.href = `mailto:elarpre.deco@gmail.com?subject=Solicitud de Información&body=${emailBody}`;
  };

  return (
    <section id="contacto" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            CONTACTENOS
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <p className="text-sm md:text-base text-gray-700 mb-6">
              Al describir su proyecto, recuerde añadir:
            </p>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-700 mb-8 space-y-2">
              <li>Teléfono de contacto.</li>
              <li>Ubicación de la obra (municipio)</li>
              <li>Estado de ejecución de la obra (diseño, obra en ejecución, obra terminada.)</li>
              <li>Descripción del sitio de instalación (Altura del techo, material del techo, interior/exterior, etc)</li>
              <li>Si tiene planos o imagenes, las puede enviar al correo electrónico de El Arpre Ltda. elarpre@hotmail.com</li>
            </ul>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Descripción del proyecto:
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={8}
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  placeholder="Describa su proyecto aquí..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-md hover:bg-accent transition-colors font-medium"
              >
                Enviar
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                <a
                  href="mailto:elarpre.deco@gmail.com"
                  className="text-primary hover:text-accent transition-colors"
                >
                  elarpre.deco@gmail.com
                </a>
                {" || "}
                <a
                  href="tel:+573052925725"
                  className="text-primary hover:text-accent transition-colors"
                >
                  305 292 5725
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

