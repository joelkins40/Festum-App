/**
 * Modelo de dirección de cliente
 */
export interface DireccionCliente {
	id: number;
	clienteId: number;
	cliente: string;
	fullAddress: string;
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	creationDate: Date;
	active: boolean;
}

/**
 * DTO para crear dirección
 */
export interface CreateDireccionDto {
	clienteId: number;
	cliente: string;
	fullAddress: string;
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
}

/**
 * DTO para actualizar dirección
 */
export interface UpdateDireccionDto extends CreateDireccionDto {
	id: number;
}

/**
 * Respuesta del servicio
 */
export interface DireccionResponse {
	success: boolean;
	message: string;
	data?: DireccionCliente | DireccionCliente[];
}
