"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Mail, MapPin, MessageSquare, Send, CheckCircle } from "lucide-react";
import {
  getAvailableHours,
  isValidDate,
  getDayOfWeek,
  formatDate,
  getAvailableTimeSlots,
  type Reservation,
  type TimeSlot,
} from "@/lib/reservations";
import DatePicker from "./DatePicker";

export default function ReservaVisita() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    tipoChimenea: "",
    notas: "",
  });

  // Cargar reservas existentes al montar el componente
  useEffect(() => {
    loadReservations();
  }, []);

  // Cargar slots disponibles cuando cambia la fecha
  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlots(selectedDate, existingReservations);
      setAvailableSlots(slots);
      // Resetear hora seleccionada si no está disponible
      if (selectedTime && !slots.find(s => s.hora === selectedTime && s.disponible)) {
        setSelectedTime("");
      }
    }
  }, [selectedDate, existingReservations]);

  const loadReservations = async () => {
    try {
      const response = await fetch("/api/reservations");
      if (response.ok) {
        const data = await response.json();
        setExistingReservations(data.reservations || []);
      }
    } catch (error) {
      console.error("Error loading reservations:", error);
    }
  };

  const handleDateSelect = (dateValue: string) => {
    const date = new Date(dateValue);
    
    if (!isValidDate(date)) {
      alert("Por favor selecciona una fecha válida (hoy o hasta 3 meses en el futuro)");
      return;
    }
    
    const dayOfWeek = getDayOfWeek(date);
    if (dayOfWeek === 0) {
      alert("Los domingos no hay disponibilidad. Por favor selecciona otro día.");
      return;
    }
    
    setSelectedDate(dateValue);
    setSelectedTime("");
    setStep(2);
  };

  const handleTimeSelect = (hora: string) => {
    const slot = availableSlots.find((s) => s.hora === hora);
    if (slot && slot.disponible) {
      setSelectedTime(hora);
      setStep(3);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reservation: Omit<Reservation, "id" | "createdAt"> = {
        fecha: selectedDate,
        hora: selectedTime,
        ...formData,
      };

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Recargar reservas
        await loadReservations();
        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          setStep(1);
          setSelectedDate("");
          setSelectedTime("");
          setFormData({
            nombre: "",
            telefono: "",
            email: "",
            direccion: "",
            tipoChimenea: "",
            notas: "",
          });
          setIsSuccess(false);
        }, 3000);
      } else {
        const error = await response.json();
        alert(error.message || "Error al crear la reserva. Por favor intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Error al crear la reserva. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split("T")[0];
  };

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-6 md:p-10 shadow-glass-lg">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 text-center">
            Reserva tu Visita
          </h2>
          <p className="text-primary-700 text-center">
            Agenda una visita en obra para cotizar tu proyecto de chimenea. 
            <br />
            <span className="font-semibold">Costo de la visita: $350.000 COP</span>
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? "text-accent-500" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? "border-accent-500 bg-accent-500/10" : "border-gray-300"
              }`}>
                <Calendar className="w-5 h-5" />
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Fecha</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? "bg-accent-500" : "bg-gray-300"}`} />
            <div className={`flex items-center ${step >= 2 ? "text-accent-500" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? "border-accent-500 bg-accent-500/10" : "border-gray-300"
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Hora</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 3 ? "bg-accent-500" : "bg-gray-300"}`} />
            <div className={`flex items-center ${step >= 3 ? "text-accent-500" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step >= 3 ? "border-accent-500 bg-accent-500/10" : "border-gray-300"
              }`}>
                <User className="w-5 h-5" />
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Datos</span>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">¡Reserva Confirmada!</h3>
            <p className="text-primary-700 mb-4">
              Tu reserva para el {selectedDateObj && formatDate(selectedDateObj)} a las {selectedTime} ha sido confirmada.
            </p>
            <p className="text-sm text-primary-600">
              Te contactaremos pronto para confirmar los detalles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Paso 1: Selección de Fecha */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-primary mb-4">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Selecciona una Fecha
                  </label>
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    existingReservations={existingReservations}
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Horarios disponibles:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Lunes a Viernes:</strong> 6:00 AM - 5:00 PM</li>
                    <li>• <strong>Sábado:</strong> 8:00 AM - 12:00 PM</li>
                    <li>• <strong>Domingo:</strong> Cerrado</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Paso 2: Selección de Hora */}
            {step === 2 && selectedDate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-primary">
                    <Clock className="w-5 h-5 inline mr-2" />
                    Selecciona una Hora
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setSelectedTime("");
                    }}
                    className="text-sm text-accent-500 hover:text-accent-600"
                  >
                    Cambiar fecha
                  </button>
                </div>
                <p className="text-primary-700 mb-4">
                  {selectedDateObj && formatDate(selectedDateObj)}
                </p>
                <div className="space-y-4">
                  {/* Agrupar por mañana y tarde */}
                  <div>
                    <h4 className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">
                      Mañana
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {availableSlots
                        .filter((slot) => {
                          const hour = parseInt(slot.hora.split(":")[0]);
                          return hour < 12;
                        })
                        .map((slot) => (
                          <button
                            key={slot.hora}
                            type="button"
                            onClick={() => handleTimeSelect(slot.hora)}
                            disabled={!slot.disponible}
                            className={`
                              px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium text-sm
                              relative overflow-hidden group
                              ${
                                slot.disponible
                                  ? selectedTime === slot.hora
                                    ? "bg-accent-500 text-white border-accent-500 shadow-lg scale-105"
                                    : "bg-white text-primary border-primary-200 hover:border-accent-500 hover:bg-accent-500/10 hover:shadow-md hover:scale-105"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                              }
                            `}
                          >
                            {slot.disponible && selectedTime === slot.hora && (
                              <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600 opacity-20"></div>
                            )}
                            <span className="relative z-10">{slot.hora}</span>
                            {!slot.disponible && (
                              <span className="absolute top-1 right-1 text-xs">✕</span>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">
                      Tarde
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {availableSlots
                        .filter((slot) => {
                          const hour = parseInt(slot.hora.split(":")[0]);
                          return hour >= 12;
                        })
                        .map((slot) => (
                          <button
                            key={slot.hora}
                            type="button"
                            onClick={() => handleTimeSelect(slot.hora)}
                            disabled={!slot.disponible}
                            className={`
                              px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium text-sm
                              relative overflow-hidden group
                              ${
                                slot.disponible
                                  ? selectedTime === slot.hora
                                    ? "bg-accent-500 text-white border-accent-500 shadow-lg scale-105"
                                    : "bg-white text-primary border-primary-200 hover:border-accent-500 hover:bg-accent-500/10 hover:shadow-md hover:scale-105"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                              }
                            `}
                          >
                            {slot.disponible && selectedTime === slot.hora && (
                              <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600 opacity-20"></div>
                            )}
                            <span className="relative z-10">{slot.hora}</span>
                            {!slot.disponible && (
                              <span className="absolute top-1 right-1 text-xs">✕</span>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
                {availableSlots.filter((s) => s.disponible).length === 0 && (
                  <p className="text-red-500 text-center py-4">
                    No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha.
                  </p>
                )}
              </div>
            )}

            {/* Paso 3: Datos del Cliente */}
            {step === 3 && selectedDate && selectedTime && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-primary">
                    <User className="w-5 h-5 inline mr-2" />
                    Completa tus Datos
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-sm text-accent-500 hover:text-accent-600"
                  >
                    Cambiar hora
                  </button>
                </div>
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary-700">
                    <strong>Resumen de tu reserva:</strong>
                  </p>
                  <p className="text-primary-600">
                    {selectedDateObj && formatDate(selectedDateObj)} a las {selectedTime}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-primary mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="tipoChimenea" className="block text-sm font-medium text-primary mb-2">
                      Tipo de Chimenea *
                    </label>
                    <select
                      id="tipoChimenea"
                      name="tipoChimenea"
                      value={formData.tipoChimenea}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      required
                    >
                      <option value="">Selecciona...</option>
                      <option value="gas">Chimenea a Gas</option>
                      <option value="electrica">Chimenea Eléctrica</option>
                      <option value="bioetanol">Chimenea a Bioetanol</option>
                      <option value="lena">Chimenea de Leña</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-primary mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección de la Obra *
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Ej: Calle 50 #45-30, Medellín"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="notas" className="block text-sm font-medium text-primary mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                    placeholder="Información adicional sobre tu proyecto..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> El costo de la visita es de $350.000 COP y se debe pagar al momento de la reserva o en la visita.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group px-8 py-4 bg-gradient-accent text-white rounded-lg hover:shadow-glass-lg transition-all duration-300 transform hover:scale-105 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Confirmar Reserva
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

