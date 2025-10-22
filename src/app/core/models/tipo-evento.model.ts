/**
 * Modelo de datos para TipoEvento
 */
export interface TipoEvento {
  id: number;
  descripcion: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  activo?: boolean;
}

/**
 * DTO para crear una nueva TipoEvento
 */
export interface CrearTipoEventoDto {
  descripcion: string;
}

/**
 * DTO para actualizar una TipoEvento
 */
export interface ActualizarTipoEventoDto {
  id: number;
  descripcion: string;
}

/**
 * Respuesta de la API para operaciones de TipoEventos
 */
export interface TipoEventoResponse {
  success: boolean;
  message: string;
  data?: TipoEvento | TipoEvento[];
  totalRecords?: number;
}

/**
 * Parámetros para filtros de búsqueda
 */
export interface TipoEventoFiltros {
  busqueda?: string;
  activo?: boolean;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
  pagina?: number;
  limite?: number;
}