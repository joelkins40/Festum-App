export interface MuebleIncluido {
	id: number;
	nombre: string;
	cantidad: number;
}

export interface Paquete {
	id: number;
	tipo: 'Paquete' | 'Servicio';
	nombre: string;
	descripcionCorta: string;
	muebles: MuebleIncluido[];
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
