import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
	Nota,
	CreateNotaDto,
	UpdateNotaDto,
	NotaResponse,
} from './models/nota.model';

@Injectable({
	providedIn: 'root',
})
export class NuevaNotaService {
	private notasSubject = new BehaviorSubject<Nota[]>([]);
	public notas$ = this.notasSubject.asObservable();
	private folioCounter = 1;

	/**
	 * Genera un nuevo folio en formato NV-00001
	 */
	generarFolio(): string {
		const folioNumber = this.folioCounter.toString().padStart(5, '0');
		this.folioCounter++;
		return `NV-${folioNumber}`;
	}

	/**
	 * Valida que la fecha de regreso sea mayor que la de recepción
	 */
	validarFechas(fechaRecepcion: Date, fechaRegreso: Date): boolean {
		return new Date(fechaRegreso) > new Date(fechaRecepcion);
	}

	/**
	 * Calcula el subtotal de los productos
	 */
	calcularSubtotal(
		productos: Array<{ cantidad: number; precioUnitario: number }>,
	): number {
		return productos.reduce(
			(total, prod) => total + prod.cantidad * prod.precioUnitario,
			0,
		);
	}

	/**
	 * Calcula el IVA (16%)
	 */
	calcularIva(subtotal: number): number {
		return subtotal * 0.16;
	}

	/**
	 * Calcula el total
	 */
	calcularTotal(subtotal: number, iva: number): number {
		return subtotal + iva;
	}

	/**
	 * Crea una nueva nota
	 */
	createNota(dto: CreateNotaDto): Observable<NotaResponse> {
		const notas = this.notasSubject.value;
		const newId = Math.max(...notas.map((n) => n.id ?? 0), 0) + 1;

		const nuevaNota: Nota = {
			id: newId,
			...dto,
			estado: 'borrador',
			fechaCreacion: new Date(),
			fechaActualizacion: new Date(),
		} as Nota;

		const nuevasNotas = [...notas, nuevaNota];
		this.notasSubject.next(nuevasNotas);

		return of({
			success: true,
			message: 'Nota creada exitosamente',
			data: nuevaNota,
		}).pipe(delay(500));
	}

	/**
	 * Actualiza una nota existente
	 */
	updateNota(dto: UpdateNotaDto): Observable<NotaResponse> {
		const notas = this.notasSubject.value;
		const index = notas.findIndex((n) => n.id === dto.id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Nota no encontrada',
			}).pipe(delay(200));
		}

		const notaActualizada: Nota = {
			...notas[index],
			...dto,
			fechaActualizacion: new Date(),
		};

		const nuevasNotas = [...notas];
		nuevasNotas[index] = notaActualizada;
		this.notasSubject.next(nuevasNotas);

		return of({
			success: true,
			message: 'Nota actualizada exitosamente',
			data: notaActualizada,
		}).pipe(delay(500));
	}

	/**
	 * Obtiene todas las notas
	 */
	getNotas(): Observable<NotaResponse> {
		return of({
			success: true,
			message: 'Notas obtenidas exitosamente',
			data: this.notasSubject.value,
		}).pipe(delay(300));
	}

	/**
	 * Obtiene una nota por ID
	 */
	getNotaById(id: number): Observable<NotaResponse> {
		const nota = this.notasSubject.value.find((n) => n.id === id);
		return of({
			success: nota ? true : false,
			message: nota ? 'Nota encontrada' : 'Nota no encontrada',
			data: nota,
		}).pipe(delay(200));
	}

	/**
	 * Elimina una nota
	 */
	deleteNota(id: number): Observable<NotaResponse> {
		const notas = this.notasSubject.value;
		const nota = notas.find((n) => n.id === id);

		if (!nota) {
			return of({
				success: false,
				message: 'Nota no encontrada',
			}).pipe(delay(200));
		}

		const nuevasNotas = notas.filter((n) => n.id !== id);
		this.notasSubject.next(nuevasNotas);

		return of({
			success: true,
			message: 'Nota eliminada exitosamente',
			data: nota,
		}).pipe(delay(300));
	}
}
