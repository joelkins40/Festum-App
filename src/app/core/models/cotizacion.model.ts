// Modelo de datos para el módulo de cotizaciones

/**
 * Enumeración de posibles estados de una cotización
 */
export enum CotizacionEstado {
	PENDIENTE = 'Pendiente',
	APROBADA = 'Aprobada',
	RECHAZADA = 'Rechazada',
}

/**
 * Interfaz que representa una cotización en el sistema
 */
export interface Cotizacion {
	id: number;
	cliente: string;
	fecha: Date;
	total: number;
	estado: CotizacionEstado;
}

/**
 * Estadísticas generales de cotizaciones
 */
export interface CotizacionStats {
	total: number;
	pendientes: number;
	aprobadas: number;
	rechazadas: number;
}
