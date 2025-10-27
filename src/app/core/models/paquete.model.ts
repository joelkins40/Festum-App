import { ProductoServicio } from './productos-servicios.model';

export interface ProductoIncluido {
	productoServicio: ProductoServicio;
	cantidad: number;
	precioUnitario?: number; // Precio personalizado (opcional, si no se especifica usa el precio público del producto)
}

export interface Paquete {
	id: number;
	tipo: 'Paquete' | 'Servicio';
	nombre: string;
	descripcionCorta: string;
	productos: ProductoIncluido[];
	precioTotal: number;
	categoria: string; // tipo de evento
	disponibilidad: number; // stock
	imagen?: string; // url o base64
	fechaCreacion?: Date;
	activo?: boolean;
}

export interface PaquetesResponse {
	success: boolean;
	message?: string;
	data?: Paquete[];
}
