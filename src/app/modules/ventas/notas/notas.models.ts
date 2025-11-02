export interface InformacionDeContacto {
  telefono: string;
  email: string;
  direccion?: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  informacionDeContacto: InformacionDeContacto;
  clientePreferente: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  activo?: boolean;
}

export interface Evento {
  id: number;
  nombre: string;
  fecha: Date;
  lugar: string;
}

export type TipoNota = 'Paquete' | 'Servicio';
export type EstadoNota = 'Pendiente' | 'Pagada' | 'Cancelada' | 'Parcial';

export interface Nota {
  id: number;
  tipo: TipoNota;
  folio: string;
  cliente: Cliente;
  evento: Evento;
  fecha: Date;
  total: number;
  estado: EstadoNota;
  descripcion?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CrearNotaDto {
  tipo: TipoNota;
  clienteId: number;
  eventoId: number;
  fecha: Date;
  total: number;
  estado: EstadoNota;
  descripcion?: string;
}

export interface ActualizarNotaDto {
  id: number;
  tipo?: TipoNota;
  clienteId?: number;
  eventoId?: number;
  fecha?: Date;
  total?: number;
  estado?: EstadoNota;
  descripcion?: string;
}

export interface EstadisticasNotas {
  totalVentasMes: number;
  totalIngresos: number;
  promedioVenta: number;
  cantidadNotas: number;
}
