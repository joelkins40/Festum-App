import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import {
	MAT_DIALOG_DATA,
	MatDialogRef,
	MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import {
	Nota,
	TipoNota,
	EstadoNota,
	Cliente,
	Evento,
} from '../../notas/notas.models';

export interface FacturacionDialogData {
	nota?: Nota;
	modo: 'crear' | 'editar';
}

interface InvoiceFormData {
	id?: number;
	tipo: TipoNota;
	clienteId: number;
	eventoId: number;
	fecha: Date;
	total: number;
	estado: EstadoNota;
	descripcion?: string;
}

@Component({
	selector: 'app-facturacion-dialog',
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
		MatDividerModule,
	],
	templateUrl: './facturacion-dialog.component.html',
	styleUrl: './facturacion-dialog.component.scss',
})
export class FacturacionDialogComponent implements OnInit {
	invoiceForm!: FormGroup;
	isEditMode: boolean;
	dialogTitle: string;

	// Catálogos para los selects
	clientes: Cliente[] = [];
	eventos: Evento[] = [];
	tiposNota: TipoNota[] = ['Paquete', 'Servicio'];
	estadosNota: EstadoNota[] = ['Pendiente', 'Pagada', 'Cancelada', 'Parcial'];

	// Inyección moderna de Angular 19
	private fb = inject(FormBuilder);
	public dialogRef = inject(MatDialogRef<FacturacionDialogComponent>);
	public data = inject<FacturacionDialogData>(MAT_DIALOG_DATA);

	constructor() {
		this.isEditMode = this.data.modo === 'editar';
		this.dialogTitle = this.isEditMode ? 'Editar Factura' : 'Nueva Factura';
	}

	ngOnInit(): void {
		this.initializeForm();
		this.loadCatalogs();

		if (this.isEditMode && this.data.nota) {
			this.loadInvoiceData();
		}
	}

	private initializeForm(): void {
		this.invoiceForm = this.fb.group({
			tipo: ['', Validators.required],
			clienteId: ['', Validators.required],
			eventoId: ['', Validators.required],
			fecha: [new Date(), Validators.required],
			total: ['', [Validators.required, Validators.min(0.01)]],
			estado: ['Pendiente', Validators.required],
			descripcion: ['', Validators.maxLength(500)],
		});
	}

	private loadCatalogs(): void {
		// Mock data - simular carga de catálogos desde API
		this.clientes = [
			{
				id: 1,
				nombre: 'María García López',
				informacionDeContacto: {
					telefono: '5551234567',
					email: 'maria@example.com',
				},
				clientePreferente: true,
				activo: true,
			},
			{
				id: 2,
				nombre: 'Juan Pérez Sánchez',
				informacionDeContacto: {
					telefono: '5559876543',
					email: 'juan@example.com',
				},
				clientePreferente: false,
				activo: true,
			},
			{
				id: 3,
				nombre: 'Ana Martínez Ruiz',
				informacionDeContacto: {
					telefono: '5555555555',
					email: 'ana@example.com',
				},
				clientePreferente: true,
				activo: true,
			},
			{
				id: 4,
				nombre: 'Carlos Rodríguez Torres',
				informacionDeContacto: {
					telefono: '5552222222',
					email: 'carlos@example.com',
				},
				clientePreferente: false,
				activo: true,
			},
			{
				id: 5,
				nombre: 'Laura Fernández Gómez',
				informacionDeContacto: {
					telefono: '5553333333',
					email: 'laura@example.com',
				},
				clientePreferente: true,
				activo: true,
			},
		];

		this.eventos = [
			{
				id: 1,
				nombre: 'Boda Jardín Real',
				fecha: new Date(2025, 11, 15),
				lugar: 'Salón Jardín Real',
			},
			{
				id: 2,
				nombre: 'XV Años Elegante',
				fecha: new Date(2025, 10, 20),
				lugar: 'Salón Imperial',
			},
			{
				id: 3,
				nombre: 'Bautizo Familiar',
				fecha: new Date(2025, 11, 5),
				lugar: 'Salón Pequeño',
			},
			{
				id: 4,
				nombre: 'Graduación Universitaria',
				fecha: new Date(2025, 10, 28),
				lugar: 'Salón Principal',
			},
			{
				id: 5,
				nombre: 'Aniversario Bodas de Oro',
				fecha: new Date(2025, 11, 10),
				lugar: 'Salón VIP',
			},
		];
	}

	private loadInvoiceData(): void {
		if (this.data.nota) {
			this.invoiceForm.patchValue({
				tipo: this.data.nota.tipo,
				clienteId: this.data.nota.cliente.id,
				eventoId: this.data.nota.evento.id,
				fecha: this.data.nota.fecha,
				total: this.data.nota.total,
				estado: this.data.nota.estado,
				descripcion: this.data.nota.descripcion || '',
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSubmit(): void {
		if (this.invoiceForm.valid) {
			const formData: InvoiceFormData = {
				...this.invoiceForm.value,
			};

			// Si es edición, agregar el ID de la nota
			if (this.isEditMode && this.data.nota) {
				formData.id = this.data.nota.id;
			}

			this.dialogRef.close(formData);
		} else {
			// Marcar todos los campos como touched para mostrar errores
			Object.keys(this.invoiceForm.controls).forEach((key) => {
				this.invoiceForm.get(key)?.markAsTouched();
			});
		}
	}

	// Métodos auxiliares para validación
	hasError(controlName: string, errorName: string): boolean {
		const control = this.invoiceForm.get(controlName);
		return control ? control.hasError(errorName) && control.touched : false;
	}

	getErrorMessage(controlName: string): string {
		const control = this.invoiceForm.get(controlName);
		if (!control) return '';

		if (control.hasError('required')) {
			return 'Este campo es requerido';
		}

		if (control.hasError('min')) {
			return 'El valor debe ser mayor a 0';
		}

		if (control.hasError('maxlength')) {
			const maxLength = control.errors?.['maxlength'].requiredLength;
			return `Máximo ${maxLength} caracteres`;
		}

		return '';
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(value);
	}

	// Calcular total en tiempo real (opcional, para futuras mejoras)
	calculateTotal(): void {
		// Lógica para calcular el total basado en items seleccionados
		// Por ahora es manual, pero se puede implementar auto-cálculo
	}
}
