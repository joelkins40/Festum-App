/**
 * Estado del evento en el cronograma
 */
export enum EventStatus {
	PENDING = 'Pending',
	CONFIRMED = 'Confirmed',
	COMPLETED = 'Completed',
	CANCELED = 'Canceled',
}

/**
 * Tipo de vista del cronograma
 */
export enum ViewMode {
	MONTHLY = 'monthly',
	YEARLY = 'yearly',
}

/**
 * Tipo de ubicación del evento
 */
export enum LocationType {
	ADDRESS = 'address',
	SALON = 'salon',
}

/**
 * Cliente simplificado para el cronograma
 */
export interface TimelineClient {
	id: number;
	nombre: string;
}

/**
 * Ubicación del evento
 */
export interface EventLocation {
	type: LocationType;
	address?: string;
	salonName?: string;
	salonId?: number;
}

/**
 * Evento en el cronograma
 */
export interface TimelineEvent {
	id: number;
	nombre: string;
	cliente: TimelineClient;
	fechaInicio: Date;
	fechaFin: Date;
	ubicacion: EventLocation;
	descripcion?: string;
	status: EventStatus;
	color?: string;
}

/**
 * Agrupación de eventos por mes
 */
export interface MonthGroup {
	month: string;
	monthNumber: number;
	year: number;
	events: TimelineEvent[];
}

/**
 * Agrupación de eventos por año
 */
export interface YearGroup {
	year: number;
	totalEvents: number;
	months: MonthGroup[];
}

/**
 * DTO para crear evento
 */
export interface CreateEventDto {
	nombre: string;
	clienteId: number;
	fechaInicio: Date;
	fechaFin: Date;
	ubicacion: EventLocation;
	descripcion?: string;
	status: EventStatus;
}

/**
 * DTO para actualizar evento
 */
export interface UpdateEventDto extends CreateEventDto {
	id: number;
}
