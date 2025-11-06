import { Cliente } from '../../../clientes/lista/cliente.model';

/**
 * Tipo de lugar para el evento
 */
export enum TipoLugar {
	DIRECCION_CLIENTE = 'direccion_cliente',
	NUEVA_DIRECCION = 'nueva_direccion',
	SALON = 'salon',
}

/**
 * Información del lugar del evento
 */
export interface Lugar {
	tipo: TipoLugar;
	direccionCliente?: {
		line1: string;
		line2: string;
		line3: string;
	};
	nuevaDireccion?: {
		calle: string;
		numero: string;
		colonia: string;
		ciudad: string;
		estado: string;
		codigoPostal: string;
	};
	salon?: {
		id: number;
		nombre: string;
		direccion: string;
	};
}

/**
 * Producto o servicio en la nota
 */
export interface ProductoNota {
	id: string; // ID temporal para la tabla
	productoServicioId: number;
	tipo: 'Producto' | 'Servicio';
	nombre: string;
	descripcion: string;
	cantidad: number;
	precioUnitario: number;
	subtotal: number;
	editando?: boolean;
}

/**
 * Modelo principal de la nota/venta
 */
export interface Nota {
	id?: number;
	folio: string;
	fechaRecepcion: Date;
	fechaRegreso: Date;
	nombreEvento: string;
	cliente: Cliente;
	clienteId: number;
	lugar: Lugar;
	productos: ProductoNota[];
	subtotal: number;
	iva: number;
	total: number;
	observaciones?: string;
	fechaCreacion?: Date;
	fechaActualizacion?: Date;
	estado?: 'borrador' | 'confirmada' | 'entregada' | 'finalizada' | 'cancelada';
}

/**
 * DTO para crear nota
 */
export interface CreateNotaDto {
	folio: string;
	fechaRecepcion: Date;
	fechaRegreso: Date;
	nombreEvento: string;
	clienteId: number;
	lugar: Lugar;
	productos: ProductoNota[];
	subtotal: number;
	iva: number;
	total: number;
	observaciones?: string;
}

/**
 * DTO para actualizar nota
 */
export interface UpdateNotaDto extends CreateNotaDto {
	id: number;
	estado?: 'borrador' | 'confirmada' | 'entregada' | 'finalizada' | 'cancelada';
}

/**
 * Respuesta del servicio
 */
export interface NotaResponse {
	success: boolean;
	message: string;
	data?: Nota | Nota[];
}
