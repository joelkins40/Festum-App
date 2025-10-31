export interface Evento {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  horaInicio: string;
  horaFin: string;
  tipoEvento: string;
  cliente: string;
  estado: EstadoEvento;
  color: string;
  ubicacion?: string;
  numeroInvitados?: number;
  presupuesto?: number;
  observaciones?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export enum EstadoEvento {
  COTIZACION = 'cotizacion',
  CONFIRMADO = 'confirmado',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado'
}

export interface CrearEventoDto {
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  horaInicio: string;
  horaFin: string;
  tipoEvento: string;
  cliente: string;
  color?: string;
  ubicacion?: string;
  numeroInvitados?: number;
  presupuesto?: number;
  observaciones?: string;
}

export interface FiltroEventos {
  mes?: number;
  anio?: number;
  estado?: EstadoEvento;
  tipoEvento?: string;
  cliente?: string;
}

export interface EventoCalendario {
  evento: Evento;
  esPrimero: boolean;
  esUltimo: boolean;
  posicion: number;
  duracion: number;
}
