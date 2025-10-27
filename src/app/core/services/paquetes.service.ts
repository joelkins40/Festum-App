import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Paquete, PaquetesResponse, ProductoIncluido } from '../models/paquete.model';
import { ProductoServicio } from '../models/productos-servicios.model';

@Injectable({
	providedIn: 'root',
})
export class PaquetesService {
	private mockPaquetes: Paquete[] = [
		{
			id: 1,
			tipo: 'Paquete',
			nombre: 'Paquete Boda Clásico',
			descripcionCorta: 'Incluye mantelería, sillas chiavari y centro de mesa',
			productos: [
				{
					productoServicio: {
						id: 1,
						tipo: 'Producto',
						categoriaId: 1,
						clave: 'PRD001',
						cantidadStock: 50,
						nombre: 'Silla Chiavari Dorada',
						descripcion: 'Silla elegante para eventos',
						precioPublico: 15.00,
						precioEspecial: 12.00,
						fechaCreacion: new Date(),
						activo: true
					},
					cantidad: 100
				},
				{
					productoServicio: {
						id: 2,
						tipo: 'Producto',
						categoriaId: 1,
						clave: 'PRD002',
						cantidadStock: 25,
						nombre: 'Mantel Rectangular Blanco',
						descripcion: 'Mantel de alta calidad',
						precioPublico: 25.00,
						precioEspecial: 20.00,
						fechaCreacion: new Date(),
						activo: true
					},
					cantidad: 12
				}
			],
			precioTotal: 1800.00,
			categoria: 'Boda',
			disponibilidad: 3,
			imagen: 'assets/images/paquete-boda.jpg',
			fechaCreacion: new Date(),
			activo: true,
		},
		{
			id: 2,
			tipo: 'Servicio',
			nombre: 'Servicio Lounge Corporativo',
			descripcionCorta: 'Mobiliario lounge para eventos corporativos',
			productos: [
				{
					productoServicio: {
						id: 3,
						tipo: 'Servicio',
						categoriaId: 2,
						clave: 'SRV001',
						cantidadStock: 10,
						nombre: 'Montaje Lounge',
						descripcion: 'Servicio completo de montaje',
						precioPublico: 500.00,
						precioEspecial: 450.00,
						fechaCreacion: new Date(),
						activo: true
					},
					cantidad: 1
				}
			],
			precioTotal: 500.00,
			categoria: 'Corporativo',
			disponibilidad: 5,
			imagen: 'assets/images/paquete-lounge.jpg',
			fechaCreacion: new Date(),
			activo: true,
		},
		{
			id: 3,
			tipo: 'Paquete',
			nombre: 'Paquete Fiesta Lounge',
			descripcionCorta: 'Combo pequeño para lounges y after parties',
			productos: [
				{
					productoServicio: {
						id: 4,
						tipo: 'Producto',
						categoriaId: 3,
						clave: 'PRD003',
						cantidadStock: 30,
						nombre: 'Puff Redondo',
						descripcion: 'Puff cómodo para lounge',
						precioPublico: 35.00,
						precioEspecial: 30.00,
						fechaCreacion: new Date(),
						activo: true
					},
					cantidad: 10
				}
			],
			precioTotal: 15000,
			categoria: 'Lounge',
			disponibilidad: 8,
			imagen: 'assets/images/paquete-fiesta.jpg',
			fechaCreacion: new Date(),
			activo: true,
		},
	];

	private paquetesSubject = new BehaviorSubject<Paquete[]>(this.mockPaquetes);
	public paquetes$ = this.paquetesSubject.asObservable();

	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading$ = this.loadingSubject.asObservable();

	constructor() {}

	getPaquetes(): Observable<PaquetesResponse> {
		this.loadingSubject.next(true);

		return of({
			success: true,
			message: 'Paquetes cargados',
			data: [...this.mockPaquetes],
		}).pipe(
			delay(400),
			map((response) => {
				this.loadingSubject.next(false);
				if (response.success && response.data) {
					this.paquetesSubject.next(response.data);
				}
				return response;
			}),
		);
	}

	/**
	 * ➕ Agregar nuevo paquete
	 */
	crearPaquete(paquete: Partial<Paquete>): Observable<PaquetesResponse> {
		this.loadingSubject.next(true);

		const nuevoPaquete: Paquete = {
			id: Math.max(...this.mockPaquetes.map((p) => p.id)) + 1,
			tipo: paquete.tipo || 'Paquete',
			nombre: paquete.nombre || '',
			descripcionCorta: paquete.descripcionCorta || '',
			productos: paquete.productos || [],
			precioTotal: paquete.precioTotal || 0,
			categoria: paquete.categoria || '',
			disponibilidad: paquete.disponibilidad || 0,
			imagen: paquete.imagen,
			fechaCreacion: new Date(),
			activo: true,
		};

		this.mockPaquetes.push(nuevoPaquete);
		this.paquetesSubject.next([...this.mockPaquetes]);

		return of({
			success: true,
			message: `${nuevoPaquete.tipo} creado exitosamente`,
			data: [nuevoPaquete],
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * ✏️ Actualizar paquete
	 */
	actualizarPaquete(paquete: Paquete): Observable<PaquetesResponse> {
		this.loadingSubject.next(true);

		const index = this.mockPaquetes.findIndex((p) => p.id === paquete.id);
		if (index !== -1) {
			this.mockPaquetes[index] = {
				...this.mockPaquetes[index],
				...paquete,
				fechaCreacion: this.mockPaquetes[index].fechaCreacion,
			};
			this.paquetesSubject.next([...this.mockPaquetes]);
		}

		return of({
			success: index !== -1,
			message:
				index !== -1
					? `${paquete.tipo} actualizado exitosamente`
					: 'Paquete no encontrado',
			data: index !== -1 ? [this.mockPaquetes[index]] : undefined,
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * 🗑️ Eliminar paquete
	 */
	eliminarPaquete(id: number): Observable<PaquetesResponse> {
		this.loadingSubject.next(true);

		const index = this.mockPaquetes.findIndex((p) => p.id === id);
		const paquete = this.mockPaquetes[index];

		if (index !== -1) {
			this.mockPaquetes.splice(index, 1);
			this.paquetesSubject.next([...this.mockPaquetes]);
		}

		return of({
			success: index !== -1,
			message:
				index !== -1
					? `${paquete?.tipo || 'Elemento'} eliminado exitosamente`
					: 'Paquete no encontrado',
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}
}
