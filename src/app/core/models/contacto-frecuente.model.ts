/**
 * Información de contacto
 */
export interface InformacionDeContacto {
	phone: string;
	email: string;
	contactoAlternativo?: string;
}

/**
 * Modelo de contacto frecuente
 */
export interface Contacto {
	id: number;
	nombre: string;
	informacionDeContacto: InformacionDeContacto;
	clientePreferente: boolean;
	fechaCreacion?: Date;
	fechaActualizacion?: Date;
	activo?: boolean;
}

/**
 * DTO para crear contacto
 */
export interface CreateContactoDto {
	nombre: string;
	informacionDeContacto: InformacionDeContacto;
	clientePreferente: boolean;
}

/**
 * DTO para actualizar contacto
 */
export interface UpdateContactoDto extends CreateContactoDto {
	id: number;
}

/**
 * Respuesta del servicio
 */
export interface ContactoResponse {
	success: boolean;
	message: string;
	data?: Contacto | Contacto[];
}
