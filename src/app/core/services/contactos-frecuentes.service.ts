import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
	Contacto,
	CreateContactoDto,
	UpdateContactoDto,
	ContactoResponse,
} from '../../../core/models/contacto.model';

@Injectable({
	providedIn: 'root',
})
export class ContactosService {
	// Mock data - Contactos frecuentes
	private mockContactos: Contacto[] = [
		{
			id: 1,
			nombre: 'María González Rodríguez',
			informacionDeContacto: {
				phone: '+52 33 1234 5678',
				email: 'maria.gonzalez@email.com',
				contactoAlternativo: '+52 33 8765 4321',
			},
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-15'),
			activo: true,
		},
		{
			id: 2,
			nombre: 'Carlos Eduardo Martínez',
			informacionDeContacto: {
				phone: '+52 33 2345 6789',
				email: 'carlos.martinez@email.com',
			},
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-16'),
			activo: true,
		},
		{
			id: 3,
			nombre: 'Ana Lucía Hernández',
			informacionDeContacto: {
				phone: '+52 33 3456 7890',
				email: 'ana.hernandez@email.com',
				contactoAlternativo: '+52 33 9876 5432',
			},
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-17'),
			activo: true,
		},
		{
			id: 4,
			nombre: 'Roberto Silva Castro',
			informacionDeContacto: {
				phone: '+52 33 4567 8901',
				email: 'roberto.silva@email.com',
			},
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-18'),
			activo: true,
		},
		{
			id: 5,
			nombre: 'Patricia Morales López',
			informacionDeContacto: {
				phone: '+52 33 5678 9012',
				email: 'patricia.morales@email.com',
				contactoAlternativo: '+52 33 6543 2109',
			},
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-19'),
			activo: false,
		},
	];

	private contactosSubject = new BehaviorSubject<Contacto[]>(
		this.mockContactos,
	);
	public contactos$ = this.contactosSubject.asObservable();

	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading$ = this.loadingSubject.asObservable();

	/**
	 * Obtener todos los contactos
	 */
	getContactos(): Observable<ContactoResponse> {
		this.loadingSubject.next(true);

		return of({
			success: true,
			message: 'Contactos obtenidos exitosamente',
			data: this.mockContactos,
		}).pipe(
			delay(500),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Crear nuevo contacto
	 */
	createContacto(dto: CreateContactoDto): Observable<ContactoResponse> {
		this.loadingSubject.next(true);

		const newId = Math.max(...this.mockContactos.map((c) => c.id)) + 1;

		const newContacto: Contacto = {
			id: newId,
			...dto,
			fechaCreacion: new Date(),
			activo: true,
		};

		this.mockContactos.push(newContacto);
		this.contactosSubject.next([...this.mockContactos]);

		return of({
			success: true,
			message: 'Contacto creado exitosamente',
			data: newContacto,
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Actualizar contacto
	 */
	updateContacto(dto: UpdateContactoDto): Observable<ContactoResponse> {
		this.loadingSubject.next(true);

		const index = this.mockContactos.findIndex((c) => c.id === dto.id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Contacto no encontrado',
			}).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		this.mockContactos[index] = {
			...this.mockContactos[index],
			...dto,
			fechaActualizacion: new Date(),
		};

		this.contactosSubject.next([...this.mockContactos]);

		return of({
			success: true,
			message: 'Contacto actualizado exitosamente',
			data: this.mockContactos[index],
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Eliminar contacto
	 */
	deleteContacto(id: number): Observable<ContactoResponse> {
		this.loadingSubject.next(true);

		const index = this.mockContactos.findIndex((c) => c.id === id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Contacto no encontrado',
			}).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		this.mockContactos.splice(index, 1);
		this.contactosSubject.next([...this.mockContactos]);

		return of({
			success: true,
			message: 'Contacto eliminado exitosamente',
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Alternar estado activo
	 */
	toggleActive(id: number): Observable<ContactoResponse> {
		this.loadingSubject.next(true);

		const index = this.mockContactos.findIndex((c) => c.id === id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Contacto no encontrado',
			}).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		this.mockContactos[index].activo = !this.mockContactos[index].activo;
		this.contactosSubject.next([...this.mockContactos]);

		return of({
			success: true,
			message: 'Estado actualizado exitosamente',
			data: this.mockContactos[index],
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}
}
