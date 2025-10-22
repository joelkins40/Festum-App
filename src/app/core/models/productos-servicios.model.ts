import { Categoria } from './categoria.model';

/**
 * Modelo de datos para Producto o Servicio
 */
export interface ProductoServicio {
  id: number;
  tipo: 'Producto' | 'Servicio';
  categoriaId: number;
  categoria?: Categoria; // Información de la categoría (relación)
  clave: string;
  cantidadStock: number;
  nombre: string;
  descripcion: string;
  precioPublico: number;
  precioEspecial: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  activo?: boolean;
}

/**
 * DTO para crear un nuevo producto o servicio
 */
export interface CrearProductoServicioDto {
  tipo: 'Producto' | 'Servicio';
  categoriaId: number;
  clave: string;
  cantidadStock: number;
  nombre: string;
  descripcion: string;
  precioPublico: number;
  precioEspecial: number;
}

/**
 * DTO para actualizar un producto o servicio
 */
export interface ActualizarProductoServicioDto {
  id: number;
  tipo: 'Producto' | 'Servicio';
  categoriaId: number;
  clave: string;
  cantidadStock: number;
  nombre: string;
  descripcion: string;
  precioPublico: number;
  precioEspecial: number;
}

/**
 * Respuesta de la API para operaciones de productos/servicios
 */
export interface ProductoServicioResponse {
  success: boolean;
  message: string;
  data?: ProductoServicio | ProductoServicio[];
  totalRecords?: number;
}

/**
 * Parámetros para filtros de búsqueda
 */
export interface ProductoServicioFiltros {
  busqueda?: string;
  tipo?: 'Producto' | 'Servicio';
  categoriaId?: number;
  activo?: boolean;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
  pagina?: number;
  limite?: number;
}