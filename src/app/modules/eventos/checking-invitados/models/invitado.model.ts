/**
 * Modelo para representar un invitado en el sistema de checking
 */
export interface Invitado {
	id: number;
	fullName: string;
	contactPhone: string;
	secondaryPhone?: string;
	email?: string;
	companions: number;
	willAttend: boolean;
	checkedIn: boolean;
	reservationCode: string;
	checkInTime?: string;
}

/**
 * Modelo para representar un evento
 */
export interface Evento {
	id: number;
	name: string;
	date: string;
	folio: string;
	totalGuests: number;
}

/**
 * Estadísticas de asistencia
 */
export interface CheckingStats {
	totalGuests: number;
	checkedIn: number;
	pending: number;
	totalPeople: number;
}
