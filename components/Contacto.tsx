"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Phone, Send, Eye, EyeOff, User, MapPin, Building2, Ruler, Home, FileText } from "lucide-react";
import DrawingCanvas from "./DrawingCanvas";

type EstadoObra = "diseño" | "en-ejecucion" | "terminada" | "";
type TipoInstalacion = "interior" | "exterior" | "";

interface FormData {
  nombre: string;
  telefono: string;
  ubicacion: string;
  estadoObra: EstadoObra;
  alturaTecho: string;
  materialTecho: string;
  tipoInstalacion: TipoInstalacion;
  descripcion: string;
}

export default function Contacto() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    telefono: "",
    ubicacion: "",
    estadoObra: "",
    alturaTecho: "",
    materialTecho: "",
    tipoInstalacion: "",
    descripcion: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): { isValid: boolean; errors: Partial<Record<keyof FormData, string>> } => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^[0-9+\s()-]+$/.test(formData.telefono)) {
      newErrors.telefono = "Ingrese un teléfono válido";
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es requerida";
    }

    if (!formData.estadoObra) {
      newErrors.estadoObra = "Seleccione el estado de la obra";
    }

    if (!formData.alturaTecho.trim()) {
      newErrors.alturaTecho = "La altura del techo es requerida";
    }

    if (!formData.materialTecho.trim()) {
      newErrors.materialTecho = "El material del techo es requerido";
    }

    if (!formData.tipoInstalacion) {
      newErrors.tipoInstalacion = "Seleccione el tipo de instalación";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción del proyecto es requerida";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const generateEmailBody = (): string => {
    const estadoObraLabels: Record<EstadoObra, string> = {
      diseño: "En diseño",
      "en-ejecucion": "Obra en ejecución",
      terminada: "Obra terminada",
      "": "",
    };

    const tipoInstalacionLabels: Record<TipoInstalacion, string> = {
      interior: "Interior",
      exterior: "Exterior",
      "": "",
    };

    return `
INFORMACIÓN DE CONTACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: ${formData.nombre}
Teléfono: ${formData.telefono}
Ubicación (Municipio): ${formData.ubicacion}

DETALLES DEL PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado de ejecución de la obra: ${estadoObraLabels[formData.estadoObra as EstadoObra]}
Altura del techo: ${formData.alturaTecho}
Material del techo: ${formData.materialTecho}
Tipo de instalación: ${tipoInstalacionLabels[formData.tipoInstalacion as TipoInstalacion]}

DESCRIPCIÓN DEL PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.descripcion}

NOTA: Si tiene planos o imágenes adicionales, puede enviarlos al correo electrónico de El Arpre Ltda: elarpre@hotmail.com
`.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateForm();
    if (!isValid) {
      setShowPreview(false);
      // Scroll al primer error después de que se actualicen los errores
      setTimeout(() => {
        const firstErrorField = Object.keys(validationErrors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    const emailBody = encodeURIComponent(generateEmailBody());
    const subject = encodeURIComponent(`Solicitud de Información - ${formData.nombre}`);
    window.location.href = `mailto:elarpre.deco@gmail.com?subject=${subject}&body=${emailBody}`;
  };

  const handlePreview = () => {
    const { isValid } = validateForm();
    if (isValid) {
      setShowPreview(!showPreview);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="py-16 md:py-32 bg-gradient-to-b from-secondary via-white to-secondary relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-3xl md:text-5xl font-heading font-bold text-primary mb-12 text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-shadow-md">CONTACTENOS</span>
          </h2>

          <div
            className={`glass-card rounded-2xl p-6 md:p-10 shadow-glass-lg transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-sm md:text-base text-primary-700 mb-4 font-medium">
              Complete todos los campos para enviar su solicitud. Todos los campos son requeridos para brindarle el mejor servicio.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información de Contacto */}
              <div className="border-b border-primary-200 pb-6">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información de Contacto
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-2">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        errors.nombre ? "border-red-500" : "border-primary-200"
                      }`}
                      placeholder="Ingrese su nombre completo"
                      required
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-primary mb-2">
                      Teléfono de contacto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        errors.telefono ? "border-red-500" : "border-primary-200"
                      }`}
                      placeholder="Ej: +57 300 123 4567"
                      required
                    />
                    {errors.telefono && (
                      <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="ubicacion" className="block text-sm font-medium text-primary mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Ubicación de la obra (Municipio) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ubicacion"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        errors.ubicacion ? "border-red-500" : "border-primary-200"
                      }`}
                      placeholder="Ej: Bogotá, Medellín, Cali..."
                      required
                    />
                    {errors.ubicacion && (
                      <p className="text-red-500 text-xs mt-1">{errors.ubicacion}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles Técnicos */}
              <div className="border-b border-primary-200 pb-6">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Detalles Técnicos de la Instalación
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="estadoObra" className="block text-sm font-medium text-primary mb-2">
                      Estado de ejecución de la obra <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="estadoObra"
                      name="estadoObra"
                      value={formData.estadoObra}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        errors.estadoObra ? "border-red-500" : "border-primary-200"
                      }`}
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="diseño">En diseño</option>
                      <option value="en-ejecucion">Obra en ejecución</option>
                      <option value="terminada">Obra terminada</option>
                    </select>
                    {errors.estadoObra && (
                      <p className="text-red-500 text-xs mt-1">{errors.estadoObra}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tipoInstalacion" className="block text-sm font-medium text-primary mb-2">
                      <Home className="w-4 h-4 inline mr-1" />
                      Tipo de instalación <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="tipoInstalacion"
                      name="tipoInstalacion"
                      value={formData.tipoInstalacion}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        errors.tipoInstalacion ? "border-red-500" : "border-primary-200"
                      }`}
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="interior">Interior</option>
                      <option value="exterior">Exterior</option>
                    </select>
                    {errors.tipoInstalacion && (
                      <p className="text-red-500 text-xs mt-1">{errors.tipoInstalacion}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="alturaTecho" className="block text-sm font-medium text-primary mb-2">
                      <Ruler className="w-4 h-4 inline mr-1" />
                      Altura del techo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="alturaTecho"
                      name="alturaTecho"
                      value={formData.alturaTecho}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        errors.alturaTecho ? "border-red-500" : "border-primary-200"
                      }`}
                      placeholder="Ej: 2.5 metros, 3.0 metros..."
                      required
                    />
                    {errors.alturaTecho && (
                      <p className="text-red-500 text-xs mt-1">{errors.alturaTecho}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="materialTecho" className="block text-sm font-medium text-primary mb-2">
                      Material del techo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="materialTecho"
                      name="materialTecho"
                      value={formData.materialTecho}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        errors.materialTecho ? "border-red-500" : "border-primary-200"
                      }`}
                      placeholder="Ej: Concreto, Ladrillo, Madera, Yeso..."
                      required
                    />
                    {errors.materialTecho && (
                      <p className="text-red-500 text-xs mt-1">{errors.materialTecho}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción del Proyecto */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-primary mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Descripción del proyecto <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={5}
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                    errors.descripcion ? "border-red-500" : "border-primary-200"
                  }`}
                  placeholder="Describa en detalle su proyecto, requerimientos específicos, dimensiones, y cualquier otra información relevante..."
                  required
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
                )}
              </div>

              {/* Herramienta de Dibujo */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Herramienta de dibujo técnico:
                </label>
                <p className="text-xs text-primary-500 mb-4">
                  Use las herramientas para crear dibujos e ilustraciones de su proyecto. Puede exportar el dibujo como imagen al finalizar.
                </p>
                <DrawingCanvas />
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="group w-full sm:w-auto px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 font-medium inline-flex items-center justify-center gap-2"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Ocultar Previsualización
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Previsualizar Mensaje
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  className="group w-full sm:w-auto px-8 py-3 bg-gradient-accent text-white rounded-lg hover:shadow-glass-lg transition-all duration-300 transform hover:scale-105 font-medium inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Enviar Solicitud
                </button>
              </div>

              {/* Previsualización */}
              {showPreview && (
                <div className="mt-6 p-6 bg-primary-50 rounded-lg border-2 border-primary-200">
                  <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Previsualización del mensaje
                  </h4>
                  <div className="bg-white p-4 rounded border border-primary-200 whitespace-pre-wrap text-sm text-primary-700 font-mono">
                    {generateEmailBody()}
                  </div>
                  <p className="text-xs text-primary-500 mt-4">
                    Este es el mensaje que se enviará por correo electrónico. Revise todos los datos antes de enviar.
                  </p>
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-primary-200 text-center">
              <p className="text-xs text-primary-500 mb-4">
                Si tiene planos o imágenes adicionales, puede enviarlos directamente al correo electrónico de El Arpre Ltda:{" "}
                <a
                  href="mailto:elarpre@hotmail.com"
                  className="text-accent-500 hover:text-accent-600 underline"
                >
                  elarpre@hotmail.com
                </a>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-primary-600">
                <a
                  href="mailto:elarpre.deco@gmail.com"
                  className="group flex items-center gap-2 text-primary hover:text-accent-500 transition-all duration-300"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  elarpre.deco@gmail.com
                </a>
                <span className="hidden sm:inline">||</span>
                <a
                  href="tel:+573052925725"
                  className="group flex items-center gap-2 text-primary hover:text-accent-500 transition-all duration-300"
                >
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  305 292 5725
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
