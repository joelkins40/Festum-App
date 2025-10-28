/**
 * Estructura de dirección completa
 */
export interface Direccion {
	fullAddress: string;
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	lat: number;
	lng: number;
}

/**
 * Modelo de datos para Cliente
 */
export interface Cliente {
	id: number;
	nombre: string;
	direccion: Direccion;
	clientePreferente: boolean;
	fechaCreacion?: Date;
	fechaActualizacion?: Date;
	activo?: boolean;
}

/**
 * DTO para crear un nuevo cliente
 */
export interface CrearClienteDto {
	nombre: string;
	direccion: Direccion;
	clientePreferente: boolean;
}

/**
 * DTO para actualizar un cliente
 */
export interface ActualizarClienteDto {
	id: number;
	nombre: string;
	direccion: Direccion;
	clientePreferente: boolean;
}

/**
 * Respuesta de la API para operaciones de clientes
 */
export interface ClienteResponse {
	success: boolean;
	message: string;
	data?: Cliente | Cliente[];
	totalRecords?: number;
}

/**
 * Parámetros para filtros de búsqueda
 */
export interface ClienteFiltros {
	busqueda?: string;
	clientePreferente?: boolean;
	activo?: boolean;
	ordenarPor?: string;
	direccion?: 'asc' | 'desc';
	pagina?: number;
	limite?: number;
}

/**
 * Configuración para la tabla de clientes
 */
export interface ClienteTableConfig {
	columnas: string[];
	mostrarAcciones: boolean;
	mostrarPaginacion: boolean;
}

/**
 * Datos para el diálogo de cliente
 */
export interface ClienteDialogData {
	modo: 'crear' | 'editar' | 'ver';
	cliente?: Cliente;
	titulo?: string;
}
