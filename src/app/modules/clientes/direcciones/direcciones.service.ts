import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
	DireccionCliente,
	CreateDireccionDto,
	UpdateDireccionDto,
	DireccionResponse,
} from './direccion.model';

@Injectable({
	providedIn: 'root',
})
export class DireccionesService {
	// Mock data
	private mockDirecciones: DireccionCliente[] = [
		{
			id: 1,
			clienteId: 1,
			cliente: 'María González Rodríguez',
			fullAddress:
				'Av. Revolución 1234, Col. Centro, Guadalajara, Jalisco, México',
			street: 'Av. Revolución',
			number: '1234',
			neighborhood: 'Centro',
			city: 'Guadalajara',
			state: 'Jalisco',
			country: 'México',
			postalCode: '44100',
			creationDate: new Date('2024-01-15'),
			active: true,
		},
		{
			id: 2,
			clienteId: 1,
			cliente: 'María González Rodríguez',
			fullAddress:
				'Calle Secundaria 100, Col. Moderna, Zapopan, Jalisco, México',
			street: 'Calle Secundaria',
			number: '100',
			neighborhood: 'Moderna',
			city: 'Zapopan',
			state: 'Jalisco',
			country: 'México',
			postalCode: '45100',
			creationDate: new Date('2024-02-10'),
			active: true,
		},
		{
			id: 3,
			clienteId: 2,
			cliente: 'Carlos Eduardo Martínez',
			fullAddress:
				'Calle Juárez 567, Col. Americana, Guadalajara, Jalisco, México',
			street: 'Calle Juárez',
			number: '567',
			neighborhood: 'Americana',
			city: 'Guadalajara',
			state: 'Jalisco',
			country: 'México',
			postalCode: '44160',
			creationDate: new Date('2024-01-16'),
			active: true,
		},
		{
			id: 4,
			clienteId: 3,
			cliente: 'Ana Lucía Hernández',
			fullAddress:
				'Av. Chapultepec 890, Col. Moderna, Guadalajara, Jalisco, México',
			street: 'Av. Chapultepec',
			number: '890',
			neighborhood: 'Moderna',
			city: 'Guadalajara',
			state: 'Jalisco',
			country: 'México',
			postalCode: '44190',
			creationDate: new Date('2024-01-17'),
			active: true,
		},
		{
			id: 5,
			clienteId: 4,
			cliente: 'Roberto Silva Castro',
			fullAddress:
				'Calle Hidalgo 345, Col. Tlaquepaque Centro, Tlaquepaque, Jalisco, México',
			street: 'Calle Hidalgo',
			number: '345',
			neighborhood: 'Tlaquepaque Centro',
			city: 'Tlaquepaque',
			state: 'Jalisco',
			country: 'México',
			postalCode: '45500',
			creationDate: new Date('2024-01-18'),
			active: false,
		},
	];

	private direccionesSubject = new BehaviorSubject<DireccionCliente[]>(
		this.mockDirecciones,
	);
	public direcciones$ = this.direccionesSubject.asObservable();

	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading$ = this.loadingSubject.asObservable();

	/**
	 * Obtener todas las direcciones
	 */
	getDirecciones(): Observable<DireccionResponse> {
		this.loadingSubject.next(true);

		return of({
			success: true,
			message: 'Direcciones obtenidas exitosamente',
			data: this.mockDirecciones,
		}).pipe(
			delay(500),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Crear nueva dirección
	 */
	createDireccion(dto: CreateDireccionDto): Observable<DireccionResponse> {
		this.loadingSubject.next(true);

		const newId = Math.max(...this.mockDirecciones.map((d) => d.id)) + 1;

		const newDireccion: DireccionCliente = {
			id: newId,
			...dto,
			creationDate: new Date(),
			active: true,
		};

		this.mockDirecciones.push(newDireccion);
		this.direccionesSubject.next([...this.mockDirecciones]);

		return of({
			success: true,
			message: 'Dirección creada exitosamente',
			data: newDireccion,
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Actualizar dirección
	 */
	updateDireccion(dto: UpdateDireccionDto): Observable<DireccionResponse> {
		this.loadingSubject.next(true);

		const index = this.mockDirecciones.findIndex((d) => d.id === dto.id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Dirección no encontrada',
			}).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		this.mockDirecciones[index] = {
			...this.mockDirecciones[index],
			...dto,
		};

		this.direccionesSubject.next([...this.mockDirecciones]);

		return of({
			success: true,
			message: 'Dirección actualizada exitosamente',
			data: this.mockDirecciones[index],
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Eliminar dirección
	 */
	deleteDireccion(id: number): Observable<DireccionResponse> {
		this.loadingSubject.next(true);

		const index = this.mockDirecciones.findIndex((d) => d.id === id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Dirección no encontrada',
			}).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		this.mockDirecciones.splice(index, 1);
		this.direccionesSubject.next([...this.mockDirecciones]);

		return of({
			success: true,
			message: 'Dirección eliminada exitosamente',
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * Alternar estado activo/inactivo
	 */
	toggleActive(id: number): Observable<DireccionResponse> {
		this.loadingSubject.next(true);

		const index = this.mockDirecciones.findIndex((d) => d.id === id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Dirección no encontrada',
			}).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		this.mockDirecciones[index].active = !this.mockDirecciones[index].active;
		this.direccionesSubject.next([...this.mockDirecciones]);

		return of({
			success: true,
			message: 'Estado actualizado exitosamente',
			data: this.mockDirecciones[index],
		}).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}
}
