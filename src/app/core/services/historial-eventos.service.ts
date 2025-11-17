import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
	EventoHistorial,
	CreateEventoHistorialDto,
	UpdateEventoHistorialDto,
	EventoHistorialResponse,
} from '../../../core/models/evento-historial.model';

@Injectable({
	providedIn: 'root',
})
export class HistorialEventosService {
	private eventosSubject = new BehaviorSubject<EventoHistorial[]>([
		{
			id: 1,
			cliente: 'Juan Pérez García',
			tipoEvento: 'Boda',
			fechaEvento: new Date('2024-06-15'),
			lugar: 'Salón Real del Bosque',
			montoTotal: 85000,
		},
		{
			id: 2,
			cliente: 'María González López',
			tipoEvento: 'XV Años',
			fechaEvento: new Date('2024-08-22'),
			lugar: 'Jardín Las Magnolias',
			montoTotal: 45000,
		},
		{
			id: 3,
			cliente: 'Carlos Rodríguez Martínez',
			tipoEvento: 'Bautizo',
			fechaEvento: new Date('2024-09-10'),
			lugar: 'Casa de eventos La Hacienda',
			montoTotal: 28000,
		},
		{
			id: 4,
			cliente: 'Ana Sánchez Hernández',
			tipoEvento: 'Primera Comunión',
			fechaEvento: new Date('2024-10-05'),
			lugar: 'Salón Los Girasoles',
			montoTotal: 32000,
		},
		{
			id: 5,
			cliente: 'Roberto Jiménez Castro',
			tipoEvento: 'Aniversario',
			fechaEvento: new Date('2024-11-18'),
			lugar: 'Terraza Vista Hermosa',
			montoTotal: 55000,
		},
		{
			id: 6,
			cliente: 'Laura Díaz Ramírez',
			tipoEvento: 'Graduación',
			fechaEvento: new Date('2024-12-02'),
			lugar: 'Club Deportivo El Roble',
			montoTotal: 38000,
		},
		{
			id: 7,
			cliente: 'Fernando Torres Vega',
			tipoEvento: 'Boda',
			fechaEvento: new Date('2025-01-20'),
			lugar: 'Salón Real del Bosque',
			montoTotal: 95000,
		},
		{
			id: 8,
			cliente: 'Patricia Morales Luna',
			tipoEvento: 'Baby Shower',
			fechaEvento: new Date('2025-02-14'),
			lugar: 'Jardín Las Rosas',
			montoTotal: 22000,
		},
	]);

	public eventos$ = this.eventosSubject.asObservable();

	getEventos(): Observable<EventoHistorialResponse> {
		return of({
			success: true,
			message: 'Eventos obtenidos exitosamente',
			data: this.eventosSubject.value,
		}).pipe(delay(300));
	}

	getEventoById(id: number): Observable<EventoHistorialResponse> {
		const evento = this.eventosSubject.value.find((e) => e.id === id);
		return of({
			success: evento ? true : false,
			message: evento ? 'Evento encontrado' : 'Evento no encontrado',
			data: evento,
		}).pipe(delay(200));
	}

	createEvento(
		dto: CreateEventoHistorialDto,
	): Observable<EventoHistorialResponse> {
		const eventos = this.eventosSubject.value;
		const newId = Math.max(...eventos.map((e) => e.id), 0) + 1;

		const nuevoEvento: EventoHistorial = {
			id: newId,
			...dto,
		};

		const nuevosEventos = [...eventos, nuevoEvento];
		this.eventosSubject.next(nuevosEventos);

		return of({
			success: true,
			message: 'Evento creado exitosamente',
			data: nuevoEvento,
		}).pipe(delay(300));
	}

	updateEvento(
		dto: UpdateEventoHistorialDto,
	): Observable<EventoHistorialResponse> {
		const eventos = this.eventosSubject.value;
		const index = eventos.findIndex((e) => e.id === dto.id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Evento no encontrado',
			}).pipe(delay(200));
		}

		const eventoActualizado: EventoHistorial = {
			...eventos[index],
			...dto,
		};

		const nuevosEventos = [...eventos];
		nuevosEventos[index] = eventoActualizado;
		this.eventosSubject.next(nuevosEventos);

		return of({
			success: true,
			message: 'Evento actualizado exitosamente',
			data: eventoActualizado,
		}).pipe(delay(300));
	}

	deleteEvento(id: number): Observable<EventoHistorialResponse> {
		const eventos = this.eventosSubject.value;
		const evento = eventos.find((e) => e.id === id);

		if (!evento) {
			return of({
				success: false,
				message: 'Evento no encontrado',
			}).pipe(delay(200));
		}

		const nuevosEventos = eventos.filter((e) => e.id !== id);
		this.eventosSubject.next(nuevosEventos);

		return of({
			success: true,
			message: 'Evento eliminado exitosamente',
			data: evento,
		}).pipe(delay(300));
	}
}
