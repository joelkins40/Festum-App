import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Cliente {
	id: number;
	nombre: string;
	clienteEspecial?: boolean;
	direcciones?: Direccion[];
	activo?: boolean;
}

export interface Direccion {
	id?: number;
	fullAddress: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	lat?: number;
	lng?: number;
}

export interface Lugar {
	tipo: 'direccionCliente' | 'nuevaDireccion' | 'salonExistente';
	direccion?: Direccion;
	salonId?: number;
	nombreSalon?: string;
}

export interface ProductoNota {
	id: number;
	nombre: string;
	descripcion?: string;
	cantidad: number;
	precioUnitario: number;
	subtotal: number;
	esServicio?: boolean;
	precioEspecial?: number;
}

export interface Evento {
	id?: number;
	folio: string;
	fechaRecepcion: Date;
	fechaRegreso: Date;
	nombreEvento: string;
	cliente: Cliente;
	lugar: Lugar;
	productos: ProductoNota[];
	total: number;
}

export interface EventoResponse {
	success: boolean;
	message: string;
	data?: Evento | Evento[];
}

@Injectable({
	providedIn: 'root',
})
export class ListaEventosService {
	private eventosSubject = new BehaviorSubject<Evento[]>([
		{
			id: 1,
			folio: 'NV-00001',
			fechaRecepcion: new Date('2025-01-15'),
			fechaRegreso: new Date('2025-01-16'),
			nombreEvento: 'Boda García-Martínez',
			cliente: {
				id: 1,
				nombre: 'Juan García',
				clienteEspecial: true,
				activo: true,
			},
			lugar: {
				tipo: 'direccionCliente',
				direccion: {
					fullAddress: 'Av. Principal 123, Col. Centro',
					city: 'Ciudad de México',
					state: 'CDMX',
					country: 'México',
					postalCode: '06000',
				},
			},
			productos: [
				{
					id: 1,
					nombre: 'Sillas Tiffany',
					descripcion: 'Sillas elegantes color blanco',
					cantidad: 150,
					precioUnitario: 45.0,
					subtotal: 6750.0,
					esServicio: false,
				},
				{
					id: 2,
					nombre: 'Mesas Redondas',
					descripcion: 'Mesas para 10 personas',
					cantidad: 15,
					precioUnitario: 120.0,
					subtotal: 1800.0,
					esServicio: false,
				},
			],
			total: 8550.0,
		},
		{
			id: 2,
			folio: 'NV-00002',
			fechaRecepcion: new Date('2025-02-10'),
			fechaRegreso: new Date('2025-02-11'),
			nombreEvento: 'XV Años María',
			cliente: {
				id: 2,
				nombre: 'María López',
				clienteEspecial: false,
				activo: true,
			},
			lugar: {
				tipo: 'salonExistente',
				salonId: 1,
				nombreSalon: 'Salón Las Magnolias',
			},
			productos: [
				{
					id: 3,
					nombre: 'Decoración Floral',
					descripcion: 'Arreglos florales diversos',
					cantidad: 20,
					precioUnitario: 85.0,
					subtotal: 1700.0,
					esServicio: true,
				},
				{
					id: 4,
					nombre: 'Iluminación LED',
					descripcion: 'Sistema de iluminación completo',
					cantidad: 1,
					precioUnitario: 2500.0,
					subtotal: 2500.0,
					esServicio: true,
				},
			],
			total: 4200.0,
		},
		{
			id: 3,
			folio: 'NV-00003',
			fechaRecepcion: new Date('2025-03-05'),
			fechaRegreso: new Date('2025-03-06'),
			nombreEvento: 'Bautizo Familia Rodríguez',
			cliente: {
				id: 3,
				nombre: 'Carlos Rodríguez',
				clienteEspecial: false,
				activo: true,
			},
			lugar: {
				tipo: 'nuevaDireccion',
				direccion: {
					fullAddress: 'Calle Reforma 456, Col. Jardines',
					city: 'Guadalajara',
					state: 'Jalisco',
					country: 'México',
					postalCode: '44100',
				},
			},
			productos: [
				{
					id: 5,
					nombre: 'Manteles y Servilletas',
					descripcion: 'Juego completo color azul',
					cantidad: 30,
					precioUnitario: 35.0,
					subtotal: 1050.0,
					esServicio: false,
				},
			],
			total: 1050.0,
		},
		{
			id: 4,
			folio: 'NV-00004',
			fechaRecepcion: new Date('2025-04-20'),
			fechaRegreso: new Date('2025-04-21'),
			nombreEvento: 'Aniversario Empresa TechCorp',
			cliente: {
				id: 4,
				nombre: 'TechCorp S.A.',
				clienteEspecial: true,
				activo: true,
			},
			lugar: {
				tipo: 'salonExistente',
				salonId: 2,
				nombreSalon: 'Salón Ejecutivo Premium',
			},
			productos: [
				{
					id: 6,
					nombre: 'Equipo de Audio',
					descripcion: 'Sistema profesional de sonido',
					cantidad: 1,
					precioUnitario: 3500.0,
					subtotal: 3500.0,
					esServicio: true,
					precioEspecial: 3000.0,
				},
				{
					id: 7,
					nombre: 'Proyector y Pantalla',
					descripcion: 'Full HD con pantalla 120"',
					cantidad: 1,
					precioUnitario: 1800.0,
					subtotal: 1800.0,
					esServicio: true,
					precioEspecial: 1500.0,
				},
			],
			total: 4500.0,
		},
		{
			id: 5,
			folio: 'NV-00005',
			fechaRecepcion: new Date('2025-05-12'),
			fechaRegreso: new Date('2025-05-13'),
			nombreEvento: 'Graduación Universidad Nacional',
			cliente: {
				id: 5,
				nombre: 'Universidad Nacional',
				clienteEspecial: true,
				activo: true,
			},
			lugar: {
				tipo: 'direccionCliente',
				direccion: {
					fullAddress: 'Campus Universitario, Edificio Central',
					city: 'Monterrey',
					state: 'Nuevo León',
					country: 'México',
					postalCode: '64000',
				},
			},
			productos: [
				{
					id: 8,
					nombre: 'Sillas Apilables',
					descripcion: 'Sillas plegables resistentes',
					cantidad: 500,
					precioUnitario: 25.0,
					subtotal: 12500.0,
					esServicio: false,
					precioEspecial: 20.0,
				},
				{
					id: 9,
					nombre: 'Tarima y Escenario',
					descripcion: 'Montaje de escenario 6x8m',
					cantidad: 1,
					precioUnitario: 5000.0,
					subtotal: 5000.0,
					esServicio: true,
					precioEspecial: 4200.0,
				},
			],
			total: 14200.0,
		},
	]);

	public eventos$ = this.eventosSubject.asObservable();

	getEventos(): Observable<EventoResponse> {
		return of({
			success: true,
			message: 'Eventos obtenidos exitosamente',
			data: this.eventosSubject.value,
		}).pipe(delay(300));
	}

	getEventoById(id: number): Observable<EventoResponse> {
		const evento = this.eventosSubject.value.find((e) => e.id === id);
		return of({
			success: evento ? true : false,
			message: evento ? 'Evento encontrado' : 'Evento no encontrado',
			data: evento,
		}).pipe(delay(200));
	}

	createEvento(evento: Evento): Observable<EventoResponse> {
		const eventos = this.eventosSubject.value;
		const newId = Math.max(...eventos.map((e) => e.id ?? 0), 0) + 1;

		const nuevoEvento: Evento = {
			...evento,
			id: newId,
		};

		const nuevosEventos = [...eventos, nuevoEvento];
		this.eventosSubject.next(nuevosEventos);

		return of({
			success: true,
			message: 'Evento creado exitosamente',
			data: nuevoEvento,
		}).pipe(delay(300));
	}

	updateEvento(evento: Evento): Observable<EventoResponse> {
		const eventos = this.eventosSubject.value;
		const index = eventos.findIndex((e) => e.id === evento.id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Evento no encontrado',
			}).pipe(delay(200));
		}

		const eventoActualizado: Evento = {
			...eventos[index],
			...evento,
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

	deleteEvento(id: number): Observable<EventoResponse> {
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
