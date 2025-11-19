/**
 * EJEMPLO DE USO: DynamicFormDialogComponent
 *
 * Este archivo muestra cómo utilizar el componente DynamicFormDialogComponent
 * en diferentes escenarios dentro de tu aplicación Angular.
 *
 * NOTA: Este archivo es solo de referencia y documentación.
 * No debe importarse en la aplicación real.
 */

import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormDialogComponent } from './dynamic-form-dialog.component';
import {
	DynamicFormConfig,
	DynamicFormResult,
	calculateDialogWidth,
} from './dynamic-form-dialog.types';

/**
 * ====================================================================
 * EJEMPLO 1: Formulario Simple (1-2 campos)
 * ====================================================================
 */
export class Example1SimpleForm {
	private dialog = inject(MatDialog);

	openSimpleDialog(): void {
		const config: DynamicFormConfig = {
			title: 'Crear Categoría',
			subtitle: 'Ingrese el nombre de la nueva categoría',
			fields: [
				{
					type: 'text',
					key: 'nombre',
					label: 'Nombre de la categoría',
					placeholder: 'Ej: Bodas',
					required: true,
					minLength: 3,
					maxLength: 50,
				},
			],
			confirmButtonText: 'Crear',
			cancelButtonText: 'Cancelar',
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: calculateDialogWidth(config.fields.length), // '400px' automáticamente
			disableClose: false, // Permite cerrar haciendo clic fuera
		});

		dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
			if (result?.confirmed) {
				console.log('Categoría creada:', result.data);
				// result.data = { nombre: 'Bodas' }
			}
		});
	}
}

/**
 * ====================================================================
 * EJEMPLO 2: Formulario Mediano (3-4 campos)
 * ====================================================================
 */
export class Example2MediumForm {
	private dialog = inject(MatDialog);

	openClientDialog(): void {
		const config: DynamicFormConfig = {
			title: 'Crear Cliente',
			fields: [
				{
					type: 'text',
					key: 'nombre',
					label: 'Nombre completo',
					required: true,
				},
				{
					type: 'email',
					key: 'email',
					label: 'Correo electrónico',
					placeholder: 'ejemplo@correo.com',
					required: true,
				},
				{
					type: 'number',
					key: 'edad',
					label: 'Edad',
					min: 18,
					max: 100,
				},
				{
					type: 'select',
					key: 'ciudad',
					label: 'Ciudad',
					required: true,
					options: ['CDMX', 'Guadalajara', 'Monterrey', 'Puebla', 'Querétaro'],
				},
			],
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: calculateDialogWidth(config.fields.length), // '600px' automáticamente
		});

		dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
			if (result?.confirmed) {
				console.log('Cliente creado:', result.data);
				// result.data = {
				//   nombre: 'Juan Pérez',
				//   email: 'juan@correo.com',
				//   edad: 30,
				//   ciudad: 'CDMX'
				// }
			}
		});
	}
}

/**
 * ====================================================================
 * EJEMPLO 3: Formulario Grande (5+ campos)
 * ====================================================================
 */
export class Example3LargeForm {
	private dialog = inject(MatDialog);

	openEventDialog(): void {
		const config: DynamicFormConfig = {
			title: 'Crear Evento',
			subtitle: 'Complete la información del nuevo evento',
			fields: [
				{
					type: 'text',
					key: 'nombreEvento',
					label: 'Nombre del Evento',
					required: true,
				},
				{
					type: 'select',
					key: 'tipoEvento',
					label: 'Tipo de Evento',
					required: true,
					options: [
						{ label: 'Boda', value: 'boda' },
						{ label: 'XV Años', value: 'xv_anios' },
						{ label: 'Corporativo', value: 'corporativo' },
						{ label: 'Otro', value: 'otro' },
					],
				},
				{
					type: 'date',
					key: 'fechaEvento',
					label: 'Fecha del Evento',
					required: true,
				},
				{
					type: 'number',
					key: 'numeroInvitados',
					label: 'Número de Invitados',
					min: 1,
					max: 500,
					required: true,
				},
				{
					type: 'select',
					key: 'salon',
					label: 'Salón',
					options: ['Salón Jardín', 'Salón Principal', 'Terraza'],
				},
				{
					type: 'textarea',
					key: 'observaciones',
					label: 'Observaciones',
					placeholder: 'Detalles adicionales del evento...',
					rows: 4,
					maxLength: 500,
				},
			],
			confirmButtonText: 'Guardar Evento',
			cancelButtonText: 'Cancelar',
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: calculateDialogWidth(config.fields.length), // '800px' automáticamente
			maxHeight: '90vh', // Limitar altura para formularios grandes
		});

		dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
			if (result?.confirmed) {
				console.log('Evento creado:', result.data);
				// Aquí llamarías a tu servicio para guardar en el backend
				// this.eventosService.create(result.data).subscribe(...)
			}
		});
	}
}

/**
 * ====================================================================
 * EJEMPLO 4: Con Tipado Estricto (Recomendado para TypeScript)
 * ====================================================================
 */

// Definir la interfaz del formulario
interface EventoForm {
	nombreEvento: string;
	tipoEvento: string;
	fechaEvento: string;
	numeroInvitados: number;
	observaciones?: string;
}

export class Example4TypedForm {
	private dialog = inject(MatDialog);

	openTypedDialog(): void {
		const config: DynamicFormConfig = {
			title: 'Crear Evento',
			fields: [
				{ type: 'text', key: 'nombreEvento', label: 'Nombre', required: true },
				{
					type: 'select',
					key: 'tipoEvento',
					label: 'Tipo',
					required: true,
					options: ['Boda', 'XV Años'],
				},
				{ type: 'date', key: 'fechaEvento', label: 'Fecha', required: true },
				{
					type: 'number',
					key: 'numeroInvitados',
					label: 'Invitados',
					required: true,
				},
				{ type: 'textarea', key: 'observaciones', label: 'Observaciones' },
			],
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: '700px',
		});

		// Usando el tipado genérico
		dialogRef
			.afterClosed()
			.subscribe((result: DynamicFormResult<EventoForm>) => {
				if (result?.confirmed && result.data) {
					// Ahora TypeScript conoce la estructura de result.data
					const evento: EventoForm = result.data;
					console.log(`Evento: ${evento.nombreEvento}`);
					console.log(`Tipo: ${evento.tipoEvento}`);
					console.log(`Fecha: ${evento.fechaEvento}`);
					console.log(`Invitados: ${evento.numeroInvitados}`);

					// Guardar en el backend
					// this.eventosService.create(evento).subscribe(...)
				}
			});
	}
}

/**
 * ====================================================================
 * EJEMPLO 5: Editar Registro Existente (con valores iniciales)
 * ====================================================================
 */
export class Example5EditForm {
	private dialog = inject(MatDialog);

	editClient(clientId: number): void {
		// Supongamos que obtuvimos estos datos del backend
		const clienteExistente = {
			nombre: 'María García',
			email: 'maria@correo.com',
			edad: 28,
			ciudad: 'Puebla',
		};

		const config: DynamicFormConfig = {
			title: 'Editar Cliente',
			subtitle: `Modificando información de ${clienteExistente.nombre}`,
			fields: [
				{
					type: 'text',
					key: 'nombre',
					label: 'Nombre completo',
					value: clienteExistente.nombre, // Valor inicial
					required: true,
				},
				{
					type: 'email',
					key: 'email',
					label: 'Correo electrónico',
					value: clienteExistente.email,
					required: true,
				},
				{
					type: 'number',
					key: 'edad',
					label: 'Edad',
					value: clienteExistente.edad,
					min: 18,
				},
				{
					type: 'select',
					key: 'ciudad',
					label: 'Ciudad',
					value: clienteExistente.ciudad,
					options: ['CDMX', 'Guadalajara', 'Monterrey', 'Puebla'],
				},
			],
			confirmButtonText: 'Actualizar',
			cancelButtonText: 'Cancelar',
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: '600px',
		});

		dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
			if (result?.confirmed) {
				console.log('Cliente actualizado:', result.data);
				// this.clientesService.update(clientId, result.data).subscribe(...)
			}
		});
	}
}

/**
 * ====================================================================
 * EJEMPLO 6: Tamaño Personalizado del Diálogo
 * ====================================================================
 */
export class Example6CustomSize {
	private dialog = inject(MatDialog);

	openCustomSizeDialog(): void {
		const config: DynamicFormConfig = {
			title: 'Formulario Personalizado',
			fields: [
				{ type: 'text', key: 'campo1', label: 'Campo 1', required: true },
				{ type: 'text', key: 'campo2', label: 'Campo 2' },
			],
			// Especificar tamaño personalizado en la configuración
			width: '500px',
			maxHeight: '600px',
		};

		this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: config.width, // Usar el ancho de la configuración
			maxHeight: config.maxHeight,
		});
	}
}

/**
 * ====================================================================
 * EJEMPLO 7: Manejo de Errores y Validación
 * ====================================================================
 */
export class Example7ValidationHandling {
	private dialog = inject(MatDialog);

	openValidationDialog(): void {
		const config: DynamicFormConfig = {
			title: 'Formulario con Validaciones',
			fields: [
				{
					type: 'text',
					key: 'username',
					label: 'Nombre de usuario',
					required: true,
					minLength: 5,
					maxLength: 20,
					placeholder: 'Mínimo 5 caracteres',
				},
				{
					type: 'email',
					key: 'email',
					label: 'Email',
					required: true,
				},
				{
					type: 'number',
					key: 'edad',
					label: 'Edad',
					required: true,
					min: 18,
					max: 65,
				},
				{
					type: 'textarea',
					key: 'descripcion',
					label: 'Descripción',
					maxLength: 200,
					placeholder: 'Máximo 200 caracteres',
				},
			],
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: '650px',
			disableClose: true, // Evitar cerrar sin confirmar/cancelar
		});

		dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
			if (result?.confirmed) {
				console.log('✅ Formulario válido:', result.data);
			} else {
				console.log('❌ Formulario cancelado');
			}
		});
	}
}

/**
 * ====================================================================
 * TIPS Y MEJORES PRÁCTICAS
 * ====================================================================
 *
 * 1. CALCULAR TAMAÑO AUTOMÁTICAMENTE:
 *    Usa `calculateDialogWidth(config.fields.length)` para tamaños dinámicos
 *
 * 2. VALIDACIONES:
 *    - `required`: Campo obligatorio
 *    - `minLength/maxLength`: Para text/textarea
 *    - `min/max`: Para números
 *    - `email`: Validación automática de email
 *
 * 3. VALORES INICIALES:
 *    Usa la propiedad `value` en cada field para edición
 *
 * 4. OPCIONES DE SELECT:
 *    Pueden ser strings simples o objetos {label, value}
 *
 * 5. TIPADO ESTRICTO:
 *    Define interfaces para tus formularios y usa el generic:
 *    `DynamicFormResult<TuInterfaz>`
 *
 * 6. RESPONSIVIDAD:
 *    El componente es responsive automáticamente
 *
 * 7. PERSONALIZACIÓN:
 *    - `confirmButtonText` / `cancelButtonText`: Textos personalizados
 *    - `subtitle`: Descripción adicional
 *    - `placeholder`: Ayuda contextual
 *
 * 8. ACCESIBILIDAD:
 *    Todos los campos tienen labels y validaciones apropiadas
 *
 * 9. UX:
 *    - El botón Confirmar se deshabilita si el form es inválido
 *    - Los errores se muestran solo cuando el campo fue touched
 *    - Iconos visuales para requeridos y tipos de campo
 */
