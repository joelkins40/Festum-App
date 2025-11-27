import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Interfaz de diseño guardado (tomada de plano.component.ts)
 * TODO: Centralizar en shared/types para evitar duplicación
 */
export interface DisenoGuardado {
	plantillaId: string;
	plantillaNombre: string;
	elementos: ElementoEnCanvas[];
	fechaGuardado: string;
	version: string;
}

/**
 * Elemento en canvas (estructura de plano.component.ts línea ~38)
 * TODO: Mover a shared/types cuando se refactorice
 */
export interface ElementoEnCanvas {
	id: string;
	tipo: string;
	nombre: string;
	posicion: { x: number; y: number };
	tamano: { ancho: number; alto: number };
	color: string;
	rotacion?: number;
	icono: string;
	productoServicioId?: number;
}

/**
 * Plantilla de evento con productos asociados
 */
export interface PlantillaEvento {
	id: string;
	nombre: string;
	descripcion: string;
	tipo: string;
	productosIds: number[];
	diseno: DisenoGuardado;
}

@Injectable({
	providedIn: 'root',
})
export class PlantillasService {
	/**
	 * Mock de plantillas de eventos
	 *
	 * NOTA: Las propiedades icono, color, tamano y productoServicioId se agregan para:
	 * 1. Compatibilidad con plano-view y su visualización de elementos
	 * 2. Mapeo directo entre productos del catálogo y elementos visuales del plano
	 * 3. Permitir la reconstrucción automática de productos desde la plantilla
	 *
	 * TODO: Estas plantillas deben obtenerse desde el backend cuando se implemente la API real.
	 * El servidor debe retornar las plantillas con sus elementos y referencias a productos.
	 */
	private mockPlantillas: PlantillaEvento[] = [
		{
			id: 'boda-clasica',
			nombre: 'Boda Clásica Elegante',
			descripcion: 'Configuración estándar para boda de 100 personas',
			tipo: 'Boda',
			productosIds: [3, 4, 5, 6], // Mesa Rectangular, Mesa Redonda, Sillas, Vajilla
			diseno: {
				plantillaId: 'boda-clasica',
				plantillaNombre: 'Boda Clásica Elegante',
				elementos: [
					{
						id: 'mesa-principal-1',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular Cristal 2.5x1.2m',
						posicion: { x: 250, y: 100 },
						tamano: { ancho: 180, alto: 90 },
						color: '#20b2aa',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'mesa-invitados-1',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 150, y: 250 },
						tamano: { ancho: 120, alto: 120 },
						color: '#654321',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'mesa-invitados-2',
						tipo: 'mesa-redonda',
						nombre: 'Mesa Redonda Madera Ø1.8m',
						posicion: { x: 350, y: 250 },
						tamano: { ancho: 120, alto: 120 },
						color: '#654321',
						icono: 'table_restaurant',
						rotacion: 0,
						productoServicioId: 4,
					},
					{
						id: 'sillas-grupo-1',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 150, y: 400 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
		{
			id: 'evento-corporativo',
			nombre: 'Evento Corporativo Formal',
			descripcion: 'Setup para presentación corporativa con 50 asistentes',
			tipo: 'Corporativo',
			productosIds: [3, 5, 6], // Mesa Rectangular, Sillas, Vajilla
			diseno: {
				plantillaId: 'evento-corporativo',
				plantillaNombre: 'Evento Corporativo Formal',
				elementos: [
					{
						id: 'mesa-presentacion',
						tipo: 'mesa-rectangular',
						nombre: 'Mesa Rectangular Cristal 2.5x1.2m',
						posicion: { x: 300, y: 50 },
						tamano: { ancho: 180, alto: 90 },
						color: '#20b2aa',
						icono: 'table_bar',
						rotacion: 0,
						productoServicioId: 3,
					},
					{
						id: 'sillas-auditorio-1',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 100, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-2',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 200, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
					{
						id: 'sillas-auditorio-3',
						tipo: 'silla',
						nombre: 'Silla Chiavari Dorada',
						posicion: { x: 300, y: 200 },
						tamano: { ancho: 50, alto: 50 },
						color: '#ffd700',
						icono: 'event_seat',
						rotacion: 0,
						productoServicioId: 5,
					},
				],
				fechaGuardado: new Date().toISOString(),
				version: '1.0',
			},
		},
	];

	getPlantillas(): Observable<PlantillaEvento[]> {
		return of(this.mockPlantillas);
	}

	getPlantillaById(id: string): Observable<PlantillaEvento | undefined> {
		return of(this.mockPlantillas.find((p) => p.id === id));
	}
}
