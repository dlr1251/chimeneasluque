import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Reservation } from '@/lib/reservations';

const RESERVATIONS_FILE = path.join(process.cwd(), 'data', 'reservations.json');

// Asegurar que el directorio existe
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Leer reservas del archivo
function readReservations(): Reservation[] {
  ensureDataDirectory();
  if (!fs.existsSync(RESERVATIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reservations:', error);
    return [];
  }
}

// Escribir reservas al archivo
function writeReservations(reservations: Reservation[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing reservations:', error);
    throw error;
  }
}

// GET: Obtener todas las reservas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    
    let reservations = readReservations();
    
    // Filtrar por fecha si se proporciona
    if (fecha) {
      reservations = reservations.filter((r) => r.fecha === fecha);
    }
    
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error getting reservations:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reservas' },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva reserva
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const requiredFields = ['fecha', 'hora', 'nombre', 'telefono', 'email', 'direccion', 'tipoChimenea'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }
    
    // Leer reservas existentes
    const reservations = readReservations();
    
    // Verificar si ya existe una reserva para la misma fecha y hora
    const conflictingReservation = reservations.find(
      (r) => r.fecha === body.fecha && r.hora === body.hora
    );
    
    if (conflictingReservation) {
      return NextResponse.json(
        { error: 'Este horario ya está reservado. Por favor selecciona otro horario.' },
        { status: 409 }
      );
    }
    
    // Crear nueva reserva
    const newReservation: Reservation = {
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fecha: body.fecha,
      hora: body.hora,
      nombre: body.nombre,
      telefono: body.telefono,
      email: body.email,
      direccion: body.direccion,
      tipoChimenea: body.tipoChimenea,
      notas: body.notas || '',
      createdAt: new Date().toISOString(),
    };
    
    // Agregar la nueva reserva
    reservations.push(newReservation);
    
    // Guardar en el archivo
    writeReservations(reservations);
    
    // Enviar email de confirmación (opcional, puedes integrar con un servicio de email)
    // Por ahora, solo retornamos éxito
    
    return NextResponse.json(
      {
        message: 'Reserva creada exitosamente',
        reservation: newReservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500 }
    );
  }
}

