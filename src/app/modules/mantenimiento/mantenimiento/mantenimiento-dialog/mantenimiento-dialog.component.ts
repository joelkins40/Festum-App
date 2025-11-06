import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Mantenimiento } from '../mantenimiento.component';

@Component({
	selector: 'app-mantenimiento-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
	],
	templateUrl: './mantenimiento-dialog.component.html',
	styleUrls: ['./mantenimiento-dialog.component.scss'],
})
export class MantenimientoDialogComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<MantenimientoDialogComponent>);
	data = inject<Mantenimiento | null>(MAT_DIALOG_DATA);

	mantenimientoForm: FormGroup;
	isEditMode: boolean;

	estatusOptions: Array<'Pendiente' | 'En proceso' | 'Completado'> = [
		'Pendiente',
		'En proceso',
		'Completado',
	];

	// Lista de técnicos disponibles (mock)
	tecnicosDisponibles: string[] = [
		'Carlos Ramírez',
		'Ana Martínez',
		'Luis González',
		'María López',
		'Pedro Sánchez',
		'Laura Torres',
	];

	constructor() {
		this.isEditMode = !!this.data;
		this.mantenimientoForm = this.initializeForm();
	}

	private initializeForm(): FormGroup {
		return this.fb.group({
			id: [this.data?.id || null],
			equipo: [
				this.data?.equipo || '',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(200),
				],
			],
			descripcion: [
				this.data?.descripcion || '',
				[
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(500),
				],
			],
			fechaReporte: [
				this.data?.fechaReporte || new Date(),
				[Validators.required],
			],
			tecnicoAsignado: [
				this.data?.tecnicoAsignado || '',
				[Validators.required],
			],
			estatus: [this.data?.estatus || 'Pendiente', [Validators.required]],
		});
	}

	onSave(): void {
		if (this.mantenimientoForm.valid) {
			this.dialogRef.close(this.mantenimientoForm.value);
		} else {
			// Mark all fields as touched to show validation errors
			Object.keys(this.mantenimientoForm.controls).forEach((key) => {
				this.mantenimientoForm.get(key)?.markAsTouched();
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	// Getters for form controls
	get equipo() {
		return this.mantenimientoForm.get('equipo');
	}

	get descripcion() {
		return this.mantenimientoForm.get('descripcion');
	}

	get fechaReporte() {
		return this.mantenimientoForm.get('fechaReporte');
	}

	get tecnicoAsignado() {
		return this.mantenimientoForm.get('tecnicoAsignado');
	}

	get estatus() {
		return this.mantenimientoForm.get('estatus');
	}
}
