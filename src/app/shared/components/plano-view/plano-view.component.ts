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

	// Contador para generar IDs únicos
	private canvasElementIdCounter = 1000;

	// Elemento siendo arrastrado desde la lista
	private draggingElement: ElementItem | null = null;

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

		// Reset draggingElement
		this.draggingElement = null;

		// Verificar si el elemento está en el sidebar (elementosUnicos)
		const existeEnSidebar = this.elementosUnicos.some(
			(e) => e.id === elemento.id,
		);
		if (existeEnSidebar) {
			// Viene del sidebar - marcar para crear nueva instancia
			this.draggingElement = elemento;
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
	 * Maneja el drag end de elementos YA en el canvas (solo actualiza posición)
	 */
	onCanvasElementDragEnd(event: CdkDragEnd, elemento: ElementItem): void {
		console.log('🎯 onCanvasElementDragEnd - Inicio', {
			elemento,
			distance: event.distance,
			dropPoint: event.dropPoint,
		});

		const distance = event.distance;

		if (distance && (distance.x !== 0 || distance.y !== 0)) {
			// Buscar el elemento en canvasElements por ID
			const elementoEnCanvas = this.canvasElements.find(
				(e) => e.id === elemento.id,
			);

			console.log('🔍 onCanvasElementDragEnd - Elemento encontrado', {
				encontrado: !!elementoEnCanvas,
				posicionAntes: elementoEnCanvas?.posicion,
				distance,
			});

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

				// Actualizar la referencia de elementoSeleccionado
				this.elementoSeleccionado = elementoEnCanvas;

				console.log('✅ onCanvasElementDragEnd - Posición actualizada', {
					posicionDespues: elementoEnCanvas.posicion,
					elementoSeleccionado: this.elementoSeleccionado === elementoEnCanvas,
				});
			}
		}

		// Resetear la posición visual del drag
		event.source.reset();
	}

	/**
	 * Cuando se suelta el elemento (adaptado de repo GitHub)
	 * Maneja tanto drag desde sidebar como movimiento de elementos existentes
	 */
	onElementDropped(event: CdkDragEnd, elemento: ElementItem): void {
		if (!event?.source) {
			this.cleanupDragState();
			return;
		}

		console.log({
			msg: 'onElementDropped 1',
			elemento,
			draggingElement: this.draggingElement,
		});

		// Si es drag desde sidebar (creación de nueva instancia)
		if (this.draggingElement) {
			// Obtener el canvas
			const canvasBoundary = this.canvasRef?.nativeElement;
			if (!canvasBoundary) {
				this.cleanupDragState();
				event.source.reset();
				return;
			}

			// Obtener el elemento que se está arrastrando
			const draggedElement = event.source.element.nativeElement;
			const draggedRect = draggedElement.getBoundingClientRect();

			// Obtener las coordenadas del canvas
			const canvasRect = canvasBoundary.getBoundingClientRect();
			const dropPoint = event.dropPoint;

			// Verificar si se soltó dentro del canvas
			if (
				dropPoint.x >= canvasRect.left &&
				dropPoint.x <= canvasRect.right &&
				dropPoint.y >= canvasRect.top &&
				dropPoint.y <= canvasRect.bottom
			) {
				// Calcular posición relativa al canvas
				// Restamos la mitad del ancho/alto del elemento para centrarlo en el cursor
				const positionX = dropPoint.x - canvasRect.left - draggedRect.width / 2;
				const positionY = dropPoint.y - canvasRect.top - draggedRect.height / 2;

				// Asegurar que el elemento no se salga del canvas
				const maxX =
					this.canvasDimensions.ancho - this.draggingElement.tamano.ancho;
				const maxY =
					this.canvasDimensions.alto - this.draggingElement.tamano.alto;

				const finalX = Math.max(0, Math.min(positionX, maxX));
				const finalY = Math.max(0, Math.min(positionY, maxY));

				// Crear nuevo elemento en el canvas
				const newElement: ElementItem = {
					...this.draggingElement,
					id: `elemento-${this.canvasElementIdCounter++}`,
					posicion: { x: Math.round(finalX), y: Math.round(finalY) },
					tamano: { ...this.draggingElement.tamano },
					rotacion: 0,
				};
				this.canvasElements.push(newElement);
				this.elementoSeleccionado = newElement;

				console.log({
					msg: 'onElementDropped 2 - Elemento creado',
					newElement,
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

					// Actualizar la referencia de elementoSeleccionado
					this.elementoSeleccionado = elementoEnCanvas;

					console.log({
						msg: 'onElementDropped 3 - Elemento movido',
						elementoEnCanvas,
						canvasElements: this.canvasElements,
					});
				}
			}
		}

		// Resetear el elemento arrastrado
		this.draggingElement = null;

		// Resetear la posición del elemento de la lista
		event.source.reset();
		this.cleanupDragState();

		console.log('onElementDropped 4 - Finalizado');
	}

	/**
	 * Limpia estado de drag
	 */
	private cleanupDragState(): void {
		this.draggingElement = null;
	}

	/**
	 * Selecciona elemento al hacer doble click
	 *
	 * Busca el elemento en canvasElements para asegurar la referencia correcta
	 */
	seleccionarElemento(elemento: ElementItem, event: Event): void {
		event.stopPropagation();
		// Buscar el elemento real en canvasElements
		const elementoEnCanvas = this.canvasElements.find(
			(e) => e.id === elemento.id,
		);
		this.elementoSeleccionado = elementoEnCanvas || null;
		console.log({ elemento });
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
			const elementoEnCanvas = this.canvasElements.find(
				(e) => e.id === this.elementoSeleccionado?.id,
			);
			if (elementoEnCanvas) {
				const index = this.canvasElements.indexOf(elementoEnCanvas);
				if (index > -1) {
					this.canvasElements.splice(index, 1);
					this.elementoSeleccionado = null;
				}
			}
		}
	}

	/**
	 * Rota el elemento seleccionado 45 grados
	 */
	rotateElemento(): void {
		console.log('🔄 rotateElemento - Inicio', {
			elementoSeleccionado: this.elementoSeleccionado,
			posicionSeleccionado: this.elementoSeleccionado?.posicion,
			rotacionSeleccionado: this.elementoSeleccionado?.rotacion,
		});

		if (this.elementoSeleccionado) {
			const elementoEnCanvas = this.canvasElements.find(
				(e) => e.id === this.elementoSeleccionado?.id,
			);

			console.log('🔍 rotateElemento - Elemento encontrado', {
				encontrado: !!elementoEnCanvas,
				elementoEnCanvas,
				posicionEnCanvas: elementoEnCanvas?.posicion,
				rotacionEnCanvas: elementoEnCanvas?.rotacion,
				mismaReferencia: elementoEnCanvas === this.elementoSeleccionado,
			});

			if (elementoEnCanvas) {
				const rotacionAntes = elementoEnCanvas.rotacion || 0;
				elementoEnCanvas.rotacion = rotacionAntes + 45;
				if (elementoEnCanvas.rotacion >= 360) {
					elementoEnCanvas.rotacion = 0;
				}

				console.log('✅ rotateElemento - Después de rotar', {
					rotacionAntes,
					rotacionDespues: elementoEnCanvas.rotacion,
					posicionDespues: elementoEnCanvas.posicion,
					elementoSeleccionadoPosicion: this.elementoSeleccionado.posicion,
				});
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

		const elementoEnCanvas = this.canvasElements.find(
			(e) => e.id === this.elementoSeleccionado?.id,
		);
		if (!elementoEnCanvas) return;

		const factor = direccion === 'mas' ? 1.2 : 0.8;
		const nuevoAncho = Math.max(
			40,
			Math.min(500, elementoEnCanvas.tamano.ancho * factor),
		);
		const nuevoAlto = Math.max(
			40,
			Math.min(500, elementoEnCanvas.tamano.alto * factor),
		);

		elementoEnCanvas.tamano.ancho = Math.round(nuevoAncho);
		elementoEnCanvas.tamano.alto = Math.round(nuevoAlto);
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
