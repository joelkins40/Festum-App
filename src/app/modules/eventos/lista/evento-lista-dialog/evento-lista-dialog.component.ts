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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Evento, Direccion, Lugar } from '../lista-eventos.service';

/**
 * Interface para los datos del diálogo
 */
export interface EventoDialogData {
	evento?: Evento;
	mode: 'create' | 'edit';
}

/**
 * Componente de diálogo para crear/editar eventos
 */
@Component({
	selector: 'app-evento-lista-dialog',
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
		MatRadioModule,
		MatCheckboxModule,
		MatIconModule,
		MatDividerModule,
	],
	providers: [provideNativeDateAdapter()],
	templateUrl: './evento-lista-dialog.component.html',
	styleUrl: './evento-lista-dialog.component.scss',
})
export class EventoListaDialogComponent {
	// Dependency injection
	private readonly dialogRef = inject(MatDialogRef<EventoListaDialogComponent>);
	private readonly data = inject<EventoDialogData>(MAT_DIALOG_DATA);
	private readonly fb = inject(FormBuilder);

	// Formulario principal
	eventoForm: FormGroup;

	// Propiedades del diálogo
	mode: 'create' | 'edit' = this.data.mode;
	dialogTitle = this.mode === 'create' ? 'Nuevo Evento' : 'Editar Evento';

	// Opciones para select
	tiposLugar = [
		{ value: 'direccionCliente', label: 'Dirección del Cliente' },
		{ value: 'nuevaDireccion', label: 'Nueva Dirección' },
		{ value: 'salonExistente', label: 'Salón Existente' },
	];

	constructor() {
		this.eventoForm = this.createForm();

		// Si estamos en modo edición, cargar los datos
		if (this.mode === 'edit' && this.data.evento) {
			this.loadEventoData(this.data.evento);
		}
	}

	/**
	 * Crea el formulario con validaciones
	 */
	private createForm(): FormGroup {
		return this.fb.group({
			// Información básica del evento
			folio: ['', [Validators.required]],
			nombreEvento: ['', [Validators.required, Validators.minLength(3)]],
			fechaRecepcion: ['', [Validators.required]],
			fechaRegreso: ['', [Validators.required]],

			// Cliente
			clienteNombre: ['', [Validators.required]],
			clienteEspecial: [false],

			// Lugar
			lugarTipo: ['direccionCliente', [Validators.required]],
			lugarNombreSalon: [''],
			lugarFullAddress: [''],
			lugarCity: [''],
			lugarState: [''],
			lugarCountry: ['México'],
			lugarPostalCode: [''],

			// Total
			total: [0, [Validators.required, Validators.min(0)]],
		});
	}

	/**
	 * Carga los datos del evento en el formulario
	 */
	private loadEventoData(evento: Evento): void {
		this.eventoForm.patchValue({
			folio: evento.folio,
			nombreEvento: evento.nombreEvento,
			fechaRecepcion: new Date(evento.fechaRecepcion),
			fechaRegreso: new Date(evento.fechaRegreso),
			clienteNombre: evento.cliente.nombre,
			clienteEspecial: evento.cliente.clienteEspecial,
			lugarTipo: evento.lugar.tipo,
			total: evento.total,
		});

		// Cargar datos específicos del lugar según su tipo
		if (evento.lugar.tipo === 'direccionCliente' && evento.lugar.direccion) {
			this.loadDireccionData(evento.lugar.direccion);
		} else if (
			evento.lugar.tipo === 'nuevaDireccion' &&
			evento.lugar.direccion
		) {
			this.loadDireccionData(evento.lugar.direccion);
		} else if (
			evento.lugar.tipo === 'salonExistente' &&
			evento.lugar.nombreSalon
		) {
			this.eventoForm.patchValue({
				lugarNombreSalon: evento.lugar.nombreSalon,
			});
		}
	}

	/**
	 * Carga los datos de dirección en el formulario
	 */
	private loadDireccionData(direccion: Direccion): void {
		this.eventoForm.patchValue({
			lugarFullAddress: direccion.fullAddress,
			lugarCity: direccion.city,
			lugarState: direccion.state,
			lugarCountry: direccion.country,
			lugarPostalCode: direccion.postalCode,
		});
	}

	/**
	 * Construye el objeto Evento desde el formulario
	 */
	private buildEventoFromForm(): Evento {
		const formValue = this.eventoForm.value;

		// Construir el lugar según el tipo
		let lugar: Lugar;

		if (formValue.lugarTipo === 'direccionCliente') {
			lugar = {
				tipo: 'direccionCliente',
				direccion: {
					fullAddress: formValue.lugarFullAddress,
					city: formValue.lugarCity,
					state: formValue.lugarState,
					country: formValue.lugarCountry,
					postalCode: formValue.lugarPostalCode,
				},
			};
		} else if (formValue.lugarTipo === 'nuevaDireccion') {
			lugar = {
				tipo: 'nuevaDireccion',
				direccion: {
					fullAddress: formValue.lugarFullAddress,
					city: formValue.lugarCity,
					state: formValue.lugarState,
					country: formValue.lugarCountry,
					postalCode: formValue.lugarPostalCode,
				},
			};
		} else {
			// salonExistente
			lugar = {
				tipo: 'salonExistente',
				salonId: 1,
				nombreSalon: formValue.lugarNombreSalon,
			};
		}

		return {
			id: this.data.evento?.id || 0,
			folio: formValue.folio,
			nombreEvento: formValue.nombreEvento,
			fechaRecepcion: formValue.fechaRecepcion,
			fechaRegreso: formValue.fechaRegreso,
			cliente: {
				id: this.data.evento?.cliente.id || 0,
				nombre: formValue.clienteNombre,
				clienteEspecial: formValue.clienteEspecial,
				activo: true,
			},
			lugar,
			productos: this.data.evento?.productos || [],
			total: formValue.total,
		};
	}

	/**
	 * Obtiene el mensaje de error para un campo
	 */
	getErrorMessage(fieldName: string): string {
		const field = this.eventoForm.get(fieldName);
		if (!field) return '';

		if (field.hasError('required')) {
			return 'Este campo es requerido';
		}
		if (field.hasError('email')) {
			return 'Email inválido';
		}
		if (field.hasError('minlength')) {
			return `Mínimo ${field.getError('minlength').requiredLength} caracteres`;
		}
		if (field.hasError('min')) {
			return `Valor mínimo: ${field.getError('min').min}`;
		}
		return '';
	}

	/**
	 * Guarda el evento
	 */
	save(): void {
		if (this.eventoForm.valid) {
			const evento = this.buildEventoFromForm();
			this.dialogRef.close(evento);
		} else {
			// Marcar todos los campos como touched para mostrar errores
			Object.keys(this.eventoForm.controls).forEach((key) => {
				this.eventoForm.get(key)?.markAsTouched();
			});
		}
	}

	/**
	 * Cancela y cierra el diálogo
	 */
	cancel(): void {
		this.dialogRef.close();
	}

	/**
	 * Verifica si se deben mostrar los campos de dirección
	 */
	shouldShowDireccionFields(): boolean {
		const tipo = this.eventoForm.get('lugarTipo')?.value;
		return tipo === 'direccionCliente' || tipo === 'nuevaDireccion';
	}

	/**
	 * Verifica si se deben mostrar los campos de salón
	 */
	shouldShowSalonFields(): boolean {
		return this.eventoForm.get('lugarTipo')?.value === 'salonExistente';
	}
}
