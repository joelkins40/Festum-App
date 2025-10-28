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
			direccion: undefined,
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-15'),
			activo: true,
		},
		{
			id: 2,
			nombre: 'Carlos Eduardo Martínez',
			direccion: undefined,
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-16'),
			activo: true,
		},
		{
			id: 3,
			nombre: 'Ana Lucía Hernández',
			direccion: undefined,
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-17'),
			activo: true,
		},
		{
			id: 4,
			nombre: 'Roberto Silva Castro',
			direccion: undefined,
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-18'),
			activo: true,
		},
		{
			id: 5,
			nombre: 'Patricia Morales López',
			direccion: undefined,
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-19'),
			activo: true,
		},
		{
			id: 6,
			nombre: 'Alejandro Ruiz Vargas',
			direccion: undefined,
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-20'),
			activo: true,
		},
		{
			id: 7,
			nombre: 'Sofía Ramírez Jiménez',
			direccion: undefined,
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-21'),
			activo: true,
		},
		{
			id: 8,
			nombre: 'Diego Torres Medina',
			direccion: undefined,
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-22'),
			activo: true,
		},
		{
			id: 9,
			nombre: 'Valentina Cruz Peña',
			direccion: undefined,
			clientePreferente: true,
			fechaCreacion: new Date('2024-01-23'),
			activo: false,
		},
		{
			id: 10,
			nombre: 'Fernando Delgado Soto',
			direccion: undefined,
			clientePreferente: false,
			fechaCreacion: new Date('2024-01-24'),
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
			direccion: dto.direccion,
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
			direccion: dto.direccion,
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
					cliente.direccion || 'Sin definir',
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
