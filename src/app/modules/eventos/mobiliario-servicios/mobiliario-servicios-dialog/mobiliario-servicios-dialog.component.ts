import { Component, signal, inject, computed } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MobiliarioServicio } from '../mobiliario-servicios.component';
import { ButtonComponent } from "../../../../shared/components/button";

@Component({
	selector: 'app-mobiliario-servicios-dialog',
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
    ButtonComponent
],
	templateUrl: './mobiliario-servicios-dialog.component.html',
	styleUrl: './mobiliario-servicios-dialog.component.scss',
})
export class MobiliarioServiciosDialogComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<MobiliarioServiciosDialogComponent>);
	private data = inject<MobiliarioServicio | null>(MAT_DIALOG_DATA);

	itemForm: FormGroup;
	isEditMode = signal<boolean>(false);

	readonly tipoOptions = [
		{ value: 'Mobiliario', label: 'Mobiliario', icon: 'chair' },
		{ value: 'Servicio', label: 'Servicio', icon: 'room_service' },
	];

	readonly estadoOptions = [
		{ value: 'Disponible', label: 'Disponible', icon: 'check_circle' },
		{ value: 'Reservado', label: 'Reservado', icon: 'schedule' },
		{ value: 'Entregado', label: 'Entregado', icon: 'local_shipping' },
	];

	// Computed para el subtotal calculado
	subtotalCalculado = computed(() => {
		const cantidad = this.itemForm.get('cantidad')?.value || 0;
		const precio = this.itemForm.get('precioUnitario')?.value || 0;
		return cantidad * precio;
	});

	constructor() {
		this.isEditMode.set(!!this.data);

		this.itemForm = this.fb.group({
			tipo: [this.data?.tipo || 'Mobiliario', [Validators.required]],
			nombre: [
				this.data?.nombre || '',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
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
			cantidad: [
				this.data?.cantidad || 1,
				[Validators.required, Validators.min(1), Validators.max(10000)],
			],
			precioUnitario: [
				this.data?.precioUnitario || 0,
				[Validators.required, Validators.min(0.01)],
			],
			estado: [this.data?.estado || 'Disponible', [Validators.required]],
		});

		// Actualizar subtotal cuando cambien cantidad o precio
		this.itemForm.get('cantidad')?.valueChanges.subscribe(() => {
			this.subtotalCalculado();
		});
		this.itemForm.get('precioUnitario')?.valueChanges.subscribe(() => {
			this.subtotalCalculado();
		});
	}

	onSave(): void {
		if (this.itemForm.valid) {
			const formValue = this.itemForm.value;
			const result: MobiliarioServicio = {
				id: this.data?.id || 0,
				tipo: formValue.tipo,
				nombre: formValue.nombre,
				descripcion: formValue.descripcion,
				cantidad: formValue.cantidad,
				precioUnitario: formValue.precioUnitario,
				subtotal: formValue.cantidad * formValue.precioUnitario,
				estado: formValue.estado,
			};

			this.dialogRef.close(result);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(value);
	}
}
