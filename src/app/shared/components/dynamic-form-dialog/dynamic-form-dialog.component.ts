/**
 * Componente de diálogo dinámico para formularios
 *
 * Permite crear formularios complejos mediante configuración JSON sin necesidad
 * de crear múltiples componentes de diálogo repetitivos. Soporta múltiples tipos
 * de campos con validaciones automáticas.
 *
 * @remarks
 * Este componente es standalone y puede ser usado directamente sin módulos.
 * Utiliza Angular Material para la UI y Reactive Forms para la validación.
 *
 * @example Uso básico
 * ```typescript
 * const config: DynamicFormConfig = {
 *   title: 'Crear Cliente',
 *   subtitle: 'Complete la información del cliente',
 *   fields: [
 *     { type: 'text', key: 'nombre', label: 'Nombre', icon: 'person', required: true },
 *     { type: 'email', key: 'email', label: 'Email', icon: 'email', required: true },
 *     { type: 'select', key: 'ciudad', label: 'Ciudad', icon: 'location_city', options: ['CDMX', 'Puebla'] }
 *   ],
 *   confirmButtonText: 'Guardar',
 *   cancelButtonText: 'Cancelar'
 * };
 *
 * const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
 *   data: config,
 *   width: calculateDialogWidth(config.fields.length)
 * });
 *
 * dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
 *   if (result.confirmed) {
 *     console.log('Datos:', result.data);
 *   }
 * });
 * ```
 *
 * @example Con opciones complejas en select
 * ```typescript
 * const config: DynamicFormConfig = {
 *   title: 'Seleccionar Usuario',
 *   fields: [{
 *     type: 'select',
 *     key: 'userId',
 *     label: 'Usuario',
 *     icon: 'person',
 *     options: [
 *       { label: 'Juan Pérez', value: 1 },
 *       { label: 'María García', value: 2 }
 *     ]
 *   }]
 * };
 * ```
 *
 * @public
 */

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
	DynamicFormConfig,
	DynamicFormField,
	DynamicFormResult,
} from './dynamic-form-dialog.types';

@Component({
	selector: 'app-dynamic-form-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './dynamic-form-dialog.component.html',
	styleUrl: './dynamic-form-dialog.component.scss',
})
export class DynamicFormDialogComponent implements OnInit {
	/**
	 * FormGroup dinámico construido a partir de la configuración
	 */
	form!: FormGroup;

	/**
	 * Configuración del formulario recibida vía MAT_DIALOG_DATA
	 */
	config: DynamicFormConfig;

	/**
	 * Texto del botón de confirmación
	 */
	confirmButtonText: string;

	/**
	 * Texto del botón de cancelación
	 */
	cancelButtonText: string;

	constructor(
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<DynamicFormDialogComponent>,
		@Inject(MAT_DIALOG_DATA) data: DynamicFormConfig,
	) {
		// Asignar configuración recibida
		this.config = data;

		// Asignar textos personalizados o usar valores por defecto
		this.confirmButtonText = data.confirmButtonText || 'Confirmar';
		this.cancelButtonText = data.cancelButtonText || 'Cancelar';
	}

	ngOnInit(): void {
		// Construir el formulario dinámico al inicializar el componente
		this.buildForm();
	}

	/**
	 * Construye el FormGroup dinámicamente basado en la configuración de campos
	 *
	 * @remarks
	 * Este método itera sobre todos los campos de la configuración y:
	 * 1. Crea un FormControl con su valor inicial (o null)
	 * 2. Aplica validadores según el tipo de campo y propiedades (required, min, max, email, etc.)
	 * 3. Deshabilita el control si está marcado como disabled en la configuración
	 *
	 * Los validadores se aplican dinámicamente según el tipo de campo:
	 * - text/textarea: required, minLength, maxLength
	 * - number: required, min, max
	 * - email: required, email pattern
	 * - select/date: required
	 *
	 * @private
	 */
	private buildForm(): void {
		const group: Record<string, unknown> = {};

		this.config.fields.forEach((field: DynamicFormField) => {
			// Array de validadores para este campo
			const validators: ValidatorFn[] = [];

			// Agregar validador required si está especificado
			if (field.required) {
				validators.push(Validators.required);
			}

			// Agregar validadores de longitud para text/textarea
			if (field.minLength && (field.type === 'text' || field.type === 'textarea')) {
				validators.push(Validators.minLength(field.minLength));
			}
			if (field.maxLength && (field.type === 'text' || field.type === 'textarea')) {
				validators.push(Validators.maxLength(field.maxLength));
			}

			// Agregar validadores numéricos para type='number'
			if (field.type === 'number') {
				if (field.min !== undefined) {
					validators.push(Validators.min(field.min));
				}
				if (field.max !== undefined) {
					validators.push(Validators.max(field.max));
				}
			}

			// Agregar validador de email si el tipo es email
			if (field.type === 'email') {
				validators.push(Validators.email);
			}

			// Crear el control con valor inicial y validadores
			const control = this.fb.control(
				{ value: field.value || null, disabled: field.disabled || false },
				validators,
			);

			group[field.key] = control;
		});

		// Construir el FormGroup final
		this.form = this.fb.group(group);
	}

	/**
	 * Obtiene el FormControl de un campo específico
	 * Útil para mostrar errores en el template
	 *
	 * @param key Clave del campo
	 * @returns FormControl o null si no existe
	 */
	getControl(key: string) {
		return this.form.get(key);
	}

	/**
	 * Obtiene el mensaje de error para un campo
	 *
	 * @param field Configuración del campo
	 * @returns Mensaje de error apropiado
	 */
	getErrorMessage(field: DynamicFormField): string {
		const control = this.getControl(field.key);

		if (!control || !control.errors) {
			return '';
		}

		if (control.hasError('required')) {
			return `${field.label} es requerido`;
		}

		if (control.hasError('email')) {
			return 'Ingrese un email válido';
		}

		if (control.hasError('minlength')) {
			const minLength = control.errors['minlength'].requiredLength;
			return `Mínimo ${minLength} caracteres`;
		}

		if (control.hasError('maxlength')) {
			const maxLength = control.errors['maxlength'].requiredLength;
			return `Máximo ${maxLength} caracteres`;
		}

		if (control.hasError('min')) {
			const min = control.errors['min'].min;
			return `El valor mínimo es ${min}`;
		}

		if (control.hasError('max')) {
			const max = control.errors['max'].max;
			return `El valor máximo es ${max}`;
		}

		return 'Campo inválido';
	}

	/**
	 * Type guard para determinar el tipo de opciones en un campo select
	 *
	 * @param options - Array de opciones que puede ser strings o objetos
	 * @returns true si las opciones son objetos con {label, value}, false si son strings
	 *
	 * @remarks
	 * Este type guard permite a TypeScript inferir el tipo correcto de las opciones
	 * en el template, evitando errores de compilación al acceder a properties.
	 *
	 * @public
	 */
	isComplexOptions(
		options: string[] | { label: string; value: string | number }[] | undefined,
	): options is { label: string; value: string | number }[] {
		if (!options || options.length === 0) {
			return false;
		}
		return typeof options[0] === 'object';
	}

	/**
	 * Maneja el evento de confirmación del formulario
	 *
	 * 1. Valida que el formulario sea válido
	 * 2. Obtiene los valores del formulario
	 * 3. Cierra el diálogo retornando un resultado tipado
	 */
	onConfirm(): void {
		// Marcar todos los campos como touched para mostrar errores
		this.form.markAllAsTouched();

		// Solo cerrar si el formulario es válido
		if (this.form.valid) {
			const result: DynamicFormResult = {
				confirmed: true,
				data: this.form.getRawValue(), // getRawValue incluye campos disabled
			};

			this.dialogRef.close(result);
		}
	}

	/**
	 * Maneja el evento de cancelación
	 * Cierra el diálogo sin retornar datos
	 */
	onCancel(): void {
		const result: DynamicFormResult = {
			confirmed: false,
		};

		this.dialogRef.close(result);
	}

	/**
	 * Obtiene el número de filas para un textarea
	 * Usa el valor especificado en la configuración o un valor por defecto
	 *
	 * @param field Configuración del campo
	 * @returns Número de filas
	 */
	getTextareaRows(field: DynamicFormField): number {
		return field.rows || 4;
	}

	/**
	 * Obtiene el icono apropiado para el título del diálogo
	 *
	 * @returns Nombre del icono de Material Icons
	 */
	getTitleIcon(): string {
		// Se puede personalizar según el título o agregar como configuración
		return 'edit_note';
	}
}
