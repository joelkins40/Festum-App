import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Interface para representar un invitado
 */
export interface Invitado {
	id: number;
	fullName: string;
	contactPhone: string;
	secondaryContactPhone?: string;
	email?: string;
	numberOfCompanions: number;
	willAttend: boolean;
}

/**
 * Interface para la respuesta de operaciones CRUD
 */
export interface InvitadoResponse {
	success: boolean;
	message: string;
	data?: Invitado | Invitado[];
}

/**
 * Servicio mock para gestión de invitados
 * Simula operaciones de backend con datos en memoria
 */
@Injectable({
	providedIn: 'root',
})
export class InvitadosMockService {
	// BehaviorSubject para mantener el estado de los invitados
	private invitadosSubject = new BehaviorSubject<Invitado[]>([
		{
			id: 1,
			fullName: 'María García López',
			contactPhone: '+52 55 1234 5678',
			secondaryContactPhone: '+52 55 8765 4321',
			email: 'maria.garcia@email.com',
			numberOfCompanions: 2,
			willAttend: true,
		},
		{
			id: 2,
			fullName: 'Juan Carlos Martínez',
			contactPhone: '+52 33 2345 6789',
			email: 'juan.martinez@email.com',
			numberOfCompanions: 1,
			willAttend: true,
		},
		{
			id: 3,
			fullName: 'Ana Patricia Rodríguez',
			contactPhone: '+52 81 3456 7890',
			secondaryContactPhone: '+52 81 9876 5432',
			email: 'ana.rodriguez@email.com',
			numberOfCompanions: 0,
			willAttend: false,
		},
		{
			id: 4,
			fullName: 'Carlos Eduardo Hernández',
			contactPhone: '+52 55 4567 8901',
			numberOfCompanions: 3,
			willAttend: true,
		},
		{
			id: 5,
			fullName: 'Laura Fernández Sánchez',
			contactPhone: '+52 33 5678 9012',
			secondaryContactPhone: '+52 33 1234 9876',
			email: 'laura.fernandez@email.com',
			numberOfCompanions: 2,
			willAttend: true,
		},
		{
			id: 6,
			fullName: 'Roberto Pérez González',
			contactPhone: '+52 81 6789 0123',
			email: 'roberto.perez@email.com',
			numberOfCompanions: 0,
			willAttend: false,
		},
		{
			id: 7,
			fullName: 'Diana Morales Castro',
			contactPhone: '+52 55 7890 1234',
			secondaryContactPhone: '+52 55 4321 8765',
			email: 'diana.morales@email.com',
			numberOfCompanions: 1,
			willAttend: true,
		},
		{
			id: 8,
			fullName: 'Miguel Ángel Torres',
			contactPhone: '+52 33 8901 2345',
			numberOfCompanions: 4,
			willAttend: true,
		},
	]);

	// Observable público para suscribirse a los cambios
	public invitados$ = this.invitadosSubject.asObservable();

	// Contador para generar IDs únicos
	private nextId = 9;

	/**
	 * Obtiene todos los invitados
	 * Simula una llamada HTTP con delay
	 */
	getInvitados(): Observable<InvitadoResponse> {
		return of({
			success: true,
			message: 'Invitados obtenidos exitosamente',
			data: this.invitadosSubject.value,
		}).pipe(delay(300));
	}

	/**
	 * Obtiene un invitado por ID
	 */
	getInvitadoById(id: number): Observable<InvitadoResponse> {
		const invitado = this.invitadosSubject.value.find((inv) => inv.id === id);

		if (invitado) {
			return of({
				success: true,
				message: 'Invitado encontrado',
				data: invitado,
			}).pipe(delay(200));
		}

		return of({
			success: false,
			message: 'Invitado no encontrado',
		}).pipe(delay(200));
	}

	/**
	 * Crea un nuevo invitado
	 */
	createInvitado(invitado: Omit<Invitado, 'id'>): Observable<InvitadoResponse> {
		const newInvitado: Invitado = {
			...invitado,
			id: this.nextId++,
		};

		const currentInvitados = this.invitadosSubject.value;
		this.invitadosSubject.next([...currentInvitados, newInvitado]);

		return of({
			success: true,
			message: 'Invitado creado exitosamente',
			data: newInvitado,
		}).pipe(delay(300));
	}

	/**
	 * Actualiza un invitado existente
	 */
	updateInvitado(invitado: Invitado): Observable<InvitadoResponse> {
		const currentInvitados = this.invitadosSubject.value;
		const index = currentInvitados.findIndex((inv) => inv.id === invitado.id);

		if (index !== -1) {
			const updatedInvitados = [...currentInvitados];
			updatedInvitados[index] = invitado;
			this.invitadosSubject.next(updatedInvitados);

			return of({
				success: true,
				message: 'Invitado actualizado exitosamente',
				data: invitado,
			}).pipe(delay(300));
		}

		return of({
			success: false,
			message: 'Invitado no encontrado',
		}).pipe(delay(300));
	}

	/**
	 * Elimina un invitado
	 */
	deleteInvitado(id: number): Observable<InvitadoResponse> {
		const currentInvitados = this.invitadosSubject.value;
		const filteredInvitados = currentInvitados.filter((inv) => inv.id !== id);

		if (filteredInvitados.length < currentInvitados.length) {
			this.invitadosSubject.next(filteredInvitados);

			return of({
				success: true,
				message: 'Invitado eliminado exitosamente',
			}).pipe(delay(300));
		}

		return of({
			success: false,
			message: 'Invitado no encontrado',
		}).pipe(delay(300));
	}

	/**
	 * Busca invitados por nombre o teléfono
	 */
	searchInvitados(query: string): Observable<InvitadoResponse> {
		const lowerQuery = query.toLowerCase();
		const filtered = this.invitadosSubject.value.filter(
			(inv) =>
				inv.fullName.toLowerCase().includes(lowerQuery) ||
				inv.contactPhone.includes(query) ||
				inv.secondaryContactPhone?.includes(query) ||
				inv.email?.toLowerCase().includes(lowerQuery),
		);

		return of({
			success: true,
			message: 'Búsqueda completada',
			data: filtered,
		}).pipe(delay(200));
	}

	/**
	 * Obtiene estadísticas de invitados
	 */
	getStats(): Observable<{
		total: number;
		confirmed: number;
		pending: number;
		totalCompanions: number;
	}> {
		const invitados = this.invitadosSubject.value;
		const confirmed = invitados.filter((inv) => inv.willAttend).length;
		const totalCompanions = invitados.reduce(
			(sum, inv) => sum + (inv.willAttend ? inv.numberOfCompanions : 0),
			0,
		);

		return of({
			total: invitados.length,
			confirmed,
			pending: invitados.length - confirmed,
			totalCompanions,
		}).pipe(delay(100));
	}
}
