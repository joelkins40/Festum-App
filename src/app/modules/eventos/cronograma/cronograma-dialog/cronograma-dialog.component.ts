import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';

import {
	EventStatus,
	LocationType,
	TimelineClient,
} from '../models/event-timeline.model';

import { TimelineEvent } from '../models/event-timeline.model';

export interface CronogramaDialogData {
	mode: 'create' | 'edit';
	event?: TimelineEvent;
}

@Component({
	selector: 'app-cronograma-dialog',
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
		MatTooltipModule,
		MatRadioModule,
	],
	templateUrl: './cronograma-dialog.component.html',
	styleUrl: './cronograma-dialog.component.scss',
})
export class CronogramaDialogComponent implements OnInit {
	data = inject<CronogramaDialogData>(MAT_DIALOG_DATA);
	private fb = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<CronogramaDialogComponent>);

	eventForm!: FormGroup;
	saving = false;

	// Enums para el template
	EventStatus = EventStatus;
	LocationType = LocationType;

	// Datos para selects
	availableClients: TimelineClient[] = this.getMockClients();
	availableStatuses = Object.values(EventStatus);

	constructor() {}

	ngOnInit(): void {
		this.initializeForm();

		if (this.data.mode === 'edit' && this.data.event) {
			this.populateForm(this.data.event);
		}
	}

	/**
	 * Inicializa el formulario con validaciones
	 */
	private initializeForm(): void {
		this.eventForm = this.fb.group({
			nombre: [
				'',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
				],
			],
			clienteId: ['', [Validators.required]],
			fechaInicio: ['', [Validators.required]],
			fechaFin: ['', [Validators.required]],
			locationType: [LocationType.SALON, [Validators.required]],
			salonName: [''],
			salonId: [''],
			address: [''],
			descripcion: ['', [Validators.maxLength(500)]],
			status: [EventStatus.PENDING, [Validators.required]],
		});

		// Validadores condicionales según el tipo de ubicación
		this.eventForm.get('locationType')?.valueChanges.subscribe((type) => {
			this.updateLocationValidators(type);
		});
	}

	/**
	 * Actualiza validadores según el tipo de ubicación
	 */
	private updateLocationValidators(type: LocationType): void {
		const salonNameControl = this.eventForm.get('salonName');
		const addressControl = this.eventForm.get('address');

		// Limpiar validadores
		salonNameControl?.clearValidators();
		addressControl?.clearValidators();

		// Agregar validadores según tipo
		if (type === LocationType.SALON) {
			salonNameControl?.setValidators([Validators.required]);
		} else {
			addressControl?.setValidators([Validators.required]);
		}

		salonNameControl?.updateValueAndValidity();
		addressControl?.updateValueAndValidity();
	}

	/**
	 * Llena el formulario con datos del evento (modo edición)
	 */
	private populateForm(event: TimelineEvent): void {
		this.eventForm.patchValue({
			nombre: event.nombre,
			clienteId: event.cliente.id,
			fechaInicio: new Date(event.fechaInicio),
			fechaFin: new Date(event.fechaFin),
			locationType: event.ubicacion.type,
			salonName: event.ubicacion.salonName || '',
			salonId: event.ubicacion.salonId || '',
			address: event.ubicacion.address || '',
			descripcion: event.descripcion || '',
			status: event.status,
		});
	}

	/**
	 * Guarda el evento
	 */
	onSave(): void {
		if (this.eventForm.valid && !this.saving) {
			this.saving = true;

			const formValue = this.eventForm.value;
			const selectedClient = this.availableClients.find(
				(c) => c.id === formValue.clienteId,
			);

			// Construir objeto de ubicación
			const ubicacion =
				formValue.locationType === LocationType.SALON
					? {
							type: LocationType.SALON,
							salonName: formValue.salonName,
							salonId: formValue.salonId || Date.now(),
						}
					: {
							type: LocationType.ADDRESS,
							address: formValue.address,
						};

			const result = {
				nombre: formValue.nombre,
				cliente: selectedClient,
				fechaInicio: formValue.fechaInicio,
				fechaFin: formValue.fechaFin,
				ubicacion: ubicacion,
				descripcion: formValue.descripcion,
				status: formValue.status,
			};

			// Simular guardado
			setTimeout(() => {
				this.dialogRef.close(result);
			}, 600);
		}
	}

	/**
	 * Cancela y cierra el dialog
	 */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * Obtiene icono según el estado
	 */
	getStatusIcon(status: EventStatus): string {
		const iconMap: Record<EventStatus, string> = {
			[EventStatus.PENDING]: 'schedule',
			[EventStatus.CONFIRMED]: 'check_circle',
			[EventStatus.COMPLETED]: 'done_all',
			[EventStatus.CANCELED]: 'cancel',
		};
		return iconMap[status];
	}

	/**
	 * Getter para acceder a controles del formulario
	 */
	get f() {
		return this.eventForm.controls;
	}

	/**
	 * Datos mock de clientes
	 */
	private getMockClients(): TimelineClient[] {
		return [
			{ id: 1, nombre: 'María González' },
			{ id: 2, nombre: 'Carlos Rodríguez' },
			{ id: 3, nombre: 'Ana Martínez' },
			{ id: 4, nombre: 'Pedro Hernández' },
			{ id: 5, nombre: 'Laura Jiménez' },
			{ id: 6, nombre: 'Roberto Díaz' },
			{ id: 7, nombre: 'Carmen Fernández' },
			{ id: 8, nombre: 'José Luis Torres' },
		];
	}
}
