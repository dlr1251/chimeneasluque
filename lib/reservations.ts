/**
 * Utilidades para el sistema de reservas de visitas
 */

export interface Reservation {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoChimenea: string;
  notas?: string;
  createdAt: string;
}

export interface TimeSlot {
  hora: string;
  disponible: boolean;
}

/**
 * Horarios disponibles según el día de la semana
 */
export function getAvailableHours(dayOfWeek: number): string[] {
  // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  if (dayOfWeek === 0) {
    // Domingo: cerrado
    return [];
  } else if (dayOfWeek === 6) {
    // Sábado: 8am a 12m
    return ['08:00', '09:00', '10:00', '11:00', '12:00'];
  } else {
    // Lunes a Viernes: 6am a 5pm
    return [
      '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
  }
}

/**
 * Verifica si una fecha es válida para reservar
 */
export function isValidDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  // No permitir fechas pasadas
  if (selectedDate < today) {
    return false;
  }
  
  // No permitir más de 3 meses en el futuro
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  
  return selectedDate <= maxDate;
}

/**
 * Obtiene el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Formatea una fecha para mostrar
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Verifica si un slot de tiempo está disponible
 */
export function isTimeSlotAvailable(
  fecha: string,
  hora: string,
  existingReservations: Reservation[]
): boolean {
  return !existingReservations.some(
    (res) => res.fecha === fecha && res.hora === hora
  );
}

/**
 * Obtiene los slots de tiempo disponibles para una fecha
 */
export function getAvailableTimeSlots(
  fecha: string,
  existingReservations: Reservation[]
): TimeSlot[] {
  const date = new Date(fecha);
  const dayOfWeek = getDayOfWeek(date);
  const availableHours = getAvailableHours(dayOfWeek);
  
  return availableHours.map((hora) => ({
    hora,
    disponible: isTimeSlotAvailable(fecha, hora, existingReservations),
  }));
}

