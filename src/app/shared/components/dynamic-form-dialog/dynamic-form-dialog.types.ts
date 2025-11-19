/**
 * Interfaces y tipos para el componente DynamicFormDialogComponent
 *
 * Este archivo contiene las definiciones de tipos necesarias para
 * configurar y usar el diálogo de formulario dinámico.
 */

/**
 * Tipos de campos soportados por el formulario dinámico
 */
export type FieldType =
	| 'text'
	| 'number'
	| 'select'
	| 'textarea'
	| 'email'
	| 'date';

/**
 * Configuración de un campo individual del formulario
 */
export interface DynamicFormField {
	/**
	 * Tipo de campo a renderizar
	 */
	type: FieldType;

	/**
	 * Clave única que se usará como nombre del control en el formulario
	 * También será la clave en el objeto de resultado
	 */
	key: string;

	/**
	 * Etiqueta visible para el usuario
	 */
	label: string;

	/**
	 * Valor inicial del campo (opcional)
	 */
	value?: unknown;

	/**
	 * Placeholder para el input (opcional)
	 */
	placeholder?: string;

	/**
	 * Indica si el campo es requerido
	 * @default false
	 */
	required?: boolean;

	/**
	 * Opciones para campos de tipo 'select'
	 * Puede ser un array de strings o un array de objetos {label, value}
	 */
	options?: string[] | { label: string; value: string | number }[];

	/**
	 * Número mínimo (para type='number')
	 */
	min?: number;

	/**
	 * Número máximo (para type='number')
	 */
	max?: number;

	/**
	 * Longitud mínima (para type='text' o 'textarea')
	 */
	minLength?: number;

	/**
	 * Longitud máxima (para type='text' o 'textarea')
	 */
	maxLength?: number;

	/**
	 * Número de filas para textarea
	 * @default 4
	 */
	rows?: number;

	/**
	 * Indica si el campo está deshabilitado
	 * @default false
	 */
	disabled?: boolean;
}

/**
 * Configuración completa del formulario dinámico
 */
export interface DynamicFormConfig {
	/**
	 * Título del diálogo
	 */
	title: string;

	/**
	 * Subtítulo o descripción opcional del diálogo
	 */
	subtitle?: string;

	/**
	 * Array de campos que conforman el formulario
	 */
	fields: DynamicFormField[];

	/**
	 * Texto personalizado para el botón de confirmar
	 * @default "Confirmar"
	 */
	confirmButtonText?: string;

	/**
	 * Texto personalizado para el botón de cancelar
	 * @default "Cancelar"
	 */
	cancelButtonText?: string;

	/**
	 * Ancho del diálogo (CSS width)
	 * Si no se especifica, se calculará automáticamente según el número de campos
	 */
	width?: string;

	/**
	 * Alto máximo del diálogo (CSS max-height)
	 */
	maxHeight?: string;
}

/**
 * Resultado devuelto al cerrar el diálogo
 *
 * TODO: En una versión futura, esto podría ser un generic <T>
 * para tener tipado estricto según la configuración del formulario.
 *
 * Ejemplo de uso futuro:
 * ```typescript
 * interface ClienteForm {
 *   nombre: string;
 *   edad: number;
 *   ciudad: string;
 * }
 *
 * dialogRef.afterClosed().subscribe((result: DynamicFormResult<ClienteForm>) => {
 *   if (result.confirmed) {
 *     console.log(result.data.nombre); // Tipado!
 *   }
 * });
 * ```
 */
export interface DynamicFormResult<T = Record<string, string>> {
	/**
	 * Indica si el usuario confirmó el formulario
	 * true = confirmó, false = canceló
	 */
	confirmed: boolean;

	/**
	 * Datos del formulario si fue confirmado
	 * Cada key corresponde al 'key' definido en DynamicFormField
	 */
	data?: T;
}

/**
 * Tamaños predefinidos para el diálogo
 */
export enum DialogSize {
	Small = '400px',
	Medium = '600px',
	Large = '800px',
	ExtraLarge = '1000px',
}

/**
 * Helper para calcular el tamaño del diálogo según el número de campos
 *
 * @param fieldCount Número de campos en el formulario
 * @returns Ancho en píxeles para el diálogo
 */
export function calculateDialogWidth(fieldCount: number): string {
	if (fieldCount <= 1) {
		return DialogSize.Small;
	} else if (fieldCount <= 4) {
		return DialogSize.Medium;
	} else if (fieldCount <= 8) {
		return DialogSize.Large;
	} else {
		return DialogSize.ExtraLarge;
	}
}
