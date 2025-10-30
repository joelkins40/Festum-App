/**
 * Estructura de dirección completa con formato Geoapify
 */
export interface Direccion {
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	formatted: {
		line1: string;
		line2: string;
		line3: string;
	};
	geoapifyPlaceId: string;
	confidence: number;
	source: 'Geoapify';
}

/**
 * Modelo de datos para Cliente
 */
export interface Cliente {
	id: number;
	nombre: string;
	direcciones: Direccion[];
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
	direcciones: Direccion[];
	clientePreferente: boolean;
}

/**
 * DTO para actualizar un cliente
 */
export interface ActualizarClienteDto {
	id: number;
	nombre: string;
	direcciones: Direccion[];
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

/**
 * Interface para manejar las respuestas de autocompletado de Geoapify
 */
export interface GeoapifyAutocompleteResponse {
	type: string;
	features: GeoapifyFeature[];
	query: GeoapifyQuery;
}

export interface GeoapifyFeature {
	type: string;
	properties: GeoapifyProperties;
	geometry: {
		type: string;
		coordinates: number[];
	};
	bbox: number[];
}

export interface GeoapifyProperties {
	datasource: {
		sourcename: string;
		attribution: string;
		license: string;
		url: string;
	};
	country: string;
	country_code: string;
	region?: string;
	state: string;
	city: string;
	lon: number;
	lat: number;
	result_type: string;
	formatted: string;
	address_line1: string;
	address_line2: string;
	rank: {
		importance: number;
		confidence: number;
		confidence_city_level: number;
		match_type: string;
	};
	place_id: string;
	county?: string;
	state_code?: string;
	suburb?: string;
	hamlet?: string;
	name?: string;
	district?: string;
	town?: string;
}

export interface GeoapifyQuery {
	text: string;
	parsed: {
		city: string;
		expected_type: string;
	};
	categories: unknown[];
}
