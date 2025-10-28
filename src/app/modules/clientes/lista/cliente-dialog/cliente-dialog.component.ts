import { Component, OnInit, inject } from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

import { Cliente } from '../cliente.model';

export interface ClienteDialogData {
	cliente?: Cliente;
	modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Clientes
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
	selector: 'app-cliente-dialog',
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
		MatCheckboxModule,
	],
	templateUrl: './cliente-dialog.component.html',
	styleUrl: './cliente-dialog.component.scss',
})
export class ClienteDialogComponent implements OnInit {
	clienteForm!: FormGroup;
	modo: 'crear' | 'editar';
	guardando = false;
	data: ClienteDialogData;

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<ClienteDialogComponent>,
	) {
		this.data = inject(MAT_DIALOG_DATA);
		this.modo = this.data.modo;
		this.initializeForm();
	}

	ngOnInit(): void {
		if (this.modo === 'editar' && this.data.cliente) {
			this.cargarDatos();
		}
	}

	/**
	 * 🔧 Inicializar formulario reactivo con validaciones
	 */
	private initializeForm(): void {
		this.clienteForm = this.fb.group({
			nombre: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(100),
					Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
				],
			],
			direccion: this.fb.group({
				fullAddress: ['', [Validators.required, Validators.maxLength(300)]],
				street: ['', [Validators.required, Validators.maxLength(100)]],
				number: ['', [Validators.required, Validators.maxLength(20)]],
				neighborhood: ['', [Validators.required, Validators.maxLength(100)]],
				city: ['', [Validators.required, Validators.maxLength(100)]],
				state: ['', [Validators.required, Validators.maxLength(100)]],
				country: ['México', [Validators.required, Validators.maxLength(100)]],
				postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
				lat: [
					0,
					[Validators.required, Validators.min(-90), Validators.max(90)],
				],
				lng: [
					0,
					[Validators.required, Validators.min(-180), Validators.max(180)],
				],
			}),
			clientePreferente: [false, []],
		});
	}

	/**
	 * 📝 Cargar datos para edición
	 */
	private cargarDatos(): void {
		if (this.data.cliente) {
			this.clienteForm.patchValue({
				nombre: this.data.cliente.nombre,
				direccion: this.data.cliente.direccion,
				clientePreferente: this.data.cliente.clientePreferente,
			});
		}
	}

	/**
	 * 💾 Guardar cliente
	 */
	guardar(): void {
		if (this.clienteForm.invalid) {
			this.marcarCamposComoTocados();
			return;
		}

		this.guardando = true;

		// Simular tiempo de procesamiento
		setTimeout(() => {
			const formValue = this.clienteForm.value;
			this.dialogRef.close(formValue);
		}, 300);
	}

	/**
	 * ❌ Cancelar y cerrar diálogo
	 */
	cancelar(): void {
		this.dialogRef.close();
	}

	/**
	 * 🔍 Marcar todos los campos como tocados para mostrar errores
	 */
	private marcarCamposComoTocados(): void {
		Object.keys(this.clienteForm.controls).forEach((key) => {
			const control = this.clienteForm.get(key);
			if (control) {
				control.markAsTouched();
			}
		});
	}

	// ===== GETTERS PARA VALIDACIONES EN TEMPLATE =====

	get nombre() {
		return this.clienteForm.get('nombre');
	}

	get direccion() {
		return this.clienteForm.get('direccion');
	}

	get direccionFullAddress() {
		return this.clienteForm.get('direccion.fullAddress');
	}

	get direccionStreet() {
		return this.clienteForm.get('direccion.street');
	}

	get direccionNumber() {
		return this.clienteForm.get('direccion.number');
	}

	get direccionNeighborhood() {
		return this.clienteForm.get('direccion.neighborhood');
	}

	get direccionCity() {
		return this.clienteForm.get('direccion.city');
	}

	get direccionState() {
		return this.clienteForm.get('direccion.state');
	}

	get direccionCountry() {
		return this.clienteForm.get('direccion.country');
	}

	get direccionPostalCode() {
		return this.clienteForm.get('direccion.postalCode');
	}

	get direccionLat() {
		return this.clienteForm.get('direccion.lat');
	}

	get direccionLng() {
		return this.clienteForm.get('direccion.lng');
	}

	get clientePreferente() {
		return this.clienteForm.get('clientePreferente');
	}

	get esFormularioValido(): boolean {
		console.log({
			errorForm: this.clienteForm.errors,
			esValido: this.clienteForm.valid,
			valoresForm: this.clienteForm.value,
		});
		return this.clienteForm.valid;
	}

	get tituloModal(): string {
		return this.modo === 'crear' ? 'Nuevo Cliente' : 'Editar Cliente';
	}

	get iconoModal(): string {
		return this.modo === 'crear' ? 'person_add' : 'edit';
	}

	get textoBotonGuardar(): string {
		if (this.guardando) {
			return 'Guardando...';
		}
		return this.modo === 'crear' ? 'Crear Cliente' : 'Actualizar Cliente';
	}
}
