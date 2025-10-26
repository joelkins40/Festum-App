import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
	TipoMobiliario,
	CrearTipoMobiliarioDto,
	ActualizarTipoMobiliarioDto,
	TipoMobiliarioResponse,
	TipoMobiliarioFiltros,
} from './tipo-mobiliario.model';

@Injectable({
	providedIn: 'root',
})
export class TiposMobiliarioService {
	// Mock data para desarrollo - Tipos de mobiliario para eventos
	private mockTiposMobiliario: TipoMobiliario[] = [
		{
			id: 1,
			descripcion: 'Mesa Redonda',
			fechaCreacion: new Date('2024-01-15'),
			activo: true,
		},
		{
			id: 2,
			descripcion: 'Mesa Rectangular',
			fechaCreacion: new Date('2024-01-16'),
			activo: true,
		},
		{
			id: 3,
			descripcion: 'Silla Chiavari',
			fechaCreacion: new Date('2024-01-17'),
			activo: true,
		},
		{
			id: 4,
			descripcion: 'Silla Phoenix',
			fechaCreacion: new Date('2024-01-18'),
			activo: true,
		},
		{
			id: 5,
			descripcion: 'Mantel Redondo',
			fechaCreacion: new Date('2024-01-19'),
			activo: true,
		},
		{
			id: 6,
			descripcion: 'Mantel Rectangular',
			fechaCreacion: new Date('2024-01-20'),
			activo: true,
		},
		{
			id: 7,
			descripcion: 'Sofá Lounge',
			fechaCreacion: new Date('2024-01-21'),
			activo: true,
		},
		{
			id: 8,
			descripcion: 'Mesa de Centro',
			fechaCreacion: new Date('2024-01-22'),
			activo: true,
		},
		{
			id: 9,
			descripcion: 'Barra de Bar',
			fechaCreacion: new Date('2024-01-23'),
			activo: true,
		},
		{
			id: 10,
			descripcion: 'Banqueta Alta',
			fechaCreacion: new Date('2024-01-24'),
			activo: true,
		},
		{
			id: 11,
			descripcion: 'Carpa 3x3',
			fechaCreacion: new Date('2024-01-25'),
			activo: false,
		},
		{
			id: 12,
			descripcion: 'Carpa 6x6',
			fechaCreacion: new Date('2024-01-26'),
			activo: true,
		},
	];

	// Subject para mantener la lista actualizada en tiempo real
	private tiposMobiliarioSubject = new BehaviorSubject<TipoMobiliario[]>(
		this.mockTiposMobiliario,
	);
	public tiposMobiliario$ = this.tiposMobiliarioSubject.asObservable();

	// Loading state
	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading$ = this.loadingSubject.asObservable();

	constructor() {
		// No dependencies needed for mock service
	}

	/**
	 * 📋 Obtener todos los tipos de mobiliario
	 */
	getTiposMobiliario(
		filtros?: TipoMobiliarioFiltros,
	): Observable<TipoMobiliarioResponse> {
		this.loadingSubject.next(true);

		// 🎭 Mock implementation
		let tiposMobiliarioFiltrados = [...this.mockTiposMobiliario];

		if (filtros?.busqueda) {
			tiposMobiliarioFiltrados = tiposMobiliarioFiltrados.filter((tipo) =>
				tipo.descripcion
					.toLowerCase()
					.includes(filtros.busqueda!.toLowerCase()),
			);
		}

		if (filtros?.activo !== undefined) {
			tiposMobiliarioFiltrados = tiposMobiliarioFiltrados.filter(
				(tipo) => tipo.activo === filtros.activo,
			);
		}

		// Ordenamiento
		if (filtros?.ordenarPor) {
			tiposMobiliarioFiltrados.sort((a, b) => {
				const aValue = a[filtros.ordenarPor as keyof TipoMobiliario];
				const bValue = b[filtros.ordenarPor as keyof TipoMobiliario];

				if (aValue === undefined || bValue === undefined) return 0;

				let comparison = 0;
				if (aValue < bValue) comparison = -1;
				if (aValue > bValue) comparison = 1;

				return filtros.direccion === 'desc' ? -comparison : comparison;
			});
		}

		const response: TipoMobiliarioResponse = {
			success: true,
			message: 'Tipos de mobiliario obtenidos exitosamente',
			data: tiposMobiliarioFiltrados,
			totalRecords: tiposMobiliarioFiltrados.length,
		};

		return of(response).pipe(
			delay(500), // Simular latencia de red
			map((res) => {
				this.loadingSubject.next(false);
				this.tiposMobiliarioSubject.next(tiposMobiliarioFiltrados);
				return res;
			}),
		);
	}

	/**
	 * 🆕 Crear nuevo tipo de mobiliario
	 */
	crearTipoMobiliario(
		dto: CrearTipoMobiliarioDto,
	): Observable<TipoMobiliarioResponse> {
		this.loadingSubject.next(true);

		// Generar nuevo ID
		const nuevoId = Math.max(...this.mockTiposMobiliario.map((t) => t.id)) + 1;

		const nuevoTipo: TipoMobiliario = {
			id: nuevoId,
			descripcion: dto.descripcion,
			fechaCreacion: new Date(),
			fechaActualizacion: new Date(),
			activo: true,
		};

		// Añadir a la lista mock
		this.mockTiposMobiliario.push(nuevoTipo);
		this.tiposMobiliarioSubject.next([...this.mockTiposMobiliario]);

		const response: TipoMobiliarioResponse = {
			success: true,
			message: 'Tipo de mobiliario creado exitosamente',
			data: nuevoTipo,
		};

		return of(response).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * ✏️ Actualizar tipo de mobiliario existente
	 */
	actualizarTipoMobiliario(
		dto: ActualizarTipoMobiliarioDto,
	): Observable<TipoMobiliarioResponse> {
		this.loadingSubject.next(true);

		const index = this.mockTiposMobiliario.findIndex((t) => t.id === dto.id);

		if (index === -1) {
			const errorResponse: TipoMobiliarioResponse = {
				success: false,
				message: 'Tipo de mobiliario no encontrado',
			};

			return of(errorResponse).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		// Actualizar tipo de mobiliario
		this.mockTiposMobiliario[index] = {
			...this.mockTiposMobiliario[index],
			descripcion: dto.descripcion,
			fechaActualizacion: new Date(),
		};

		this.tiposMobiliarioSubject.next([...this.mockTiposMobiliario]);

		const response: TipoMobiliarioResponse = {
			success: true,
			message: 'Tipo de mobiliario actualizado exitosamente',
			data: this.mockTiposMobiliario[index],
		};

		return of(response).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * 🗑️ Eliminar tipo de mobiliario
	 */
	eliminarTipoMobiliario(id: number): Observable<TipoMobiliarioResponse> {
		this.loadingSubject.next(true);

		const index = this.mockTiposMobiliario.findIndex((t) => t.id === id);

		if (index === -1) {
			const errorResponse: TipoMobiliarioResponse = {
				success: false,
				message: 'Tipo de mobiliario no encontrado',
			};

			return of(errorResponse).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		// Eliminar tipo de mobiliario
		const tipoEliminado = this.mockTiposMobiliario.splice(index, 1)[0];
		this.tiposMobiliarioSubject.next([...this.mockTiposMobiliario]);

		const response: TipoMobiliarioResponse = {
			success: true,
			message: 'Tipo de mobiliario eliminado exitosamente',
			data: tipoEliminado,
		};

		return of(response).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * 🔄 Alternar estado activo/inactivo
	 */
	alternarEstado(id: number): Observable<TipoMobiliarioResponse> {
		this.loadingSubject.next(true);

		const index = this.mockTiposMobiliario.findIndex((t) => t.id === id);

		if (index === -1) {
			const errorResponse: TipoMobiliarioResponse = {
				success: false,
				message: 'Tipo de mobiliario no encontrado',
			};

			return of(errorResponse).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		// Alternar estado
		this.mockTiposMobiliario[index].activo =
			!this.mockTiposMobiliario[index].activo;
		this.mockTiposMobiliario[index].fechaActualizacion = new Date();

		this.tiposMobiliarioSubject.next([...this.mockTiposMobiliario]);

		const response: TipoMobiliarioResponse = {
			success: true,
			message: `Tipo de mobiliario ${this.mockTiposMobiliario[index].activo ? 'activado' : 'desactivado'} exitosamente`,
			data: this.mockTiposMobiliario[index],
		};

		return of(response).pipe(
			delay(300),
			map((res) => {
				this.loadingSubject.next(false);
				return res;
			}),
		);
	}

	/**
	 * 📥 Importar tipos de mobiliario desde CSV
	 */
	importarDesdeCSV(archivo: File): Observable<TipoMobiliarioResponse> {
		// TODO: Implementar importación real desde CSV
		this.loadingSubject.next(true);

		return new Observable((observer) => {
			const reader = new FileReader();

			reader.onload = (e: any) => {
				try {
					const contenido = e.target.result;
					const lineas = contenido.split('\n');

					// TODO: Procesar CSV y validar datos
					// Por ahora simulamos importación exitosa

					const response: TipoMobiliarioResponse = {
						success: true,
						message:
							'Archivo CSV procesado. TODO: Implementar lógica de importación completa.',
						data: [],
					};

					this.loadingSubject.next(false);
					observer.next(response);
					observer.complete();
				} catch (error) {
					const errorResponse: TipoMobiliarioResponse = {
						success: false,
						message: 'Error al procesar el archivo CSV',
					};

					this.loadingSubject.next(false);
					observer.next(errorResponse);
					observer.complete();
				}
			};

			reader.readAsText(archivo);
		});
	}

	/**
	 * 📤 Exportar tipos de mobiliario a CSV
	 */
	exportarACSV(): Observable<Blob> {
		// TODO: Implementar exportación real
		const csvData = this.convertirACSV(this.mockTiposMobiliario);
		const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

		return of(blob).pipe(delay(300));
	}

	/**
	 * 🔄 Convertir datos a formato CSV
	 */
	private convertirACSV(datos: TipoMobiliario[]): string {
		const headers = ['ID', 'Descripción', 'Fecha Creación', 'Activo'];
		const csvContent = [
			headers.join(','),
			...datos.map((tipo) =>
				[
					tipo.id,
					`"${tipo.descripcion}"`,
					tipo.fechaCreacion?.toISOString().split('T')[0] || '',
					tipo.activo ? 'Sí' : 'No',
				].join(','),
			),
		].join('\n');

		return csvContent;
	}

	/**
	 * 🔍 Obtener tipo de mobiliario por ID
	 */
	obtenerPorId(id: number): Observable<TipoMobiliario | null> {
		const tipo = this.mockTiposMobiliario.find((t) => t.id === id);
		return of(tipo || null).pipe(delay(100));
	}
}
