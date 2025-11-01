import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Invitado, Evento, CheckingStats } from './models/invitado.model';

/**
 * Servicio mock para gestión de checking de invitados
 * Simula operaciones de backend con datos en memoria
 */
@Injectable({
	providedIn: 'root',
})
export class CheckingInvitadosService {
	// Eventos disponibles (mock)
	private eventosSubject = new BehaviorSubject<Evento[]>([
		{
			id: 1,
			name: 'Boda García-Martínez',
			date: '2025-01-15',
			folio: 'NV-00001',
			totalGuests: 150,
		},
		{
			id: 2,
			name: 'XV Años María',
			date: '2025-01-20',
			folio: 'NV-00002',
			totalGuests: 80,
		},
		{
			id: 3,
			name: 'Bautizo Familia Rodríguez',
			date: '2025-01-25',
			folio: 'NV-00003',
			totalGuests: 50,
		},
		{
			id: 4,
			name: 'Aniversario Empresa TechCorp',
			date: '2025-02-01',
			folio: 'NV-00004',
			totalGuests: 120,
		},
	]);

	// Invitados por evento (mock)
	private invitadosMap = new Map<number, BehaviorSubject<Invitado[]>>();

	constructor() {
		this.initializeMockData();
	}

	/**
	 * Inicializa datos mock para cada evento
	 */
	private initializeMockData(): void {
		// Evento 1: Boda García-Martínez
		this.invitadosMap.set(
			1,
			new BehaviorSubject<Invitado[]>([
				{
					id: 1,
					fullName: 'María García López',
					contactPhone: '+52 55 1234 5678',
					secondaryPhone: '+52 55 8765 4321',
					email: 'maria.garcia@email.com',
					companions: 2,
					willAttend: true,
					checkedIn: true,
					reservationCode: 'NV001-001',
					checkInTime: '2025-01-15T18:30:00',
				},
				{
					id: 2,
					fullName: 'Juan Carlos Martínez',
					contactPhone: '+52 33 2345 6789',
					email: 'juan.martinez@email.com',
					companions: 1,
					willAttend: true,
					checkedIn: true,
					reservationCode: 'NV001-002',
					checkInTime: '2025-01-15T18:35:00',
				},
				{
					id: 3,
					fullName: 'Ana Patricia Rodríguez',
					contactPhone: '+52 81 3456 7890',
					secondaryPhone: '+52 81 9876 5432',
					email: 'ana.rodriguez@email.com',
					companions: 0,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV001-003',
				},
				{
					id: 4,
					fullName: 'Carlos Eduardo Hernández',
					contactPhone: '+52 55 4567 8901',
					companions: 3,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV001-004',
				},
				{
					id: 5,
					fullName: 'Laura Fernández Sánchez',
					contactPhone: '+52 33 5678 9012',
					secondaryPhone: '+52 33 1234 9876',
					email: 'laura.fernandez@email.com',
					companions: 2,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV001-005',
				},
				{
					id: 6,
					fullName: 'Roberto Pérez González',
					contactPhone: '+52 81 6789 0123',
					email: 'roberto.perez@email.com',
					companions: 1,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV001-006',
				},
				{
					id: 7,
					fullName: 'Diana Morales Castro',
					contactPhone: '+52 55 7890 1234',
					secondaryPhone: '+52 55 4321 8765',
					email: 'diana.morales@email.com',
					companions: 0,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV001-007',
				},
				{
					id: 8,
					fullName: 'Miguel Ángel Torres',
					contactPhone: '+52 33 8901 2345',
					companions: 4,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV001-008',
				},
			]),
		);

		// Evento 2: XV Años María
		this.invitadosMap.set(
			2,
			new BehaviorSubject<Invitado[]>([
				{
					id: 9,
					fullName: 'Sofía Ramírez',
					contactPhone: '+52 55 1111 2222',
					email: 'sofia.ramirez@email.com',
					companions: 1,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV002-001',
				},
				{
					id: 10,
					fullName: 'Pedro López Sánchez',
					contactPhone: '+52 33 3333 4444',
					companions: 2,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV002-002',
				},
				{
					id: 11,
					fullName: 'Isabel Gómez',
					contactPhone: '+52 81 5555 6666',
					email: 'isabel.gomez@email.com',
					companions: 0,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV002-003',
				},
			]),
		);

		// Evento 3: Bautizo
		this.invitadosMap.set(
			3,
			new BehaviorSubject<Invitado[]>([
				{
					id: 12,
					fullName: 'Antonio Ruiz',
					contactPhone: '+52 55 7777 8888',
					companions: 3,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV003-001',
				},
				{
					id: 13,
					fullName: 'Carmen Flores',
					contactPhone: '+52 33 9999 0000',
					email: 'carmen.flores@email.com',
					companions: 1,
					willAttend: true,
					checkedIn: false,
					reservationCode: 'NV003-002',
				},
			]),
		);
	}

	/**
	 * Obtiene la lista de eventos disponibles
	 */
	getEventos(): Observable<Evento[]> {
		return this.eventosSubject.asObservable().pipe(delay(200));
	}

	/**
	 * Obtiene los invitados de un evento específico
	 */
	getInvitadosByEvento(eventId: number): Observable<Invitado[]> {
		const subject = this.invitadosMap.get(eventId);
		if (subject) {
			return subject.asObservable().pipe(delay(300));
		}
		return of([]).pipe(delay(300));
	}

	/**
	 * Registra el check-in de un invitado
	 */
	checkInInvitado(eventId: number, invitadoId: number): Observable<boolean> {
		const subject = this.invitadosMap.get(eventId);
		if (!subject) {
			return of(false).pipe(delay(200));
		}

		const invitados = subject.value;
		const index = invitados.findIndex((inv) => inv.id === invitadoId);

		if (index !== -1) {
			const updatedInvitados = [...invitados];
			updatedInvitados[index] = {
				...updatedInvitados[index],
				checkedIn: true,
				checkInTime: new Date().toISOString(),
			};
			subject.next(updatedInvitados);
			return of(true).pipe(delay(200));
		}

		return of(false).pipe(delay(200));
	}

	/**
	 * Deshace el check-in de un invitado (útil para correcciones)
	 */
	undoCheckIn(eventId: number, invitadoId: number): Observable<boolean> {
		const subject = this.invitadosMap.get(eventId);
		if (!subject) {
			return of(false).pipe(delay(200));
		}

		const invitados = subject.value;
		const index = invitados.findIndex((inv) => inv.id === invitadoId);

		if (index !== -1) {
			const updatedInvitados = [...invitados];
			updatedInvitados[index] = {
				...updatedInvitados[index],
				checkedIn: false,
				checkInTime: undefined,
			};
			subject.next(updatedInvitados);
			return of(true).pipe(delay(200));
		}

		return of(false).pipe(delay(200));
	}

	/**
	 * Busca invitados por nombre o código de reservación
	 */
	searchInvitado(eventId: number, term: string): Observable<Invitado[]> {
		const subject = this.invitadosMap.get(eventId);
		if (!subject) {
			return of([]).pipe(delay(200));
		}

		const lowerTerm = term.toLowerCase();
		return subject.asObservable().pipe(
			map((invitados) =>
				invitados.filter(
					(inv) =>
						inv.fullName.toLowerCase().includes(lowerTerm) ||
						inv.reservationCode.toLowerCase().includes(lowerTerm) ||
						inv.contactPhone.includes(term),
				),
			),
			delay(200),
		);
	}

	/**
	 * Obtiene estadísticas de asistencia para un evento
	 */
	getStats(eventId: number): Observable<CheckingStats> {
		const subject = this.invitadosMap.get(eventId);
		if (!subject) {
			return of({
				totalGuests: 0,
				checkedIn: 0,
				pending: 0,
				totalPeople: 0,
			}).pipe(delay(100));
		}

		return subject.asObservable().pipe(
			map((invitados) => {
				const checkedIn = invitados.filter((inv) => inv.checkedIn).length;
				const totalPeople = invitados
					.filter((inv) => inv.checkedIn)
					.reduce((sum, inv) => sum + 1 + inv.companions, 0);

				return {
					totalGuests: invitados.length,
					checkedIn,
					pending: invitados.length - checkedIn,
					totalPeople,
				};
			}),
			delay(100),
		);
	}

	/**
	 * Busca un invitado por código de reservación (útil para QR)
	 */
	findByReservationCode(
		eventId: number,
		code: string,
	): Observable<Invitado | null> {
		const subject = this.invitadosMap.get(eventId);
		if (!subject) {
			return of(null).pipe(delay(200));
		}

		return subject.asObservable().pipe(
			map(
				(invitados) =>
					invitados.find(
						(inv) => inv.reservationCode.toLowerCase() === code.toLowerCase(),
					) || null,
			),
			delay(200),
		);
	}
}
