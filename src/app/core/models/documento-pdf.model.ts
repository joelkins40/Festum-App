/**
 * Modelo de datos para Documentos PDF
 */
export interface DocumentoPdf {
	id: number;
	nombre: string;
	descripcion?: string;
	nombreArchivo: string;
	tipoDocumento: TipoDocumento;
	archivoBase64: string;
	tamanoBytes: number;
	fechaCreacion?: Date;
	fechaActualizacion?: Date;
	activo?: boolean;
	usuarioCreador?: string;
}

/**
 * Tipos de documentos PDF permitidos
 */
export enum TipoDocumento {
	CONTRATO = 'CONTRATO',
	COTIZACION = 'COTIZACION',
	FACTURA = 'FACTURA',
	RECIBO = 'RECIBO',
	ORDEN_COMPRA = 'ORDEN_COMPRA',
	MANUAL = 'MANUAL',
	PLANTILLA = 'PLANTILLA',
	OTRO = 'OTRO',
}

/**
 * Etiquetas amigables para tipos de documento
 */
export const TipoDocumentoLabels: Record<TipoDocumento, string> = {
	[TipoDocumento.CONTRATO]: 'Contrato',
	[TipoDocumento.COTIZACION]: 'Cotización',
	[TipoDocumento.FACTURA]: 'Factura',
	[TipoDocumento.RECIBO]: 'Recibo',
	[TipoDocumento.ORDEN_COMPRA]: 'Orden de Compra',
	[TipoDocumento.MANUAL]: 'Manual',
	[TipoDocumento.PLANTILLA]: 'Plantilla',
	[TipoDocumento.OTRO]: 'Otro',
};

/**
 * Iconos para tipos de documento
 */
export const TipoDocumentoIcons: Record<TipoDocumento, string> = {
	[TipoDocumento.CONTRATO]: 'description',
	[TipoDocumento.COTIZACION]: 'request_quote',
	[TipoDocumento.FACTURA]: 'receipt',
	[TipoDocumento.RECIBO]: 'receipt_long',
	[TipoDocumento.ORDEN_COMPRA]: 'shopping_cart',
	[TipoDocumento.MANUAL]: 'menu_book',
	[TipoDocumento.PLANTILLA]: 'article',
	[TipoDocumento.OTRO]: 'insert_drive_file',
};

/**
 * DTO para crear un nuevo documento PDF
 */
export interface CrearDocumentoPdfDto {
	nombre: string;
	descripcion?: string;
	nombreArchivo: string;
	tipoDocumento: TipoDocumento;
	archivoBase64: string;
	tamanoBytes: number;
}

/**
 * DTO para actualizar un documento PDF
 */
export interface ActualizarDocumentoPdfDto {
	id: number;
	nombre: string;
	descripcion?: string;
	tipoDocumento: TipoDocumento;
	archivoBase64?: string; // Opcional, solo si se cambia el archivo
	nombreArchivo?: string;
	tamanoBytes?: number;
}

/**
 * Respuesta de la API para operaciones de documentos PDF
 */
export interface DocumentoPdfResponse {
	success: boolean;
	message: string;
	data?: DocumentoPdf | DocumentoPdf[];
	totalRecords?: number;
}

/**
 * Parámetros para filtros de búsqueda
 */
export interface DocumentoPdfFiltros {
	busqueda?: string;
	tipoDocumento?: TipoDocumento;
	activo?: boolean;
	ordenarPor?: string;
	direccion?: 'asc' | 'desc';
	pagina?: number;
	limite?: number;
	fechaDesde?: Date;
	fechaHasta?: Date;
}

/**
 * Utilidades para formateo de tamaños de archivo
 */

/**
 * Convierte bytes a formato legible (KB, MB, GB)
 */
export function formatearTamano(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const decimales = 2;
	const tamaños = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return (
		parseFloat((bytes / Math.pow(k, i)).toFixed(decimales)) + ' ' + tamaños[i]
	);
}

/**
 * Valida que un archivo sea PDF
 */
export function esPDF(nombreArchivo: string): boolean {
	return nombreArchivo.toLowerCase().endsWith('.pdf');
}

/**
 * Extrae el nombre del archivo sin extensión
 */
export function obtenerNombreSinExtension(nombreArchivo: string): string {
	return nombreArchivo.replace(/\.pdf$/i, '');
}

/**
 * Convierte archivo a Base64
 */
export async function archivoABase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const result = reader.result as string;
			// Extraer solo la parte Base64 (sin el prefijo data:application/pdf;base64,)
			const base64 = result.split(',')[1];
			resolve(base64);
		};
		reader.onerror = (error) => reject(error);
	});
}

/**
 * Convierte Base64 a Blob para descargar
 */
export function base64ABlob(base64: string): Blob {
	const byteString = atob(base64);
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const uint8Array = new Uint8Array(arrayBuffer);

	for (let i = 0; i < byteString.length; i++) {
		uint8Array[i] = byteString.charCodeAt(i);
	}

	return new Blob([arrayBuffer], { type: 'application/pdf' });
}

/**
 * Descarga un documento PDF
 */
export function descargarPDF(documento: DocumentoPdf): void {
	const blob = base64ABlob(documento.archivoBase64);
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = documento.nombreArchivo;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}
