/**
 * Ejemplo de Uso Rápido del DynamicFormDialogComponent
 *
 * Copia y pega este código en cualquier componente para probar
 * el diálogo de formulario dinámico.
 */

import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormDialogComponent } from './dynamic-form-dialog.component';
import {
	DynamicFormConfig,
	DynamicFormResult,
	calculateDialogWidth,
} from './dynamic-form-dialog.types';

@Component({
	selector: 'app-test-dynamic-form',
	standalone: true,
	imports: [JsonPipe],
	template: `
		<div style="padding: 24px;">
			<h2>Test DynamicFormDialogComponent</h2>

			<button mat-raised-button color="primary" (click)="testSimpleForm()">
				Test 1: Formulario Simple
			</button>

			<button mat-raised-button color="accent" (click)="testComplexForm()">
				Test 2: Formulario Complejo
			</button>

			<div *ngIf="lastResult" style="margin-top: 20px; padding: 16px; background: #f0f0f0;">
				<h3>Último Resultado:</h3>
				<pre>{{ lastResult | json }}</pre>
			</div>
		</div>
	`,
})
export class TestDynamicFormComponent {
	private dialog = inject(MatDialog);
	lastResult: unknown = null;

	/**
	 * Test 1: Formulario simple con 2 campos
	 */
	testSimpleForm(): void {
		const config: DynamicFormConfig = {
			title: 'Test: Formulario Simple',
			subtitle: 'Prueba con 2 campos básicos',
			fields: [
				{
					type: 'text',
					key: 'nombre',
					label: 'Nombre',
					placeholder: 'Ingrese su nombre',
					required: true,
					minLength: 3,
				},
				{
					type: 'email',
					key: 'email',
					label: 'Email',
					required: true,
				},
			],
			confirmButtonText: 'Guardar',
			cancelButtonText: 'Cancelar',
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: calculateDialogWidth(config.fields.length),
		});

		dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
			console.log('Resultado Test 1:', result);
			this.lastResult = result;
		});
	}

	/**
	 * Test 2: Formulario complejo con todos los tipos de campos
	 */
	testComplexForm(): void {
		const config: DynamicFormConfig = {
			title: 'Test: Formulario Completo',
			subtitle: 'Prueba con todos los tipos de campos disponibles',
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
					type: 'email',
					key: 'emailContacto',
					label: 'Email de Contacto',
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
			confirmButtonText: 'Crear Evento',
			cancelButtonText: 'Cancelar',
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			data: config,
			width: calculateDialogWidth(config.fields.length),
			maxHeight: '90vh',
		});

		dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
			console.log('Resultado Test 2:', result);
			this.lastResult = result;
		});
	}
}
