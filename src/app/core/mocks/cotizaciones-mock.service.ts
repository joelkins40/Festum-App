import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map } from 'rxjs';
import {
	Cotizacion,
	CotizacionEstado,
	CotizacionStats,
} from '../models/cotizacion.model';

/**
 * Servicio mock para gestionar cotizaciones
 * Este servicio simula llamadas a un backend con delays artificiales
 * NOTA: Reemplazar con servicio real que consuma API REST
 */
@Injectable({
	providedIn: 'root',
})
export class CotizacionesMockService {
	// Estado reactivo de las cotizaciones
	private cotizacionesSubject = new BehaviorSubject<Cotizacion[]>([]);
	public cotizaciones$ = this.cotizacionesSubject.asObservable();

	// Datos mock iniciales
	private mockCotizaciones: Cotizacion[] = [
		{
			id: 1,
			cliente: 'María González Pérez',
			fecha: new Date('2025-10-15'),
			total: 45000,
			estado: CotizacionEstado.APROBADA,
		},
		{
			id: 2,
			cliente: 'Juan Carlos Martínez',
			fecha: new Date('2025-10-18'),
			total: 32500,
			estado: CotizacionEstado.PENDIENTE,
		},
		{
			id: 3,
			cliente: 'Ana Sofía Ramírez',
			fecha: new Date('2025-10-20'),
			total: 67800,
			estado: CotizacionEstado.APROBADA,
		},
		{
			id: 4,
			cliente: 'Roberto Hernández López',
			fecha: new Date('2025-10-22'),
			total: 28900,
			estado: CotizacionEstado.RECHAZADA,
		},
		{
			id: 5,
			cliente: 'Carmen Díaz Fernández',
			fecha: new Date('2025-10-25'),
			total: 54200,
			estado: CotizacionEstado.PENDIENTE,
		},
		{
			id: 6,
			cliente: 'Luis Alberto Torres',
			fecha: new Date('2025-10-28'),
			total: 41300,
			estado: CotizacionEstado.APROBADA,
		},
		{
			id: 7,
			cliente: 'Patricia Morales Ruiz',
			fecha: new Date('2025-10-30'),
			total: 38700,
			estado: CotizacionEstado.PENDIENTE,
		},
		{
			id: 8,
			cliente: 'Fernando Sánchez García',
			fecha: new Date('2025-11-01'),
			total: 72500,
			estado: CotizacionEstado.APROBADA,
		},
		{
			id: 9,
			cliente: 'Gabriela Castro Mendoza',
			fecha: new Date('2025-11-03'),
			total: 25600,
			estado: CotizacionEstado.RECHAZADA,
		},
		{
			id: 10,
			cliente: 'Miguel Ángel Vargas',
			fecha: new Date('2025-11-05'),
			total: 59800,
			estado: CotizacionEstado.PENDIENTE,
		},
		{
			id: 11,
			cliente: 'Daniela Ortiz Flores',
			fecha: new Date('2025-11-07'),
			total: 48900,
			estado: CotizacionEstado.APROBADA,
		},
		{
			id: 12,
			cliente: 'Ricardo Medina Silva',
			fecha: new Date('2025-11-09'),
			total: 36400,
			estado: CotizacionEstado.PENDIENTE,
		},
	];

	constructor() {
		// Inicializar el subject con los datos mock
		this.cotizacionesSubject.next(this.mockCotizaciones);
	}

	/**
	 * Obtiene todas las cotizaciones con un delay simulado
	 * @returns Observable con el listado de cotizaciones
	 */
	getCotizaciones(): Observable<Cotizacion[]> {
		return this.cotizaciones$.pipe(
			delay(800), // Simula latencia de red
		);
	}

	/**
	 * Obtiene una cotización por su ID
	 * @param id - ID de la cotización a buscar
	 * @returns Observable con la cotización encontrada o undefined
	 */
	getCotizacionById(id: number): Observable<Cotizacion | undefined> {
		return this.cotizaciones$.pipe(
			map((cotizaciones) => cotizaciones.find((c) => c.id === id)),
			delay(300),
		);
	}

	/**
	 * Busca cotizaciones por nombre de cliente
	 * @param searchTerm - Término de búsqueda
	 * @returns Observable con cotizaciones filtradas
	 */
	searchCotizaciones(searchTerm: string): Observable<Cotizacion[]> {
		const term = searchTerm.toLowerCase().trim();

		if (!term) {
			return this.cotizaciones$;
		}

		return this.cotizaciones$.pipe(
			map((cotizaciones) =>
				cotizaciones.filter((c) => c.cliente.toLowerCase().includes(term)),
			),
			delay(200),
		);
	}

	/**
	 * Obtiene estadísticas de las cotizaciones
	 * @returns Observable con las estadísticas calculadas
	 */
	getStats(): Observable<CotizacionStats> {
		return this.cotizaciones$.pipe(
			map((cotizaciones) => ({
				total: cotizaciones.length,
				pendientes: cotizaciones.filter(
					(c) => c.estado === CotizacionEstado.PENDIENTE,
				).length,
				aprobadas: cotizaciones.filter(
					(c) => c.estado === CotizacionEstado.APROBADA,
				).length,
				rechazadas: cotizaciones.filter(
					(c) => c.estado === CotizacionEstado.RECHAZADA,
				).length,
			})),
			delay(200),
		);
	}

	/**
	 * Crea una nueva cotización
	 * @param cotizacion - Datos de la nueva cotización (sin ID)
	 * @returns Observable con la cotización creada
	 */
	createCotizacion(cotizacion: Omit<Cotizacion, 'id'>): Observable<Cotizacion> {
		return new Observable((observer) => {
			setTimeout(() => {
				const currentCotizaciones = this.cotizacionesSubject.value;
				const maxId = Math.max(...currentCotizaciones.map((c) => c.id), 0);
				const newCotizacion: Cotizacion = {
					...cotizacion,
					id: maxId + 1,
				};

				const updatedCotizaciones = [...currentCotizaciones, newCotizacion];
				this.cotizacionesSubject.next(updatedCotizaciones);

				observer.next(newCotizacion);
				observer.complete();
			}, 500);
		});
	}

	/**
	 * Actualiza una cotización existente
	 * @param id - ID de la cotización a actualizar
	 * @param cotizacion - Datos actualizados
	 * @returns Observable con la cotización actualizada
	 */
	updateCotizacion(
		id: number,
		cotizacion: Partial<Cotizacion>,
	): Observable<Cotizacion> {
		return new Observable((observer) => {
			setTimeout(() => {
				const currentCotizaciones = this.cotizacionesSubject.value;
				const index = currentCotizaciones.findIndex((c) => c.id === id);

				if (index !== -1) {
					const updatedCotizacion = {
						...currentCotizaciones[index],
						...cotizacion,
					};
					const updatedCotizaciones = [
						...currentCotizaciones.slice(0, index),
						updatedCotizacion,
						...currentCotizaciones.slice(index + 1),
					];

					this.cotizacionesSubject.next(updatedCotizaciones);
					observer.next(updatedCotizacion);
				} else {
					observer.error(new Error(`Cotización con ID ${id} no encontrada`));
				}

				observer.complete();
			}, 500);
		});
	}

	/**
	 * Elimina una cotización
	 * @param id - ID de la cotización a eliminar
	 * @returns Observable que completa cuando se elimina
	 */
	deleteCotizacion(id: number): Observable<void> {
		return new Observable((observer) => {
			setTimeout(() => {
				const currentCotizaciones = this.cotizacionesSubject.value;
				const updatedCotizaciones = currentCotizaciones.filter(
					(c) => c.id !== id,
				);

				if (updatedCotizaciones.length < currentCotizaciones.length) {
					this.cotizacionesSubject.next(updatedCotizaciones);
					observer.next();
				} else {
					observer.error(new Error(`Cotización con ID ${id} no encontrada`));
				}

				observer.complete();
			}, 500);
		});
	}
}
