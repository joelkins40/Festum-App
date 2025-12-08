import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	MatDialogModule,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import {
	Cotizacion,
	CotizacionEstado,
} from '../../../../core/models/cotizacion.model';
import { ButtonComponent } from "../../../../shared/components/button";

export interface CotizacionDialogData {
	cotizacion?: Cotizacion;
	mode: 'create' | 'edit';
}

@Component({
	selector: 'app-cotizaciones-listado-dialog',
	standalone: true,
	imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ButtonComponent
],
	templateUrl: './cotizaciones-listado-dialog.component.html',
	styleUrl: './cotizaciones-listado-dialog.component.scss',
})
export class CotizacionesListadoDialogComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<CotizacionesListadoDialogComponent>);
	public data = inject<CotizacionDialogData>(MAT_DIALOG_DATA);

	cotizacionForm: FormGroup;
	estados = Object.values(CotizacionEstado);
	isEditMode: boolean;

	constructor() {
		this.isEditMode = this.data.mode === 'edit';

		this.cotizacionForm = this.fb.group({
			cliente: [
				this.data.cotizacion?.cliente || '',
				[Validators.required, Validators.minLength(3)],
			],
			id: [
				this.data.cotizacion?.id || null,
				[Validators.required, Validators.min(1)],
			],
			total: [
				this.data.cotizacion?.total || null,
				[Validators.required, Validators.min(0)],
			],
			fecha: [
				this.data.cotizacion?.fecha
					? new Date(this.data.cotizacion.fecha)
					: new Date(),
				Validators.required,
			],
			estado: [
				this.data.cotizacion?.estado || CotizacionEstado.PENDIENTE,
				Validators.required,
			],
		});

		if (this.isEditMode && this.data.cotizacion) {
			this.cotizacionForm.patchValue({
				...this.data.cotizacion,
				fecha: new Date(this.data.cotizacion.fecha),
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSubmit(): void {
		if (this.cotizacionForm.valid) {
			const formValue = this.cotizacionForm.value;
			const cotizacion: Cotizacion = {
				...formValue,
				fecha:
					formValue.fecha instanceof Date
						? formValue.fecha
						: new Date(formValue.fecha),
			};

			this.dialogRef.close(cotizacion);
		} else {
			Object.keys(this.cotizacionForm.controls).forEach((key) => {
				const control = this.cotizacionForm.get(key);
				if (control?.invalid) {
					control.markAsTouched();
				}
			});
		}
	}

	getErrorMessage(fieldName: string): string {
		const control = this.cotizacionForm.get(fieldName);

		if (control?.hasError('required')) {
			return 'Este campo es requerido';
		}

		if (control?.hasError('minlength')) {
			const minLength = control.errors?.['minlength'].requiredLength;
			return `Mínimo ${minLength} caracteres`;
		}

		if (control?.hasError('min')) {
			return 'El valor debe ser mayor a 0';
		}

		return '';
	}

	get buttonText(): string {
		return this.isEditMode ? 'Actualizar Cotización' : 'Crear Cotización';
	}

	get dialogTitle(): string {
		return this.isEditMode ? 'Editar Cotización' : 'Nueva Cotización';
	}
}
