import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TipoEventoService } from './tipos-evento.service';
import {
	Salon,
	CrearSalonDto,
	ActualizarSalonDto,
	SalonResponse,
	SalonFiltros,
} from '../models/salon.model';

@Injectable({
	providedIn: 'root',
})
export class SalonesService {
	// URL de la API desde servicio de configuración
	private readonly API_URL: string;

	// Mock data para desarrollo - Salones para eventos
	private mockSalones: Salon[] = [
		{
			id: 1,
			nombre: 'Salón Cristal',
			direccion: 'Av. Reforma 123, Col. Centro, CDMX',
			capacidadDePersonas: 200,
			tipoEvento: { id: 1, descripcion: 'Boda' },
			precioRenta: 15000.0,
			telefonoContacto: '55-1234-5678',
			fechaCreacion: new Date('2024-01-15'),
			activo: true,
			planoTemplate: {
				plantillaId: 'clasico-rectangular',
				plantillaNombre: 'Salón Clásico Rectangular',
				elementos: [
					{
						id: 'elemento_1_mesa1',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 50, y: 80 },
						tamano: { ancho: 120, alto: 120 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_1_mesa2',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 200, y: 80 },
						tamano: { ancho: 120, alto: 120 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_1_mesa3',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 350, y: 80 },
						tamano: { ancho: 120, alto: 120 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_1_escenario',
						tipo: 'escenario',
						nombre: 'Escenario',
						posicion: { x: 550, y: 50 },
						tamano: { ancho: 200, alto: 120 },
						color: '#9c27b0',
						icono: 'theater_comedy',
						rotacion: 0,
					},
					{
						id: 'elemento_1_barra',
						tipo: 'barra',
						nombre: 'Barra/Bar',
						posicion: { x: 580, y: 400 },
						tamano: { ancho: 180, alto: 70 },
						color: '#34495e',
						icono: 'local_bar',
						rotacion: 0,
					},
					{
						id: 'elemento_1_pista',
						tipo: 'pista-baile',
						nombre: 'Pista de Baile',
						posicion: { x: 150, y: 350 },
						tamano: { ancho: 280, alto: 200 },
						color: '#f39c12',
						icono: 'music_note',
						rotacion: 0,
					},
				],
				fechaGuardado: '2025-12-09T10:00:00.000Z',
				version: '1.0',
			},
		},
		{
			id: 2,
			nombre: 'Salón Jardín Rosa',
			direccion: 'Calle de las Flores 456, Col. Roma Norte, CDMX',
			capacidadDePersonas: 150,
			tipoEvento: { id: 2, descripcion: 'Quinceaños' },
			precioRenta: 12000.0,
			telefonoContacto: '55-2345-6789',
			fechaCreacion: new Date('2024-01-16'),
			activo: true,
			planoTemplate: {
				plantillaId: 'clasico-rectangular',
				plantillaNombre: 'Salón Clásico Rectangular',
				elementos: [
					{
						id: 'elemento_bvdbo8nnq_1763958886676',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 7, y: 6 },
						tamano: { ancho: 120, alto: 120 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_csei555ix_1763958998664',
						tipo: 'escenario',
						nombre: 'Escenario',
						posicion: { x: 252, y: 162 },
						tamano: { ancho: 300, alto: 150 },
						color: '#9c27b0',
						icono: 'theater_comedy',
						rotacion: 0,
					},
					{
						id: 'elemento_w9hbydd7g_1763959003386',
						tipo: 'entrada',
						nombre: 'Entrada',
						posicion: { x: 701, y: 439 },
						tamano: { ancho: 90, alto: 150 },
						color: '#607d8b',
						icono: 'meeting_room',
						rotacion: 0,
					},
					{
						id: 'elemento_wh56fv2j8_1763959008874',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 250, y: 348 },
						tamano: { ancho: 60, alto: 60 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_no7eml9yh_1763959010824',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 416, y: 338 },
						tamano: { ancho: 60, alto: 60 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_wx4lgonxl_1763959012785',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 348, y: 450 },
						tamano: { ancho: 60, alto: 60 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_0a5ri20ta_1763959016182',
						tipo: 'mesa-regalos',
						nombre: 'Mesa de Regalos',
						posicion: { x: 638, y: 4 },
						tamano: { ancho: 150, alto: 90 },
						color: '#e91e63',
						icono: 'card_giftcard',
						rotacion: 0,
					},
				],
				fechaGuardado: '2025-11-24T04:37:07.093Z',
				version: '1.0',
			},
		},
		{
			id: 3,
			nombre: 'Salón Emperador',
			direccion: 'Blvd. Miguel de Cervantes 789, Col. Polanco, CDMX',
			capacidadDePersonas: 300,
			tipoEvento: { id: 9, descripcion: 'Evento Corporativo' },
			precioRenta: 25000.0,
			telefonoContacto: '55-3456-7890',
			fechaCreacion: new Date('2024-01-17'),
			activo: true,
			planoTemplate: {
				plantillaId: 'corporativo-grande',
				plantillaNombre: 'Salón Corporativo Grande',
				elementos: [
					{
						id: 'elemento_3_mesa_rect1',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular',
						posicion: { x: 100, y: 100 },
						tamano: { ancho: 180, alto: 90 },
						color: '#a0522d',
						icono: 'table_bar',
						rotacion: 0,
					},
					{
						id: 'elemento_3_mesa_rect2',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular',
						posicion: { x: 320, y: 100 },
						tamano: { ancho: 180, alto: 90 },
						color: '#a0522d',
						icono: 'table_bar',
						rotacion: 0,
					},
					{
						id: 'elemento_3_mesa_rect3',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular',
						posicion: { x: 540, y: 100 },
						tamano: { ancho: 180, alto: 90 },
						color: '#a0522d',
						icono: 'table_bar',
						rotacion: 0,
					},
					{
						id: 'elemento_3_escenario',
						tipo: 'escenario',
						nombre: 'Escenario',
						posicion: { x: 250, y: 10 },
						tamano: { ancho: 300, alto: 80 },
						color: '#9c27b0',
						icono: 'theater_comedy',
						rotacion: 0,
					},
					{
						id: 'elemento_3_zona_comida',
						tipo: 'zona-comida',
						nombre: 'Zona de Comida',
						posicion: { x: 20, y: 380 },
						tamano: { ancho: 200, alto: 150 },
						color: '#ff6b35',
						icono: 'restaurant_menu',
						rotacion: 0,
					},
					{
						id: 'elemento_3_entrada',
						tipo: 'entrada',
						nombre: 'Entrada',
						posicion: { x: 710, y: 250 },
						tamano: { ancho: 80, alto: 130 },
						color: '#607d8b',
						icono: 'meeting_room',
						rotacion: 0,
					},
					{
						id: 'elemento_3_planta1',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 10, y: 10 },
						tamano: { ancho: 50, alto: 50 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_3_planta2',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 740, y: 10 },
						tamano: { ancho: 50, alto: 50 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
				],
				fechaGuardado: '2025-12-09T10:15:00.000Z',
				version: '1.0',
			},
		},
		{
			id: 4,
			nombre: 'Salón Luna de Plata',
			direccion: 'Av. Universidad 321, Col. Narvarte, CDMX',
			capacidadDePersonas: 120,
			tipoEvento: { id: 3, descripcion: 'Graduación' },
			precioRenta: 9500.0,
			telefonoContacto: '55-4567-8901',
			fechaCreacion: new Date('2024-01-18'),
			activo: true,
			planoTemplate: {
				plantillaId: 'graduacion-festivo',
				plantillaNombre: 'Salón para Graduación',
				elementos: [
					{
						id: 'elemento_4_mesa1',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 80, y: 200 },
						tamano: { ancho: 110, alto: 110 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_4_mesa2',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 220, y: 200 },
						tamano: { ancho: 110, alto: 110 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_4_mesa3',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 360, y: 200 },
						tamano: { ancho: 110, alto: 110 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_4_mesa4',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 500, y: 200 },
						tamano: { ancho: 110, alto: 110 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_4_escenario',
						tipo: 'escenario',
						nombre: 'Escenario',
						posicion: { x: 250, y: 30 },
						tamano: { ancho: 250, alto: 100 },
						color: '#9c27b0',
						icono: 'theater_comedy',
						rotacion: 0,
					},
					{
						id: 'elemento_4_entrada',
						tipo: 'entrada',
						nombre: 'Entrada',
						posicion: { x: 10, y: 250 },
						tamano: { ancho: 50, alto: 120 },
						color: '#607d8b',
						icono: 'meeting_room',
						rotacion: 0,
					},
					{
						id: 'elemento_4_mesa_regalos',
						tipo: 'mesa-regalos',
						nombre: 'Mesa de Regalos',
						posicion: { x: 650, y: 80 },
						tamano: { ancho: 130, alto: 80 },
						color: '#e91e63',
						icono: 'card_giftcard',
						rotacion: 0,
					},
					{
						id: 'elemento_4_planta1',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 150, y: 450 },
						tamano: { ancho: 55, alto: 55 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_4_planta2',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 450, y: 450 },
						tamano: { ancho: 55, alto: 55 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
				],
				fechaGuardado: '2025-12-09T10:20:00.000Z',
				version: '1.0',
			},
		},
		{
			id: 5,
			nombre: 'Salón Fiesta Dorada',
			direccion: 'Calle Insurgentes Sur 654, Col. Del Valle, CDMX',
			capacidadDePersonas: 180,
			tipoEvento: { id: 8, descripcion: 'Cumpleaños Infantil' },
			precioRenta: 11000.0,
			telefonoContacto: '55-5678-9012',
			fechaCreacion: new Date('2024-01-19'),
			activo: true,
			planoTemplate: {
				plantillaId: 'infantil-divertido',
				plantillaNombre: 'Salón Infantil Divertido',
				elementos: [
					{
						id: 'elemento_5_mesa_rect1',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular',
						posicion: { x: 50, y: 350 },
						tamano: { ancho: 150, alto: 80 },
						color: '#a0522d',
						icono: 'table_bar',
						rotacion: 0,
					},
					{
						id: 'elemento_5_mesa_rect2',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular',
						posicion: { x: 250, y: 350 },
						tamano: { ancho: 150, alto: 80 },
						color: '#a0522d',
						icono: 'table_bar',
						rotacion: 0,
					},
					{
						id: 'elemento_5_mesa_rect3',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular',
						posicion: { x: 450, y: 350 },
						tamano: { ancho: 150, alto: 80 },
						color: '#a0522d',
						icono: 'table_bar',
						rotacion: 0,
					},
					{
						id: 'elemento_5_escenario',
						tipo: 'escenario',
						nombre: 'Escenario',
						posicion: { x: 300, y: 50 },
						tamano: { ancho: 200, alto: 100 },
						color: '#9c27b0',
						icono: 'theater_comedy',
						rotacion: 0,
					},
					{
						id: 'elemento_5_zona_juegos',
						tipo: 'pista-baile',
						nombre: 'Zona de Juegos',
						posicion: { x: 80, y: 150 },
						tamano: { ancho: 200, alto: 150 },
						color: '#f39c12',
						icono: 'music_note',
						rotacion: 0,
					},
					{
						id: 'elemento_5_zona_comida',
						tipo: 'zona-comida',
						nombre: 'Zona de Comida',
						posicion: { x: 550, y: 150 },
						tamano: { ancho: 200, alto: 120 },
						color: '#ff6b35',
						icono: 'restaurant_menu',
						rotacion: 0,
					},
					{
						id: 'elemento_5_mesa_pastel',
						tipo: 'mesa-regalos',
						nombre: 'Mesa del Pastel',
						posicion: { x: 350, y: 480 },
						tamano: { ancho: 100, alto: 70 },
						color: '#e91e63',
						icono: 'cake',
						rotacion: 0,
					},
				],
				fechaGuardado: '2025-12-09T10:25:00.000Z',
				version: '1.0',
			},
		},
		{
			id: 6,
			nombre: 'Salón Cielo Azul',
			direccion: 'Av. Patriotismo 987, Col. San Pedro de los Pinos, CDMX',
			capacidadDePersonas: 80,
			tipoEvento: { id: 4, descripcion: 'Baby Shower' },
			precioRenta: 7500.0,
			telefonoContacto: '55-6789-0123',
			fechaCreacion: new Date('2024-01-20'),
			activo: false,
			planoTemplate: {
				plantillaId: 'clasico-rectangular',
				plantillaNombre: 'Salón Clásico Rectangular',
				elementos: [
					{
						id: 'elemento_bvdbo8nnq_1763958886676',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda',
						posicion: { x: 7, y: 6 },
						tamano: { ancho: 120, alto: 120 },
						color: '#8b4513',
						icono: 'table_restaurant',
						rotacion: 0,
					},
					{
						id: 'elemento_csei555ix_1763958998664',
						tipo: 'escenario',
						nombre: 'Escenario',
						posicion: { x: 252, y: 162 },
						tamano: { ancho: 300, alto: 150 },
						color: '#9c27b0',
						icono: 'theater_comedy',
						rotacion: 0,
					},
					{
						id: 'elemento_w9hbydd7g_1763959003386',
						tipo: 'entrada',
						nombre: 'Entrada',
						posicion: { x: 701, y: 439 },
						tamano: { ancho: 90, alto: 150 },
						color: '#607d8b',
						icono: 'meeting_room',
						rotacion: 0,
					},
					{
						id: 'elemento_wh56fv2j8_1763959008874',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 250, y: 348 },
						tamano: { ancho: 60, alto: 60 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_no7eml9yh_1763959010824',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 416, y: 338 },
						tamano: { ancho: 60, alto: 60 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_wx4lgonxl_1763959012785',
						tipo: 'planta',
						nombre: 'Planta/Decoración',
						posicion: { x: 348, y: 450 },
						tamano: { ancho: 60, alto: 60 },
						color: '#4caf50',
						icono: 'local_florist',
						rotacion: 0,
					},
					{
						id: 'elemento_0a5ri20ta_1763959016182',
						tipo: 'mesa-regalos',
						nombre: 'Mesa de Regalos',
						posicion: { x: 638, y: 4 },
						tamano: { ancho: 150, alto: 90 },
						color: '#e91e63',
						icono: 'card_giftcard',
						rotacion: 0,
					},
				],
				fechaGuardado: '2025-11-24T04:37:07.093Z',
				version: '1.0',
			},
		},
	];

	// Subject para mantener la lista actualizada en tiempo real
	private salonesSubject = new BehaviorSubject<Salon[]>(this.mockSalones);
	public salones$ = this.salonesSubject.asObservable();

	// Loading state
	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading$ = this.loadingSubject.asObservable();

	constructor(
		private http: HttpClient,
		private configService: ConfigService,
		private tipoEventoService: TipoEventoService,
	) {
		// Inicializar URL de la API
		this.API_URL = this.configService.getApiUrl('clientes');
	}

	/**
	 * 📋 Obtener todos los salones
	 */
	getSalones(filtros?: SalonFiltros): Observable<SalonResponse> {
		this.loadingSubject.next(true);

		// 🔗 Implementación para API real (descomenta cuando tengas el backend):
		/*
    let params = new HttpParams();
    if (filtros) {
      if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
      if (filtros.tipoEventoId) params = params.set('tipoEventoId', filtros.tipoEventoId.toString());
      if (filtros.activo !== undefined) params = params.set('activo', filtros.activo.toString());
      if (filtros.capacidadMinima) params = params.set('capacidadMinima', filtros.capacidadMinima.toString());
      if (filtros.capacidadMaxima) params = params.set('capacidadMaxima', filtros.capacidadMaxima.toString());
      if (filtros.ordenarPor) params = params.set('ordenarPor', filtros.ordenarPor);
      if (filtros.direccion) params = params.set('direccion', filtros.direccion);
      if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
      if (filtros.limite) params = params.set('limite', filtros.limite.toString());
    }

    return this.http.get<SalonResponse>(`${this.API_URL}`, { params })
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success && response.data) {
            this.salonesSubject.next(response.data as Salon[]);
          }
        })
      );
    */

		// 🎭 Mock implementation (remover cuando tengas API real)
		let salonesFiltrados = [...this.mockSalones];

		if (filtros?.busqueda) {
			const busqueda = filtros.busqueda.toLowerCase();
			salonesFiltrados = salonesFiltrados.filter(
				(salon) =>
					salon.nombre.toLowerCase().includes(busqueda) ||
					salon.direccion.toLowerCase().includes(busqueda) ||
					salon.tipoEvento.descripcion.toLowerCase().includes(busqueda),
			);
		}

		if (filtros?.tipoEventoId) {
			salonesFiltrados = salonesFiltrados.filter(
				(salon) => salon.tipoEvento.id === filtros.tipoEventoId,
			);
		}

		if (filtros?.activo !== undefined) {
			salonesFiltrados = salonesFiltrados.filter(
				(salon) => salon.activo === filtros.activo,
			);
		}

		if (filtros?.capacidadMinima) {
			salonesFiltrados = salonesFiltrados.filter(
				(salon) => salon.capacidadDePersonas >= filtros.capacidadMinima!,
			);
		}

		if (filtros?.capacidadMaxima) {
			salonesFiltrados = salonesFiltrados.filter(
				(salon) => salon.capacidadDePersonas <= filtros.capacidadMaxima!,
			);
		}

		// Ordenamiento
		if (filtros?.ordenarPor) {
			salonesFiltrados.sort((a, b) => {
				const aValue = a[filtros.ordenarPor as keyof Salon];
				const bValue = b[filtros.ordenarPor as keyof Salon];

				if (aValue === undefined || bValue === undefined) return 0;

				const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
				return filtros.direccion === 'desc' ? -result : result;
			});
		}

		return of({
			success: true,
			message: 'Salones obtenidos exitosamente',
			data: salonesFiltrados,
			totalRecords: salonesFiltrados.length,
		}).pipe(
			delay(500), // Simular latencia de red
			map((response) => {
				this.loadingSubject.next(false);
				this.salonesSubject.next(salonesFiltrados);
				return response;
			}),
		);
	}

	/**
	 * 🔍 Obtener salón por ID
	 */
	getSalonById(id: number): Observable<SalonResponse> {
		this.loadingSubject.next(true);

		// 🔗 Implementación para API real:
		// return this.http.get<SalonResponse>(`${this.API_URL}/${id}`)
		//   .pipe(tap(() => this.loadingSubject.next(false)));

		// 🎭 Mock implementation
		const salon = this.mockSalones.find((s) => s.id === id);

		return of({
			success: !!salon,
			message: salon ? 'Salón encontrado' : 'Salón no encontrado',
			data: salon || undefined,
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * ➕ Agregar nuevo salón
	 */
	crearSalon(salonDto: CrearSalonDto): Observable<SalonResponse> {
		this.loadingSubject.next(true);

		// 🔗 Implementación para API real:
		/*
    return this.http.post<SalonResponse>(`${this.API_URL}`, salonDto)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getSalones().subscribe(); // Refrescar lista
          }
        })
      );
    */

		// 🎭 Mock implementation
		// Obtener información del tipo de evento
		const tiposEvento = this.tipoEventoService['mockTiposEvento'] || [];
		const tipoEvento = tiposEvento.find((t) => t.id === salonDto.tipoEventoId);

		const nuevoSalon: Salon = {
			id: Math.max(...this.mockSalones.map((s) => s.id)) + 1,
			nombre: salonDto.nombre,
			direccion: salonDto.direccion,
			capacidadDePersonas: salonDto.capacidadDePersonas,
			tipoEvento: tipoEvento
				? { id: tipoEvento.id, descripcion: tipoEvento.descripcion }
				: { id: salonDto.tipoEventoId, descripcion: 'Tipo desconocido' },
			precioRenta: salonDto.precioRenta,
			telefonoContacto: salonDto.telefonoContacto,
			fechaCreacion: new Date(),
			activo: true,
		};

		this.mockSalones.push(nuevoSalon);
		this.salonesSubject.next([...this.mockSalones]);

		return of({
			success: true,
			message: 'Salón creado exitosamente',
			data: nuevoSalon,
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * ✏️ Actualizar salón
	 */
	actualizarSalon(salonDto: ActualizarSalonDto): Observable<SalonResponse> {
		this.loadingSubject.next(true);

		// 🔗 Implementación para API real:
		/*
    return this.http.put<SalonResponse>(`${this.API_URL}/${salonDto.id}`, salonDto)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getSalones().subscribe(); // Refrescar lista
          }
        })
      );
    */

		// 🎭 Mock implementation
		const index = this.mockSalones.findIndex((s) => s.id === salonDto.id);
		if (index !== -1) {
			// Obtener información del tipo de evento
			const tiposEvento = this.tipoEventoService['mockTiposEvento'] || [];
			const tipoEvento = tiposEvento.find(
				(t) => t.id === salonDto.tipoEventoId,
			);

			this.mockSalones[index] = {
				...this.mockSalones[index],
				nombre: salonDto.nombre,
				direccion: salonDto.direccion,
				capacidadDePersonas: salonDto.capacidadDePersonas,
				tipoEvento: tipoEvento
					? { id: tipoEvento.id, descripcion: tipoEvento.descripcion }
					: this.mockSalones[index].tipoEvento,
				precioRenta: salonDto.precioRenta,
				telefonoContacto: salonDto.telefonoContacto,
				fechaActualizacion: new Date(),
			};
			this.salonesSubject.next([...this.mockSalones]);
		}

		return of({
			success: index !== -1,
			message:
				index !== -1 ? 'Salón actualizado exitosamente' : 'Salón no encontrado',
			data: index !== -1 ? this.mockSalones[index] : undefined,
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * 🗑️ Eliminar salón
	 */
	eliminarSalon(id: number): Observable<SalonResponse> {
		this.loadingSubject.next(true);

		// 🔗 Implementación para API real:
		/*
    return this.http.delete<SalonResponse>(`${this.API_URL}/${id}`)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getSalones().subscribe(); // Refrescar lista
          }
        })
      );
    */

		// 🎭 Mock implementation
		const index = this.mockSalones.findIndex((s) => s.id === id);
		const salon = this.mockSalones[index];

		if (index !== -1) {
			this.mockSalones.splice(index, 1);
			this.salonesSubject.next([...this.mockSalones]);
		}

		return of({
			success: index !== -1,
			message:
				index !== -1 ? 'Salón eliminado exitosamente' : 'Salón no encontrado',
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * 📥 Importar salones desde CSV
	 */
	importarDesdeCSV(archivo: File): Observable<SalonResponse> {
		this.loadingSubject.next(true);

		return new Observable((observer) => {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				try {
					const csv = e.target.result;
					const lines = csv.split('\n');
					const nuevosSalones: Salon[] = [];

					// Saltar header (primera línea)
					for (let i = 1; i < lines.length; i++) {
						const line = lines[i].trim();
						if (line) {
							const columns = line.split(',');
							if (columns.length >= 6) {
								const nuevoSalon: Salon = {
									id:
										Math.max(
											...this.mockSalones.map((s) => s.id),
											...nuevosSalones.map((s) => s.id),
										) + 1,
									nombre: columns[0].trim(),
									direccion: columns[1].trim(),
									capacidadDePersonas: parseInt(columns[2].trim()) || 0,
									tipoEvento: {
										id: parseInt(columns[3].trim()) || 1,
										descripcion: columns[4].trim() || 'Sin especificar',
									},
									precioRenta: parseFloat(columns[5].trim()) || 0,
									telefonoContacto: columns[6]?.trim() || undefined,
									fechaCreacion: new Date(),
									activo: true,
								};
								nuevosSalones.push(nuevoSalon);
							}
						}
					}

					// Agregar a la lista existente
					this.mockSalones.push(...nuevosSalones);
					this.salonesSubject.next([...this.mockSalones]);

					observer.next({
						success: true,
						message: `Se importaron ${nuevosSalones.length} salones exitosamente`,
						data: nuevosSalones,
					});
					observer.complete();
				} catch (error) {
					observer.next({
						success: false,
						message: 'Error al procesar el archivo CSV',
					});
					observer.complete();
				} finally {
					this.loadingSubject.next(false);
				}
			};

			reader.readAsText(archivo);
		});
	}

	/**
	 * 📤 Exportar salones a CSV
	 */
	exportarACSV(): Observable<Blob> {
		this.loadingSubject.next(true);

		// Headers del CSV
		const headers = [
			'Nombre',
			'Dirección',
			'Capacidad de Personas',
			'Tipo de Evento ID',
			'Tipo de Evento',
			'Precio de Renta',
			'Teléfono de Contacto',
			'Fecha de Creación',
			'Activo',
		];

		// Convertir datos a formato CSV
		const csvContent = [
			headers.join(','),
			...this.mockSalones.map((salon) =>
				[
					`"${salon.nombre}"`,
					`"${salon.direccion}"`,
					salon.capacidadDePersonas,
					salon.tipoEvento.id,
					`"${salon.tipoEvento.descripcion}"`,
					salon.precioRenta,
					salon.telefonoContacto ? `"${salon.telefonoContacto}"` : '',
					salon.fechaCreacion
						? salon.fechaCreacion.toISOString().split('T')[0]
						: '',
					salon.activo ? 'true' : 'false',
				].join(','),
			),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

		return of(blob).pipe(
			delay(300),
			map((blob) => {
				this.loadingSubject.next(false);
				return blob;
			}),
		);
	}
}
