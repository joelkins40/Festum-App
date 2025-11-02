import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatDialogModule,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { Cotizacion } from '../../../../core/models/cotizacion.model';

@Component({
	selector: 'app-cotizacion-detalle-dialog',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatDividerModule,
		MatChipsModule,
	],
	templateUrl: './cotizacion-detalle-dialog.component.html',
	styleUrl: './cotizacion-detalle-dialog.component.scss',
})
export class CotizacionDetalleDialogComponent {
	private dialogRef = inject(MatDialogRef<CotizacionDetalleDialogComponent>);
	public cotizacion = inject<Cotizacion>(MAT_DIALOG_DATA);

	close(): void {
		this.dialogRef.close();
	}

	edit(): void {
		this.dialogRef.close({ action: 'edit', cotizacion: this.cotizacion });
	}

	formatCurrency(amount: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(amount);
	}

	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
		}).format(new Date(date));
	}

	getEstadoClass(estado: string): string {
		const classes: { [key: string]: string } = {
			Aprobada: 'estado-aprobada',
			Pendiente: 'estado-pendiente',
			Rechazada: 'estado-rechazada',
		};
		return classes[estado] || '';
	}

	getEstadoIcon(estado: string): string {
		const icons: { [key: string]: string } = {
			Aprobada: 'check_circle',
			Pendiente: 'schedule',
			Rechazada: 'cancel',
		};
		return icons[estado] || 'help';
	}
}
