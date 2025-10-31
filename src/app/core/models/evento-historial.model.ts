/**
 * Modelo de evento para historial
 */
export interface EventoHistorial {
	id: number;
	cliente: string;
	tipoEvento: string;
	fechaEvento: Date;
	lugar: string;
	montoTotal?: number;
}

/**
 * DTO para crear evento en historial
 */
export interface CreateEventoHistorialDto {
	cliente: string;
	tipoEvento: string;
	fechaEvento: Date;
	lugar: string;
	montoTotal?: number;
}

/**
 * DTO para actualizar evento en historial
 */
export interface UpdateEventoHistorialDto extends CreateEventoHistorialDto {
	id: number;
}

/**
 * Respuesta del servicio de historial
 */
export interface EventoHistorialResponse {
	success: boolean;
	message: string;
	data?: EventoHistorial | EventoHistorial[];
}
