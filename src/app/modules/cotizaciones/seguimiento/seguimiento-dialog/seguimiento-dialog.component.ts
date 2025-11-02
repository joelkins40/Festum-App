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
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import {
	Cotizacion,
	CotizacionEstado,
} from '../../../../core/models/cotizacion.model';

interface CotizacionConSeguimiento extends Cotizacion {
	ultimoSeguimiento?: Date;
	notasSeguimiento?: string;
}

export interface SeguimientoDialogData {
	cotizacion: CotizacionConSeguimiento;
	modo: 'ver' | 'editar';
}

/**
 * 📝 Componente Modal para Ver/Actualizar Seguimiento de Cotizaciones
 * Permite actualizar estado y agregar notas de seguimiento
 */
@Component({
	selector: 'app-seguimiento-dialog',
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
		MatChipsModule,
		MatProgressSpinnerModule,
	],
	templateUrl: './seguimiento-dialog.component.html',
	styleUrl: './seguimiento-dialog.component.scss',
})
export class SeguimientoDialogComponent implements OnInit {
	seguimientoForm!: FormGroup;
	modo: 'ver' | 'editar';
	guardando = false;
	estadosDisponibles = Object.values(CotizacionEstado);

	data = inject<SeguimientoDialogData>(MAT_DIALOG_DATA);
	private fb = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<SeguimientoDialogComponent>);

	constructor() {
		this.modo = this.data.modo;
		this.initializeForm();
	}

	ngOnInit(): void {
		if (this.data.cotizacion) {
			this.seguimientoForm.patchValue({
				estado: this.data.cotizacion.estado,
				notas: this.data.cotizacion.notasSeguimiento || '',
			});

			// Si es modo ver, deshabilitar formulario
			if (this.modo === 'ver') {
				this.seguimientoForm.disable();
			}
		}
	}

	/**
	 * 📝 Inicializa el formulario con validaciones
	 */
	private initializeForm(): void {
		this.seguimientoForm = this.fb.group({
			estado: [
				{ value: '', disabled: this.modo === 'ver' },
				[Validators.required],
			],
			notas: [
				{ value: '', disabled: this.modo === 'ver' },
				[
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(500),
				],
			],
		});
	}

	/**
	 * 💾 Guarda los cambios
	 */
	onSave(): void {
		if (this.seguimientoForm.valid && !this.guardando) {
			this.guardando = true;

			const formValue = this.seguimientoForm.value;
			const result = {
				estado: formValue.estado,
				notas: formValue.notas.trim(),
			};

			// Simular delay de guardado para UX
			setTimeout(() => {
				this.dialogRef.close(result);
			}, 600);
		}
	}

	/**
	 * ❌ Cancela y cierra el modal
	 */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * 🎨 Obtener clase CSS para el chip de estado
	 */
	getEstadoClass(estado: CotizacionEstado): string {
		const estadoMap: Record<CotizacionEstado, string> = {
			[CotizacionEstado.PENDIENTE]: 'estado-pendiente',
			[CotizacionEstado.APROBADA]: 'estado-aprobada',
			[CotizacionEstado.RECHAZADA]: 'estado-rechazada',
		};
		return estadoMap[estado] || '';
	}

	/**
	 * 🎨 Obtener icono para el estado
	 */
	getEstadoIcon(estado: CotizacionEstado): string {
		const iconMap: Record<CotizacionEstado, string> = {
			[CotizacionEstado.PENDIENTE]: 'schedule',
			[CotizacionEstado.APROBADA]: 'check_circle',
			[CotizacionEstado.RECHAZADA]: 'cancel',
		};
		return iconMap[estado] || 'help';
	}

	/**
	 * 💰 Formatear precio
	 */
	formatPrice(price: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(price);
	}

	/**
	 * 📅 Formatear fecha
	 */
	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(new Date(date));
	}

	/**
	 * 🔧 Getter para acceso fácil a los controles del formulario
	 */
	get f() {
		return this.seguimientoForm.controls;
	}
}
