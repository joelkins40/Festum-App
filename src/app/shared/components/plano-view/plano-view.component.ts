import {
	Component,
	Input,
	ViewChild,
	ElementRef,
	OnChanges,
	SimpleChanges,
	HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import {
	CdkDrag,
	CdkDropList,
	CdkDragEnd,
	CdkDragStart,
	CdkDragDrop,
	moveItemInArray,
} from '@angular/cdk/drag-drop';

import { ElementItem, Product, ElementoEnCanvas } from './types';
// todo: escribir un tsdoc mas declarativo y con mas concordancia para este componente
/**
 * 🎯 DRAG & DROP REFACTOR - Comportamiento Híbrido
 * ======================================================
 *
 * Arquitectura corregida:
 * 1. ✅ Sidebar: usa cdkDropList para lista ordenada de elementos únicos
 *    - Permite reordenamiento interno (drag & drop dentro del sidebar)
 *    - Los elementos se pueden arrastrar AL canvas
 * 2. ✅ Canvas: NO es cdkDropList, es cdkDragBoundary para posicionamiento libre
 *    - Sin comportamiento de lista (sin reordenamiento)
 *    - Elementos posicionados por coordenadas absolutas
 * 3. ✅ Transferencia: drag desde sidebar crea nuevas instancias en canvas
 *    - onElementDragEnd detecta si viene del sidebar (sidebarDragData)
 *    - Calcula posición usando getBoundingClientRect()
 *    - Crea instancia nueva con ID único
 * 4. ✅ Selección: doble click para seleccionar, click en canvas para deseleccionar
 * 5. ✅ Movimiento: elementos en canvas usan event.distance sin escala
 * 6. ✅ Angular 19: @for en template, sintaxis moderna
 *
 * Comportamiento final:
 * - Sidebar mantiene lista ordenada (cdkDropList con sorting)
 * - Canvas es área libre (sin cdkDropList, solo cdkDragBoundary)
 * - No más saltos al arrastrar
 * - Posiciones calculadas directamente
 * - Clamp automático dentro de límites del canvas
 */

@Component({
	selector: 'app-plano-view',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
		MatButtonModule,
		MatSidenavModule,
		MatTooltipModule,
		MatDividerModule,
		CdkDropList,
		CdkDrag,
	],
	templateUrl: './plano-view.component.html',
	styleUrl: './plano-view.component.scss',
})
export class PlanoViewComponent implements OnChanges {
	@ViewChild('canvas', { static: false })
	canvasRef!: ElementRef<HTMLDivElement>;

	@Input() elements: ElementItem[] = [];
	@Input() selectedProduct?: Product;
	@Input() showSidebar?: boolean = false;
	@Input() plantillaNombre?: string; // Nombre de la plantilla seleccionada

	@Input() set diseno(value: { elementos: ElementoEnCanvas[] } | null) {
		if (value?.elementos) {
			this.elements = value.elementos;
		}
	}

	// Canvas dimensions
	canvasDimensions = { ancho: 800, alto: 600 };

	// Elemento seleccionado (solo visual)
	elementoSeleccionado: ElementItem | null = null;

	// Estado interno del canvas (copia independiente de elements)
	canvasElements: ElementItem[] = [];

	// Lista de elementos únicos para el sidebar (solo vista)
	elementosUnicos: ElementItem[] = [];

	// Control de apertura del sidebar
	sidebarAbierto = true;

	// Estado de drag desde sidebar
	private sidebarDragData: ElementItem | null = null;

	// Flag para prevenir inserciones duplicadas
	private currentlyInserting = false;

	/**
	 * Verifica si un elemento ya existe en el canvas por ID
	 */
	private isExistingElement(id: string): boolean {
		return this.canvasElements.some((e) => e.id === id);
	}

	/**
	 * Obtiene el rect del canvas
	 */
	private getCanvasRect(): DOMRect | null {
		return this.canvasRef?.nativeElement.getBoundingClientRect() || null;
	}

	/**
	 * Convierte coordenadas de pointer a coordenadas de canvas
	 */
	private convertToCanvasCoords(
		clientX: number,
		clientY: number,
		canvasRect: DOMRect,
		elementSize: { ancho: number; alto: number },
	): { x: number; y: number } {
		// Calcular posición centrada en el cursor
		const x = clientX - canvasRect.left - elementSize.ancho / 2;
		const y = clientY - canvasRect.top - elementSize.alto / 2;

		// Aplicar clamp
		const clampedX = Math.max(
			0,
			Math.min(x, this.canvasDimensions.ancho - elementSize.ancho),
		);
		const clampedY = Math.max(
			0,
			Math.min(y, this.canvasDimensions.alto - elementSize.alto),
		);

		return {
			x: Math.round(clampedX),
			y: Math.round(clampedY),
		};
	}

	ngOnChanges(changes: SimpleChanges): void {
		// Actualizar estado interno del canvas cuando cambia elements
		if (changes['elements'] && this.elements) {
			// Deep copy para evitar referencias compartidas
			this.canvasElements = this.elements.map((elem) => ({
				...elem,
				posicion: { ...elem.posicion },
				tamano: { ...elem.tamano },
			}));
			this.generarElementosUnicos();
		}

		// Reaccionar a cambios en selectedProduct si es necesario
		if (changes['selectedProduct'] && this.selectedProduct) {
			this.agregarElementoDesdeProducto(this.selectedProduct);
		}
	}

	/**
	 * Genera lista de elementos únicos para el sidebar basada en tipo+nombre
	 * No modifica el array original elements
	 */
	private generarElementosUnicos(): void {
		const mapa = new Map<string, ElementItem>();

		for (const elem of this.elements) {
			const key = `${elem.tipo}-${elem.nombre}`;
			if (!mapa.has(key)) {
				// Deep copy para evitar referencias compartidas
				mapa.set(key, {
					...elem,
					posicion: { ...elem.posicion },
					tamano: { ...elem.tamano },
				});
			}
		}

		this.elementosUnicos = Array.from(mapa.values());
	}

	/**
	 * Convierte un producto en un elemento visual en el plano
	 */
	private agregarElementoDesdeProducto(product: Product): void {
		// Solo agregar si no existe ya un elemento con este producto
		const existingElement = this.elements.find(
			(el) => el.id === `producto_${product.productoServicioId || product.id}`,
		);

		if (!existingElement) {
			const newElement: ElementItem = {
				id: `producto_${product.productoServicioId || product.id || Date.now()}`,
				tipo: product.tipo.toLowerCase(),
				nombre: product.nombre,
				posicion: { x: 100, y: 100 },
				tamano: { ancho: 120, alto: 120 },
				color: product.tipo === 'Producto' ? '#20b2aa' : '#9c27b0',
				icono: product.tipo === 'Producto' ? 'inventory_2' : 'handyman',
				rotacion: 0,
			};

			this.elements.push(newElement);
		}
	}

	/**
	 * Inicio de drag: marca elemento como seleccionado y prepara estado
	 * Detecta si viene del sidebar o es un elemento del canvas
	 */
	onElementDragStart(_event: CdkDragStart, elemento: ElementItem): void {
		this.elementoSeleccionado = elemento;

		console.log({ msg: 'onElementDragStart', elemento });

		//? Estas banderas realmente las estamos usando?
		// Reset flags
		this.currentlyInserting = false;
		this.sidebarDragData = null;

		// Verificar si el elemento está en el sidebar (elementosUnicos)
		const existeEnSidebar = this.elementosUnicos.some(
			(e) => e.id === elemento.id,
		);
		if (existeEnSidebar) {
			// Viene del sidebar
			this.sidebarDragData = elemento;
			this.currentlyInserting = true;
		}
	}

	/**
	 * Maneja drops dentro del sidebar (reordenamiento)
	 * No se usa para transferir al canvas
	 */
	onSidebarDrop(event: CdkDragDrop<ElementItem[]>): void {
		if (event.previousContainer === event.container) {
			// Reordenar dentro del sidebar
			moveItemInArray(
				this.elementosUnicos,
				event.previousIndex,
				event.currentIndex,
			);
		}
		// Si previousContainer !== container, no hacer nada
		// (el canvas maneja la transferencia en onElementDragEnd)
	}

	/**
	 * Fin de drag: calcula posición final y actualiza estado
	 * Maneja tanto drag desde sidebar como movimiento de elementos existentes
	 *
	 * QA CHECKLIST:
	 * ✓ Arrastrar desde sidebar → elemento aparece en posición correcta sin saltos
	 * ✓ Mover elemento en canvas → posición actualizada solo al soltar
	 * ✓ Elementos no se reordenan (sin comportamiento de lista)
	 * ✓ Doble click selecciona elemento
	 * ✓ Click en canvas deselecciona
	 * ✓ Límites del canvas respetados (clamp automático)
	 * ✓ Elementos independientes (pueden estar encimados)
	 */
	onElementDragEnd(event: CdkDragEnd, elemento: ElementItem): void {
		if (!event?.source || !this.canvasRef) {
			this.cleanupDragState();
			return;
		}

		const canvasRect = this.getCanvasRect();
		if (!canvasRect) {
			this.cleanupDragState();
			return;
		}

		console.log({
			msg: 'onElementDragEnd 1',
			elemento,
			canvasElements: this.canvasElements,
		});

		// Verificar si es drag desde sidebar (creación de nueva instancia)
		if (this.sidebarDragData && this.currentlyInserting) {
			// Obtener posición del elemento arrastrado
			const elementRect =
				event.source.element.nativeElement.getBoundingClientRect();

			// Calcular centro del elemento arrastrado
			const centerX = elementRect.left + elementRect.width / 2;
			const centerY = elementRect.top + elementRect.height / 2;

			// Convertir a coordenadas del canvas
			const posicion = this.convertToCanvasCoords(
				centerX,
				centerY,
				canvasRect,
				this.sidebarDragData.tamano,
			);

			// Generar ID único
			const nuevoId = `elemento-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

			// Verificar que no exista (prevención de duplicados)
			if (!this.isExistingElement(nuevoId)) {
				// Crear nueva instancia
				const nuevoElemento: ElementItem = {
					...this.sidebarDragData,
					id: nuevoId,
					posicion,
					tamano: { ...this.sidebarDragData.tamano },
					rotacion: 0,
				};

				this.canvasElements.push(nuevoElemento);
				this.elementoSeleccionado = nuevoElemento;

				console.log({
					msg: 'onElementDragEnd 2',
					elemento,
					canvasElements: this.canvasElements,
				});
			}
		} else {
			// Mover elemento existente en canvas
			const distance = event.distance;

			if (distance && (distance.x !== 0 || distance.y !== 0)) {
				// Buscar el elemento en canvasElements por ID
				const elementoEnCanvas = this.canvasElements.find(
					(e) => e.id === elemento.id,
				);

				if (elementoEnCanvas) {
					// Actualizar posición del elemento encontrado
					const nuevaX = elementoEnCanvas.posicion.x + distance.x;
					const nuevaY = elementoEnCanvas.posicion.y + distance.y;

					// Aplicar límites
					const maxX = Math.max(
						0,
						this.canvasDimensions.ancho - elementoEnCanvas.tamano.ancho,
					);
					const maxY = Math.max(
						0,
						this.canvasDimensions.alto - elementoEnCanvas.tamano.alto,
					);

					elementoEnCanvas.posicion.x = Math.max(
						0,
						Math.min(Math.round(nuevaX), maxX),
					);
					elementoEnCanvas.posicion.y = Math.max(
						0,
						Math.min(Math.round(nuevaY), maxY),
					);

					console.log({
						msg: 'onElementDragEnd 3',
						elementoEnCanvas,
						canvasElements: this.canvasElements,
					});
				}
			}

			console.log({
				msg: 'onElementDragEnd 4',
				elemento,
				canvasElements: this.canvasElements,
			});
		}

		event.source.reset();
		this.cleanupDragState();

		console.log('onElementDragEnd 5');
	}

	/**
	 * Limpia estado de drag
	 */
	private cleanupDragState(): void {
		this.sidebarDragData = null;
		this.currentlyInserting = false;
	}

	/**
	 * Selecciona elemento al hacer doble click
	 */
	seleccionarElemento(elemento: ElementItem, event: Event): void {
		event.stopPropagation();
		this.elementoSeleccionado = elemento;
	}

	/**
	 * Deselecciona al hacer click en el canvas (fuera de elementos)
	 */
	deseleccionarElemento(): void {
		this.elementoSeleccionado = null;
	}

	trackByElementId(index: number, elemento: ElementItem): string {
		return elemento.id || `elemento-${index}`;
	}

	getCanvasStyle() {
		return {
			'width.px': this.canvasDimensions.ancho,
			'height.px': this.canvasDimensions.alto,
			'min-width.px': this.canvasDimensions.ancho,
			'min-height.px': this.canvasDimensions.alto,
		};
	}

	getElementoStyle(elemento: ElementItem) {
		return {
			transform: elemento.rotacion ? `rotate(${elemento.rotacion}deg)` : 'none',
		};
	}

	getIconSize(elemento: ElementItem): number {
		if (!elemento?.tamano) return 24;

		const minDimension = Math.min(elemento.tamano.ancho, elemento.tamano.alto);
		const iconSize = minDimension * 0.6;
		const minSize = 24;
		const maxSize = 80;

		const result = Math.max(minSize, Math.min(maxSize, Math.round(iconSize)));
		return Number.isFinite(result) ? result : 24;
	}

	shouldShowLabel(elemento: ElementItem): boolean {
		if (!elemento?.tamano) return false;
		const minDimension = Math.min(elemento.tamano.ancho, elemento.tamano.alto);
		return minDimension >= 70;
	}

	getLabelFontSize(elemento: ElementItem): number {
		if (!elemento?.tamano) return 10;
		const minDimension = Math.min(elemento.tamano.ancho, elemento.tamano.alto);
		const fontSize = minDimension * 0.12;
		const result = Math.max(9, Math.min(14, fontSize));
		return Number.isFinite(result) ? result : 10;
	}

	// ===== MÉTODOS PARA CONTROLES DE ELEMENTOS =====

	/**
	 * Elimina el elemento seleccionado solo del canvas interno
	 * NO modifica el array original elements recibido del padre
	 */
	eliminarElemento(): void {
		if (this.elementoSeleccionado) {
			const index = this.canvasElements.indexOf(this.elementoSeleccionado);
			if (index > -1) {
				this.canvasElements.splice(index, 1);
				this.elementoSeleccionado = null;
			}
		}
	}

	/**
	 * Rota el elemento seleccionado 45 grados
	 */
	rotateElemento(): void {
		console.log('rotateElemento called');
		if (this.elementoSeleccionado) {
			this.elementoSeleccionado.rotacion =
				(this.elementoSeleccionado.rotacion || 0) + 45;
			console.log({
				msg: 'rotateElemento called 2',
				elementoSeleccionado: this.elementoSeleccionado,
			});
			if (this.elementoSeleccionado.rotacion >= 360) {
				this.elementoSeleccionado.rotacion = 0;
				console.log('rotateElemento called 3');
			}
		}
	}

	/**
	 * Redimensiona solo el elemento seleccionado actualmente
	 * Opera sobre la instancia específica en canvasElements (por referencia)
	 *
	 * QA: Seleccionar elem A → pulsar + → solo A crece
	 *     Seleccionar elem B (mismo icono) → pulsar - → solo B cambia
	 */
	redimensionarElemento(direccion: 'mas' | 'menos'): void {
		if (!this.elementoSeleccionado) return;

		const factor = direccion === 'mas' ? 1.2 : 0.8;
		const nuevoAncho = Math.max(
			40,
			Math.min(500, this.elementoSeleccionado.tamano.ancho * factor),
		);
		const nuevoAlto = Math.max(
			40,
			Math.min(500, this.elementoSeleccionado.tamano.alto * factor),
		);

		this.elementoSeleccionado.tamano.ancho = Math.round(nuevoAncho);
		this.elementoSeleccionado.tamano.alto = Math.round(nuevoAlto);
	}

	/**
	 * Alterna la visibilidad del sidebar
	 */
	toggleSidebar(): void {
		this.sidebarAbierto = !this.sidebarAbierto;
	}

	/**
	 * Obtiene el nombre de la plantilla sin el sufijo después del guión
	 */
	getPlantillaNombreDisplay(): string {
		if (!this.plantillaNombre) return '';
		const parts = this.plantillaNombre.split(' - ');
		return parts[0];
	}

	/**
	 * Manejo de atajos de teclado para el elemento seleccionado
	 */
	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent): void {
		if (!this.elementoSeleccionado) return;

		switch (event.key) {
			case 'Delete':
			case 'Backspace':
				this.eliminarElemento();
				event.preventDefault();
				break;
			case '+':
			case '=':
				this.redimensionarElemento('mas');
				event.preventDefault();
				break;
			case '-':
				this.redimensionarElemento('menos');
				event.preventDefault();
				break;
			case 'r':
			case 'R':
				this.rotateElemento();
				event.preventDefault();
				break;
		}
	}
}
