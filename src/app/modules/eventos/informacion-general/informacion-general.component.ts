import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Nota, TipoLugar } from '../../../core/models/nota.model';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
	selector: 'app-informacion-general',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSelectModule,
		MatTooltipModule,
		MatChipsModule,
		MatDividerModule,
		MatSnackBarModule,
	],
	templateUrl: './informacion-general.component.html',
	styleUrl: './informacion-general.component.scss',
})
export class InformacionGeneralComponent implements OnInit {
	// Señales para manejo de estado
	isEditMode = signal(false);
	isSaving = signal(false);

	// Formularios reactivos
	eventForm!: FormGroup;

	// Datos de la nota (simulado - en producción vendría de un servicio)
	nota: Nota = this.getMockNota();

	// Enums para el template
	TipoLugar = TipoLugar;
	estadosDisponibles = [
		'borrador',
		'confirmada',
		'entregada',
		'finalizada',
		'cancelada',
	];

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
	) {}

	ngOnInit(): void {
		this.initializeForm();
	}

	/**
	 * Inicializa formularios reactivos con validaciones
	 */
	private initializeForm(): void {
		this.eventForm = this.fb.group({
			folio: [
				{ value: this.nota.folio, disabled: true },
				[Validators.required],
			],
			nombreEvento: [
				this.nota.nombreEvento,
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
				],
			],
			fechaRecepcion: [this.nota.fechaRecepcion, [Validators.required]],
			fechaRegreso: [this.nota.fechaRegreso, [Validators.required]],
			estado: [this.nota.estado || 'borrador', [Validators.required]],
			observaciones: [
				this.nota.observaciones || '',
				[Validators.maxLength(500)],
			],
		});

		// Deshabilitar formulario inicialmente
		this.eventForm.disable();
	}

	/**
	 * Alterna entre modo ver/editar
	 */
	toggleEditMode(): void {
		const newMode = !this.isEditMode();
		this.isEditMode.set(newMode);

		if (newMode) {
			// Habilitar campos editables (excepto folio)
			this.eventForm.get('nombreEvento')?.enable();
			this.eventForm.get('fechaRecepcion')?.enable();
			this.eventForm.get('fechaRegreso')?.enable();
			this.eventForm.get('estado')?.enable();
			this.eventForm.get('observaciones')?.enable();
		} else {
			// Deshabilitar todo y restaurar valores
			this.eventForm.disable();
			this.eventForm.patchValue({
				nombreEvento: this.nota.nombreEvento,
				fechaRecepcion: this.nota.fechaRecepcion,
				fechaRegreso: this.nota.fechaRegreso,
				estado: this.nota.estado,
				observaciones: this.nota.observaciones,
			});
		}
	}

	/**
	 * Guarda los cambios del formulario
	 */
	saveChanges(): void {
		if (this.eventForm.valid) {
			this.isSaving.set(true);

			// Simular guardado (en producción sería una llamada a servicio)
			setTimeout(() => {
				const formValue = this.eventForm.getRawValue();

				// Actualizar nota con valores del formulario
				this.nota = {
					...this.nota,
					nombreEvento: formValue.nombreEvento,
					fechaRecepcion: formValue.fechaRecepcion,
					fechaRegreso: formValue.fechaRegreso,
					estado: formValue.estado,
					observaciones: formValue.observaciones,
				};

				this.isSaving.set(false);
				this.isEditMode.set(false);
				this.eventForm.disable();

				this.showSnackBar('Cambios guardados exitosamente', 'success');
			}, 1000);
		} else {
			this.showSnackBar(
				'Por favor corrija los errores en el formulario',
				'error',
			);
		}
	}

	/**
	 * Cancela la edición
	 */
	cancelEdit(): void {
		this.toggleEditMode();
	}

	/**
	 * Obtiene la clase CSS según el estado
	 */
	getEstadoClass(estado?: string): string {
		const estadoMap: Record<string, string> = {
			borrador: 'estado-borrador',
			confirmada: 'estado-confirmada',
			entregada: 'estado-entregada',
			finalizada: 'estado-finalizada',
			cancelada: 'estado-cancelada',
		};
		return estadoMap[estado || 'borrador'] || 'estado-borrador';
	}

	/**
	 * Obtiene el icono según el estado
	 */
	getEstadoIcon(estado?: string): string {
		const iconMap: Record<string, string> = {
			borrador: 'edit',
			confirmada: 'check_circle',
			entregada: 'local_shipping',
			finalizada: 'done_all',
			cancelada: 'cancel',
		};
		return iconMap[estado || 'borrador'] || 'help';
	}

	/**
	 * Formatea fecha para visualización
	 */
	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(new Date(date));
	}

	/**
	 * Formatea precio
	 */
	formatPrice(price: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(price);
	}

	/**
	 * Obtiene la dirección formateada según el tipo de lugar
	 */
	getFormattedAddress(): string {
		const lugar = this.nota.lugar;

		switch (lugar.tipo) {
			case TipoLugar.DIRECCION_CLIENTE:
				if (lugar.direccionCliente) {
					return `${lugar.direccionCliente.line1}\n${lugar.direccionCliente.line2}\n${lugar.direccionCliente.line3}`;
				}
				break;
			case TipoLugar.NUEVA_DIRECCION:
				if (lugar.nuevaDireccion) {
					const d = lugar.nuevaDireccion;
					return `${d.calle} ${d.numero}, ${d.colonia}\n${d.ciudad}, ${d.estado}\nC.P. ${d.codigoPostal}`;
				}
				break;
			case TipoLugar.SALON:
				if (lugar.salon) {
					return `${lugar.salon.nombre}\n${lugar.salon.direccion}`;
				}
				break;
		}

		return 'No especificado';
	}

	/**
	 * Obtiene el tipo de lugar en texto legible
	 */
	getTipoLugarLabel(): string {
		const labelMap: Record<TipoLugar, string> = {
			[TipoLugar.DIRECCION_CLIENTE]: 'Dirección del Cliente',
			[TipoLugar.NUEVA_DIRECCION]: 'Dirección Personalizada',
			[TipoLugar.SALON]: 'Salón de Eventos',
		};
		return labelMap[this.nota.lugar.tipo] || 'No especificado';
	}

	/**
	 * TrackBy para optimizar renderizado de listas
	 */
	trackByProductId(_index: number, item: { id: string }): string {
		return item.id;
	}

	/**
	 * Muestra notificación
	 */
	private showSnackBar(
		message: string,
		type: 'success' | 'error' | 'info',
	): void {
		this.snackBar.open(message, 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: [`snackbar-${type}`],
		});
	}

	/**
	 * Datos mock para desarrollo (se reemplazará con servicio real)
	 */
	private getMockNota(): Nota {
		const mockCliente: Cliente = {
			id: 1,
			nombre: 'María Fernanda González López',
			direcciones: [
				{
					street: 'Av. Insurgentes Sur',
					number: '1234',
					neighborhood: 'Del Valle',
					city: 'Ciudad de México',
					state: 'CDMX',
					country: 'México',
					postalCode: '03100',
					formatted: {
						line1: 'Av. Insurgentes Sur 1234',
						line2: 'Del Valle',
						line3: 'Ciudad de México, CDMX 03100',
					},
					geoapifyPlaceId: 'mock-id-123',
					confidence: 0.95,
					source: 'Geoapify',
				},
			],
			clientePreferente: true,
			activo: true,
		};

		return {
			id: 1001,
			folio: 'EV-2025-1001',
			fechaRecepcion: new Date('2025-12-15'),
			fechaRegreso: new Date('2025-12-16'),
			nombreEvento: 'Boda María y Carlos',
			cliente: mockCliente,
			clienteId: 1,
			lugar: {
				tipo: TipoLugar.DIRECCION_CLIENTE,
				direccionCliente: mockCliente.direcciones[0].formatted,
			},
			productos: [
				{
					id: 'p1',
					productoServicioId: 1,
					tipo: 'Producto',
					nombre: 'Sillas Tiffany Blancas',
					descripcion: 'Sillas elegantes estilo Tiffany',
					cantidad: 150,
					precioUnitario: 45,
					subtotal: 6750,
				},
				{
					id: 'p2',
					productoServicioId: 2,
					tipo: 'Producto',
					nombre: 'Mesas Redondas 10 Personas',
					descripcion: 'Mesas redondas con mantel blanco',
					cantidad: 15,
					precioUnitario: 250,
					subtotal: 3750,
				},
				{
					id: 's1',
					productoServicioId: 3,
					tipo: 'Servicio',
					nombre: 'Montaje y Desmontaje',
					descripcion: 'Servicio completo de instalación',
					cantidad: 1,
					precioUnitario: 5000,
					subtotal: 5000,
				},
			],
			subtotal: 15500,
			iva: 2480,
			total: 17980,
			observaciones:
				'El evento es en jardín exterior. Confirmar acceso para camión de carga a las 8:00 AM.',
			estado: 'confirmada',
			fechaCreacion: new Date('2025-11-01'),
			fechaActualizacion: new Date('2025-11-02'),
		};
	}

	// Getter para acceso fácil a controles del formulario
	get f() {
		return this.eventForm.controls;
	}
}
