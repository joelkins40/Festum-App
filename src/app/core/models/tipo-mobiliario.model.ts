/**
 * Modelo de datos para Tipo de Mobiliario
 */
export interface TipoMobiliario {
	id: number;
	descripcion: string;
	fechaCreacion?: Date;
	fechaActualizacion?: Date;
	activo?: boolean;
}

/**
 * DTO para crear un nuevo tipo de mobiliario
 */
export interface CrearTipoMobiliarioDto {
	descripcion: string;
}

/**
 * DTO para actualizar un tipo de mobiliario
 */
export interface ActualizarTipoMobiliarioDto {
	id: number;
	descripcion: string;
}

/**
 * Respuesta de la API para operaciones de tipos de mobiliario
 */
export interface TipoMobiliarioResponse {
	success: boolean;
	message: string;
	data?: TipoMobiliario | TipoMobiliario[];
	totalRecords?: number;
}

/**
 * Parámetros para filtros de búsqueda
 */
export interface TipoMobiliarioFiltros {
	busqueda?: string;
	activo?: boolean;
	ordenarPor?: string;
	direccion?: 'asc' | 'desc';
	pagina?: number;
	limite?: number;
}

/**
 * Configuración para la tabla de tipos de mobiliario
 */
export interface TipoMobiliarioTableConfig {
	columnas: string[];
	mostrarAcciones: boolean;
	mostrarPaginacion: boolean;
}

/**
 * Datos para el diálogo de tipo de mobiliario
 */
export interface TipoMobiliarioDialogData {
	modo: 'crear' | 'editar' | 'ver';
	tipoMobiliario?: TipoMobiliario;
	titulo?: string;
}
