/**
 * Elemento visual del plano
 */
export interface ElementItem {
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

// Alias para compatibilidad con plano.component.ts
export type ElementoEnCanvas = ElementItem;

/**
 * Producto o servicio seleccionado
 */
export interface Product {
	id?: string;
	productoServicioId?: number;
	tipo: 'Producto' | 'Servicio';
	nombre: string;
	descripcion: string;
	cantidad: number;
	precioUnitario?: number;
	subtotal?: number;
}
