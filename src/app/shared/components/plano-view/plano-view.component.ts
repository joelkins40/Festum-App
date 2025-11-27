import {
	Component,
	Input,
	ViewChild,
	ElementRef,
	OnChanges,
	SimpleChanges,
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
} from '@angular/cdk/drag-drop';

import { ElementItem, Product, ElementoEnCanvas } from './types';

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

	// Lista de elementos arrastrables para el sidebar (se actualiza reactivamente)
	elementosArrastrables: ElementItem[] = [];

	// Control de apertura del sidebar
	sidebarAbierto = true;

	ngOnChanges(changes: SimpleChanges): void {
		// Actualizar lista de elementos arrastrables cuando cambia elements
		if (changes['elements'] && this.elements) {
			this.elementosArrastrables = [...this.elements];
		}

		// Reaccionar a cambios en selectedProduct si es necesario
		if (changes['selectedProduct'] && this.selectedProduct) {
			// Lógica futura: agregar elemento al canvas basado en producto
			this.agregarElementoDesdeProducto(this.selectedProduct);
		}
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

	onElementDragStart(_event: CdkDragStart, _elemento: ElementItem): void {
		// Inicializar drag
	}

	onElementDragEnd(event: CdkDragEnd, elemento: ElementItem): void {
		if (!event?.source) return;

		const distance = event.distance;
		if (!distance || (!distance.x && !distance.y)) {
			event.source.reset();
			return;
		}

		const canvasElement = this.canvasRef?.nativeElement;
		if (!canvasElement) {
			event.source.reset();
			return;
		}

		// Calcular escala del canvas
		const canvasRect = canvasElement.getBoundingClientRect();
		const scaleX = canvasRect.width / this.canvasDimensions.ancho;
		const scaleY = canvasRect.height / this.canvasDimensions.alto;

		// Convertir movimiento a coordenadas lógicas
		const deltaX = distance.x / scaleX;
		const deltaY = distance.y / scaleY;

		const nuevaX = elemento.posicion.x + deltaX;
		const nuevaY = elemento.posicion.y + deltaY;

		// Aplicar límites
		const maxX = Math.max(
			0,
			this.canvasDimensions.ancho - elemento.tamano.ancho,
		);
		const maxY = Math.max(0, this.canvasDimensions.alto - elemento.tamano.alto);

		elemento.posicion.x = Math.max(0, Math.min(Math.round(nuevaX), maxX));
		elemento.posicion.y = Math.max(0, Math.min(Math.round(nuevaY), maxY));

		event.source.reset();
	}

	seleccionarElemento(elemento: ElementItem, event: Event): void {
		event.stopPropagation();
		this.elementoSeleccionado = elemento;
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
			position: 'absolute',
			'left.px': elemento.posicion.x,
			'top.px': elemento.posicion.y,
			'width.px': elemento.tamano.ancho,
			'height.px': elemento.tamano.alto,
			'background-color': 'transparent',
			transform: elemento.rotacion ? `rotate(${elemento.rotacion}deg)` : 'none',
			'z-index': 1,
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
	 * Elimina el elemento seleccionado del canvas
	 */
	eliminarElemento(): void {
		if (this.elementoSeleccionado) {
			const index = this.elements.indexOf(this.elementoSeleccionado);
			if (index > -1) {
				this.elements.splice(index, 1);
				this.elementoSeleccionado = null;
				// Actualizar lista de elementos arrastrables
				this.elementosArrastrables = [...this.elements];
			}
		}
	}

	/**
	 * Rota el elemento seleccionado 45 grados
	 */
	rotateElemento(): void {
		if (this.elementoSeleccionado) {
			this.elementoSeleccionado.rotacion = (this.elementoSeleccionado.rotacion || 0) + 45;
			if (this.elementoSeleccionado.rotacion >= 360) {
				this.elementoSeleccionado.rotacion = 0;
			}
		}
	}

	/**
	 * Redimensiona el elemento en la dirección especificada
	 */
	redimensionarElemento(elemento: ElementItem, direccion: 'mas' | 'menos'): void {
		if (!elemento) return;

		const factor = direccion === 'mas' ? 1.2 : 0.8;
		const nuevoAncho = Math.max(40, Math.min(500, elemento.tamano.ancho * factor));
		const nuevoAlto = Math.max(40, Math.min(500, elemento.tamano.alto * factor));

		elemento.tamano.ancho = Math.round(nuevoAncho);
		elemento.tamano.alto = Math.round(nuevoAlto);
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
}
