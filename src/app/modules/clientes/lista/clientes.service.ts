import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
	Cliente,
	CrearClienteDto,
	ActualizarClienteDto,
	ClienteResponse,
	ClienteFiltros,
} from './cliente.model';

@Injectable({
	providedIn: 'root',
})
export class ClientesService {
	// Mock data para desarrollo - Clientes para eventos
	private mockClientes: Cliente[] = [
		{
			id: 1,
			nombre: 'María González Rodríguez',
			direcciones: [{
				street: 'Av. Revolución',
				number: '1234',
				neighborhood: 'Centro',
				city: 'Guadalajara',
				state: 'Jalisco',
				country: 'México',
				postalCode: '44100',
				formatted: {
					line1: 'Av. Revolución 1234, Col. Centro',
					line2: 'Guadalajara, Jalisco',
					line3: 'México 44100'
				},
				geoapifyPlaceId: 'mock-place-id-1',
				confidence: 0.95,
				source: 'Geoapify'
			}],
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-15'),
			activo: true,
		},
		{
			id: 2,
			nombre: 'Carlos Eduardo Martínez',
			direcciones: [{
				street: 'Calle Juárez',
				number: '567',
				neighborhood: 'Americana',
				city: 'Guadalajara',
				state: 'Jalisco',
				country: 'México',
				postalCode: '44160',
				formatted: {
					line1: 'Calle Juárez 567, Col. Americana',
					line2: 'Guadalajara, Jalisco',
					line3: 'México 44160'
				},
				geoapifyPlaceId: 'mock-place-id-2',
				confidence: 0.92,
				source: 'Geoapify'
			}],
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-16'),
			activo: true,
		},
		{
			id: 3,
			nombre: 'Ana Lucía Hernández',
			direcciones: [{
				street: 'Av. Chapultepec',
				number: '890',
				neighborhood: 'Moderna',
				city: 'Guadalajara',
				state: 'Jalisco',
				country: 'México',
				postalCode: '44190',
				formatted: {
					line1: 'Av. Chapultepec 890, Col. Moderna',
					line2: 'Guadalajara, Jalisco',
					line3: 'México 44190'
				},
				geoapifyPlaceId: 'mock-place-id-3',
				confidence: 0.89,
				source: 'Geoapify'
			}, {
				street: 'Calle Secundaria',
				number: '100',
				neighborhood: 'Centro',
				city: 'Zapopan',
				state: 'Jalisco',
				country: 'México',
				postalCode: '45100',
				formatted: {
					line1: 'Calle Secundaria 100, Col. Centro',
					line2: 'Zapopan, Jalisco',
					line3: 'México 45100'
				},
				geoapifyPlaceId: 'mock-place-id-3b',
				confidence: 0.87,
				source: 'Geoapify'
			}],
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-17'),
			activo: true,
		},
		{
			id: 4,
			nombre: 'Roberto Silva Castro',
			direcciones: [{
				street: 'Calle Hidalgo',
				number: '345',
				neighborhood: 'Tlaquepaque Centro',
				city: 'Tlaquepaque',
				state: 'Jalisco',
				country: 'México',
				postalCode: '45500',
				formatted: {
					line1: 'Calle Hidalgo 345, Col. Tlaquepaque Centro',
					line2: 'Tlaquepaque, Jalisco',
					line3: 'México 45500'
				},
				geoapifyPlaceId: 'mock-place-id-4',
				confidence: 0.91,
				source: 'Geoapify'
			}],
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-18'),
			activo: true,
		},
		{
			id: 5,
			nombre: 'Patricia Morales López',
			direcciones: [{
				street: 'Av. López Mateos',
				number: '2156',
				neighborhood: 'Italia Providencia',
				city: 'Guadalajara',
				state: 'Jalisco',
				country: 'México',
				postalCode: '44648',
				formatted: {
					line1: 'Av. López Mateos 2156, Col. Italia Providencia',
					line2: 'Guadalajara, Jalisco',
					line3: 'México 44648'
				},
				geoapifyPlaceId: 'mock-place-id-5',
				confidence: 0.94,
				source: 'Geoapify'
			}],
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-19'),
			activo: true,
		},
	];

	// Subject para mantener la lista actualizada en tiempo real
	private clientesSubject = new BehaviorSubject<Cliente[]>(this.mockClientes);
	public clientes$ = this.clientesSubject.asObservable();

	// Loading state
	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading$ = this.loadingSubject.asObservable();

	constructor() {
		// No dependencies needed for mock service
	}

	/**
	 * 📋 Obtener todos los clientes
	 */
	getClientes(filtros?: ClienteFiltros): Observable<ClienteResponse> {
		this.loadingSubject.next(true);

		// 🎭 Mock implementation
		let clientesFiltrados = [...this.mockClientes];

		if (filtros?.busqueda) {
			clientesFiltrados = clientesFiltrados.filter((cliente) =>
				cliente.nombre.toLowerCase().includes(filtros.busqueda!.toLowerCase()),
			);
		}

		if (filtros?.clientePreferente !== undefined) {
			clientesFiltrados = clientesFiltrados.filter(
				(cliente) => cliente.clientePreferente === filtros.clientePreferente,
			);
		}

		if (filtros?.activo !== undefined) {
			clientesFiltrados = clientesFiltrados.filter(
				(cliente) => cliente.activo === filtros.activo,
			);
		}

		// Ordenamiento
		if (filtros?.ordenarPor) {
			clientesFiltrados.sort((a, b) => {
				const aValue = a[filtros.ordenarPor as keyof Cliente];
				const bValue = b[filtros.ordenarPor as keyof Cliente];

				if (aValue === undefined || bValue === undefined) return 0;

				let comparison = 0;
				if (aValue < bValue) comparison = -1;
				if (aValue > bValue) comparison = 1;

				return filtros.direccion === 'desc' ? -comparison : comparison;
			});
		}

		const response: ClienteResponse = {
			success: true,
			message: 'Clientes obtenidos exitosamente',
			data: clientesFiltrados,
			totalRecords: clientesFiltrados.length,
		};

		return of(response).pipe(
			delay(500), // Simular latencia de red
			map((res) => {
				this.loadingSubject.next(false);
				this.clientesSubject.next(clientesFiltrados);
				return res;
			}),
		);
	}

	/**
	 * 🆕 Crear nuevo cliente
	 */
	crearCliente(dto: CrearClienteDto): Observable<ClienteResponse> {
		this.loadingSubject.next(true);

		// Generar nuevo ID
		const nuevoId = Math.max(...this.mockClientes.map((c) => c.id)) + 1;

		const nuevoCliente: Cliente = {
			id: nuevoId,
			nombre: dto.nombre,
			direcciones: dto.direcciones,
			clientePreferente: dto.clientePreferente,
			fechaCreacion: new Date(),
			fechaActualizacion: new Date(),
			activo: true,
		};

		// Añadir a la lista mock
		this.mockClientes.push(nuevoCliente);
		this.clientesSubject.next([...this.mockClientes]);

		const response: ClienteResponse = {
			success: true,
			message: 'Cliente creado exitosamente',
			data: nuevoCliente,
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
	 * ✏️ Actualizar cliente existente
	 */
	actualizarCliente(dto: ActualizarClienteDto): Observable<ClienteResponse> {
		this.loadingSubject.next(true);

		const index = this.mockClientes.findIndex((c) => c.id === dto.id);

		if (index === -1) {
			const errorResponse: ClienteResponse = {
				success: false,
				message: 'Cliente no encontrado',
			};

			return of(errorResponse).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		// Actualizar cliente
		this.mockClientes[index] = {
			...this.mockClientes[index],
			nombre: dto.nombre,
			direcciones: dto.direcciones,
			clientePreferente: dto.clientePreferente,
			fechaActualizacion: new Date(),
		};

		this.clientesSubject.next([...this.mockClientes]);

		const response: ClienteResponse = {
			success: true,
			message: 'Cliente actualizado exitosamente',
			data: this.mockClientes[index],
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
	 * 🗑️ Eliminar cliente
	 */
	eliminarCliente(id: number): Observable<ClienteResponse> {
		this.loadingSubject.next(true);

		const index = this.mockClientes.findIndex((c) => c.id === id);

		if (index === -1) {
			const errorResponse: ClienteResponse = {
				success: false,
				message: 'Cliente no encontrado',
			};

			return of(errorResponse).pipe(
				delay(300),
				map((res) => {
					this.loadingSubject.next(false);
					return res;
				}),
			);
		}

		// Eliminar cliente
		const clienteEliminado = this.mockClientes.splice(index, 1)[0];
		this.clientesSubject.next([...this.mockClientes]);

		const response: ClienteResponse = {
			success: true,
			message: 'Cliente eliminado exitosamente',
			data: clienteEliminado,
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
	alternarEstado(id: number): Observable<ClienteResponse> {
		this.loadingSubject.next(true);

		const index = this.mockClientes.findIndex((c) => c.id === id);

		if (index === -1) {
			const errorResponse: ClienteResponse = {
				success: false,
				message: 'Cliente no encontrado',
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
		this.mockClientes[index].activo = !this.mockClientes[index].activo;
		this.mockClientes[index].fechaActualizacion = new Date();

		this.clientesSubject.next([...this.mockClientes]);

		const response: ClienteResponse = {
			success: true,
			message: `Cliente ${this.mockClientes[index].activo ? 'activado' : 'desactivado'} exitosamente`,
			data: this.mockClientes[index],
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
	 * 📥 Importar clientes desde CSV
	 */
	importarDesdeCSV(archivo: File): Observable<ClienteResponse> {
		// TODO: Implementar importación real desde CSV
		this.loadingSubject.next(true);

		return new Observable((observer) => {
			const reader = new FileReader();

			reader.onload = (e: ProgressEvent<FileReader>) => {
				try {
					const contenido = e.target?.result as string;
					const lineas = contenido.split('\n');

					// TODO: Procesar CSV y validar datos
					// Por ahora simulamos importación exitosa

					const response: ClienteResponse = {
						success: true,
						message:
							'Archivo CSV procesado. TODO: Implementar lógica de importación completa.',
						data: [],
					};

					this.loadingSubject.next(false);
					observer.next(response);
					observer.complete();
				} catch (error) {
					const errorResponse: ClienteResponse = {
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
	 * 📤 Exportar clientes a CSV
	 */
	exportarACSV(): Observable<Blob> {
		// TODO: Implementar exportación real
		const csvData = this.convertirACSV(this.mockClientes);
		const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

		return of(blob).pipe(delay(300));
	}

	/**
	 * 🔄 Convertir datos a formato CSV
	 */
	private convertirACSV(datos: Cliente[]): string {
		const headers = [
			'ID',
			'Nombre',
			'Dirección',
			'Cliente Preferente',
			'Fecha Creación',
			'Activo',
		];
		const csvContent = [
			headers.join(','),
			...datos.map((cliente) =>
				[
					cliente.id,
					`"${cliente.nombre}"`,
					cliente.direcciones || 'Sin definir',
					cliente.clientePreferente ? 'Sí' : 'No',
					cliente.fechaCreacion?.toISOString().split('T')[0] || '',
					cliente.activo ? 'Sí' : 'No',
				].join(','),
			),
		].join('\n');

		return csvContent;
	}

	/**
	 * 🔍 Obtener cliente por ID
	 */
	obtenerPorId(id: number): Observable<Cliente | null> {
		const cliente = this.mockClientes.find((c) => c.id === id);
		return of(cliente || null).pipe(delay(100));
	}
}
