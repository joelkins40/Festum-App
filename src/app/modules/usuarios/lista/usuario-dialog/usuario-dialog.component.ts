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
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';

import { Usuario } from '../lista.component';

export interface UsuarioDialogData {
	usuario?: Usuario;
	modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Usuarios Administrativos
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
	selector: 'app-usuario-dialog',
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
		MatSelectModule,
		MatSlideToggleModule,
	],
	templateUrl: './usuario-dialog.component.html',
	styleUrl: './usuario-dialog.component.scss',
})
export class UsuarioDialogComponent implements OnInit {
	usuarioForm!: FormGroup;
	modo: 'crear' | 'editar';
	guardando = false;

	// Opciones de roles disponibles
	rolesDisponibles = ['Administrador', 'Supervisor', 'Invitado'];

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<UsuarioDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData,
	) {
		this.modo = data.modo;
		this.initializeForm();
	}

	ngOnInit(): void {
		if (this.data.usuario && this.modo === 'editar') {
			this.usuarioForm.patchValue({
				nombreCompleto: this.data.usuario.nombre,
				email: this.data.usuario.correo,
				telefono: this.getRandomPhone(), // En producción vendría del usuario
				rol: this.data.usuario.rol,
				activo: this.data.usuario.estado === 'Activo',
			});
		}
	}

	/**
	 * 📝 Inicializa el formulario con validaciones
	 */
	private initializeForm(): void {
		this.usuarioForm = this.fb.group({
			nombreCompleto: [
				'',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
					Validators.pattern(/^[a-zA-ZÁáÉéÍíÓóÚúÑñ\s]+$/), // Solo letras y espacios
				],
			],
			email: [
				'',
				[
					Validators.required,
					Validators.email,
					Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
				],
			],
			telefono: [
				'',
				[
					Validators.required,
					Validators.pattern(/^[0-9]{10}$/), // 10 dígitos
				],
			],
			rol: ['', Validators.required],
			activo: [true], // Por defecto activo
		});
	}

	/**
	 * 💾 Guarda los cambios
	 */
	onSave(): void {
		if (this.usuarioForm.valid && !this.guardando) {
			this.guardando = true;

			const formValue = this.usuarioForm.value;
			const result = {
				nombreCompleto: formValue.nombreCompleto.trim(),
				email: formValue.email.trim().toLowerCase(),
				telefono: formValue.telefono.trim(),
				rol: formValue.rol,
				activo: formValue.activo,
				...(this.modo === 'editar' && this.data.usuario
					? { id: this.data.usuario.id }
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
		return this.usuarioForm.controls;
	}

	/**
	 * 📞 Genera un teléfono aleatorio para demo (temporal)
	 */
	private getRandomPhone(): string {
		return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
	}
}
