/**
 * Modelo de datos para Salon
 */
export interface Salon {
	id: number;
	nombre: string;
	direccion: string;
	capacidadDePersonas: number;
	tipoEvento: {
		id: number;
		descripcion: string;
	};
	precioRenta: number;
	telefonoContacto?: string;
	fechaCreacion?: Date;
	fechaActualizacion?: Date;
	activo?: boolean;
}

/**
 * DTO para crear un nuevo Salon
 */
export interface CrearSalonDto {
	nombre: string;
	direccion: string;
	capacidadDePersonas: number;
	tipoEventoId: number;
	precioRenta: number;
	telefonoContacto?: string;
}

/**
 * DTO para actualizar un Salon
 */
export interface ActualizarSalonDto {
	id: number;
	nombre: string;
	direccion: string;
	capacidadDePersonas: number;
	tipoEventoId: number;
	precioRenta: number;
	telefonoContacto?: string;
}

/**
 * Respuesta de la API para operaciones de Salones
 */
export interface SalonResponse {
	success: boolean;
	message?: string;
	data?: Salon | Salon[];
	totalRecords?: number;
}

/**
 * Filtros para búsqueda de salones
 */
export interface SalonFiltros {
	busqueda?: string;
	tipoEventoId?: number;
	activo?: boolean;
	capacidadMinima?: number;
	capacidadMaxima?: number;
	ordenarPor?: keyof Salon;
	direccion?: 'asc' | 'desc';
	pagina?: number;
	limite?: number;
}
