/**
 * Modelo de datos para Categoría
 */
export interface Categoria {
  id: number;
  descripcion: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  activo?: boolean;
}

/**
 * DTO para crear una nueva categoría
 */
export interface CrearCategoriaDto {
  descripcion: string;
}

/**
 * DTO para actualizar una categoría
 */
export interface ActualizarCategoriaDto {
  id: number;
  descripcion: string;
}

/**
 * Respuesta de la API para operaciones de categorías
 */
export interface CategoriaResponse {
  success: boolean;
  message: string;
  data?: Categoria | Categoria[];
  totalRecords?: number;
}

/**
 * Parámetros para filtros de búsqueda
 */
export interface CategoriaFiltros {
  busqueda?: string;
  activo?: boolean;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
  pagina?: number;
  limite?: number;
}