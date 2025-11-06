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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { Rol } from '../roles-permisos.component';

export interface RolDialogData {
	rol?: Rol;
	modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Roles
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
	selector: 'app-rol-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
	],
	templateUrl: './rol-dialog.component.html',
	styleUrl: './rol-dialog.component.scss',
})
export class RolDialogComponent implements OnInit {
	rolForm!: FormGroup;
	modo: 'crear' | 'editar';
	guardando = false;

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<RolDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: RolDialogData,
	) {
		this.modo = data.modo;
		this.initializeForm();
	}

	ngOnInit(): void {
		if (this.data.rol && this.modo === 'editar') {
			this.rolForm.patchValue({
				nombreRol: this.data.rol.nombreRol,
				descripcion: this.data.rol.descripcion,
			});
		}
	}

	/**
	 * 📝 Inicializa el formulario con validaciones
	 */
	private initializeForm(): void {
		this.rolForm = this.fb.group({
			nombreRol: [
				'',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(50),
					Validators.pattern(/^[a-zA-ZÁáÉéÍíÓóÚúÑñ\s]+$/), // Solo letras y espacios
				],
			],
			descripcion: [
				'',
				[
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(200),
				],
			],
		});
	}

	/**
	 * 💾 Guarda los cambios
	 */
	onSave(): void {
		if (this.rolForm.valid && !this.guardando) {
			this.guardando = true;

			const formValue = this.rolForm.value;
			const result = {
				nombreRol: formValue.nombreRol.trim(),
				descripcion: formValue.descripcion.trim(),
				...(this.modo === 'editar' && this.data.rol
					? {
							id: this.data.rol.id,
							numeroDeUsuariosAsignados:
								this.data.rol.numeroDeUsuariosAsignados,
							permisos: this.data.rol.permisos,
						}
					: {}),
			};

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
		return this.rolForm.controls;
	}
}
