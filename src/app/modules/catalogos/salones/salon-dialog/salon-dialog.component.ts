// biome-ignore-all lint/suspicious/noDebugger: reason

import { Component, Inject, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { Salon, CrearSalonDto, ActualizarSalonDto } from '../salon.model';
import { TipoEvento } from '../../../../core/models/tipo-evento.model';

export interface SalonDialogData {
	salon?: Salon;
	modo: 'crear' | 'editar';
	tiposEvento: TipoEvento[];
}

/**
 * 📝 Componente Modal para Crear/Editar Salones
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
	selector: 'app-salon-dialog',
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
		MatTooltipModule,
	],
	templateUrl: './salon-dialog.component.html',
	styleUrl: './salon-dialog.component.scss',
})
export class SalonDialogComponent implements OnInit {
	salonForm!: FormGroup;
	modo: 'crear' | 'editar';
	guardando = false;
	tiposEvento: TipoEvento[] = [];

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<SalonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SalonDialogData
	) {
		this.modo = data.modo;
		this.tiposEvento = data.tiposEvento || [];
		this.initializeForm();
	}

	ngOnInit(): void {
		if (this.data.salon && this.modo === 'editar') {
			this.salonForm.patchValue({
				nombre: this.data.salon.nombre,
				direccion: this.data.salon.direccion,
				capacidadDePersonas: this.data.salon.capacidadDePersonas,
				tipoEventoId: this.data.salon.tipoEvento.id,
				precioRenta: this.data.salon.precioRenta,
				telefonoContacto: this.data.salon.telefonoContacto || '',
			});
		}
	}

	/**
	 * 📝 Inicializa el formulario con validaciones
	 */
	private initializeForm(): void {
		this.salonForm = this.fb.group({
			nombre: [
				'',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
				],
			],
			direccion: [
				'',
				[
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(200),
				],
			],
			capacidadDePersonas: [
				0,
				[Validators.required, Validators.min(1), Validators.max(1000)],
			],
			tipoEventoId: ['', [Validators.required]],
			precioRenta: [0, [Validators.required, Validators.min(0)]],
			telefonoContacto: ['', [Validators.pattern(/^[0-9\-\s\+\(\)]+$/)]],
		});
	}

	/**
	 * 💾 Guarda los cambios
	 */
	onSave(): void {
		if (this.salonForm.valid && !this.guardando) {
			this.guardando = true;

			const formValue = this.salonForm.value;

			let result: CrearSalonDto | ActualizarSalonDto;

			if (this.modo === 'editar' && this.data.salon) {
				result = {
					id: this.data.salon.id,
					nombre: formValue.nombre.trim(),
					direccion: formValue.direccion.trim(),
					capacidadDePersonas: formValue.capacidadDePersonas,
					tipoEventoId: formValue.tipoEventoId,
					precioRenta: formValue.precioRenta,
					telefonoContacto: formValue.telefonoContacto
						? formValue.telefonoContacto.trim()
						: undefined,
				} as ActualizarSalonDto;
			} else {
				result = {
					nombre: formValue.nombre.trim(),
					direccion: formValue.direccion.trim(),
					capacidadDePersonas: formValue.capacidadDePersonas,
					tipoEventoId: formValue.tipoEventoId,
					precioRenta: formValue.precioRenta,
					telefonoContacto: formValue.telefonoContacto
						? formValue.telefonoContacto.trim()
						: undefined,
				} as CrearSalonDto;
			}

			// Simular delay de guardado para UX
			setTimeout(() => {
				this.dialogRef.close(result);
			}, 800);
		}
	}

	/**
	 * ❌ Cancela y cierra el modal
	 */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * 🔧 Getter para acceso fácil a los controles del formulario
	 */
	get f() {
		return this.salonForm.controls;
	}
}
