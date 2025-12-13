import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import {
	Cotizacion,
	CotizacionEstado,
} from '../../../core/models/cotizacion.model';
import { SeguimientoDialogComponent } from './seguimiento-dialog/seguimiento-dialog.component';
import { ButtonIconComponent } from '../../../shared/components/button-icon';

// Extensión del modelo para incluir seguimiento
interface CotizacionConSeguimiento extends Cotizacion {
	ultimoSeguimiento?: Date;
	notasSeguimiento?: string;
}

@Component({
	selector: 'app-seguimiento',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatDialogModule,
		MatChipsModule,
		MatTooltipModule,
		MatDividerModule,
		MatSelectModule,
		ButtonIconComponent,
	],
	templateUrl: './seguimiento.component.html',
	styleUrl: './seguimiento.component.scss',
})
export class SeguimientoComponent implements OnInit {
	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<CotizacionConSeguimiento>([]);
	displayedColumns: string[] = [
		'cliente',
		'fecha',
		'total',
		'estado',
		'ultimoSeguimiento',
		'acciones',
	];
	cotizaciones: CotizacionConSeguimiento[] = [];

	// ===== FILTROS =====
	filtroTexto = '';
	filtroEstado = '';
	estadosDisponibles = Object.values(CotizacionEstado);

	// ===== ESTADOS =====
	loading = false;

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.loadMockData();
		this.configureTable();
	}

	/**
	 * ⚙️ Configurar tabla con paginador y ordenamiento
	 */
	private configureTable(): void {
		setTimeout(() => {
			if (this.paginator) {
				this.dataSource.paginator = this.paginator;
			}
			if (this.sort) {
				this.dataSource.sort = this.sort;
			}

			// Configurar filtro personalizado avanzado
			this.dataSource.filterPredicate = (
				data: CotizacionConSeguimiento,
				filter: string,
			) => {
				const searchTerms = JSON.parse(filter);
				const matchesTexto =
					!searchTerms.texto ||
					data.cliente.toLowerCase().includes(searchTerms.texto.toLowerCase());
				const matchesEstado =
					!searchTerms.estado || data.estado === searchTerms.estado;

				return matchesTexto && matchesEstado;
			};
		});
	}

	/**
	 * 📋 Cargar datos de prueba (mock)
	 */
	private loadMockData(): void {
		this.loading = true;

		// Simular llamada a API
		setTimeout(() => {
			this.cotizaciones = [
				{
					id: 1,
					cliente: 'Juan Pérez García',
					fecha: new Date('2025-10-15'),
					total: 45000,
					estado: CotizacionEstado.PENDIENTE,
					ultimoSeguimiento: new Date('2025-10-20'),
					notasSeguimiento: 'Cliente solicitó cambios en el menú',
				},
				{
					id: 2,
					cliente: 'María González López',
					fecha: new Date('2025-10-18'),
					total: 78500,
					estado: CotizacionEstado.APROBADA,
					ultimoSeguimiento: new Date('2025-10-25'),
					notasSeguimiento: 'Cotización aprobada, pendiente de firma',
				},
				{
					id: 3,
					cliente: 'Carlos Rodríguez Sánchez',
					fecha: new Date('2025-10-10'),
					total: 32000,
					estado: CotizacionEstado.RECHAZADA,
					ultimoSeguimiento: new Date('2025-10-12'),
					notasSeguimiento: 'Cliente eligió otro proveedor',
				},
				{
					id: 4,
					cliente: 'Ana Martínez Torres',
					fecha: new Date('2025-10-22'),
					total: 95000,
					estado: CotizacionEstado.PENDIENTE,
					ultimoSeguimiento: new Date('2025-10-28'),
					notasSeguimiento: 'Esperando confirmación de fecha',
				},
				{
					id: 5,
					cliente: 'Pedro Hernández Ruiz',
					fecha: new Date('2025-10-12'),
					total: 52000,
					estado: CotizacionEstado.APROBADA,
					ultimoSeguimiento: new Date('2025-10-22'),
					notasSeguimiento: 'Anticipo pagado',
				},
				{
					id: 6,
					cliente: 'Laura Jiménez Morales',
					fecha: new Date('2025-10-25'),
					total: 67000,
					estado: CotizacionEstado.PENDIENTE,
					ultimoSeguimiento: new Date('2025-10-30'),
					notasSeguimiento: 'Pendiente de respuesta del cliente',
				},
				{
					id: 7,
					cliente: 'Roberto Díaz Castro',
					fecha: new Date('2025-10-08'),
					total: 41000,
					estado: CotizacionEstado.APROBADA,
					ultimoSeguimiento: new Date('2025-10-15'),
					notasSeguimiento: 'Evento confirmado para diciembre',
				},
				{
					id: 8,
					cliente: 'Carmen Fernández Vega',
					fecha: new Date('2025-10-20'),
					total: 89000,
					estado: CotizacionEstado.PENDIENTE,
					ultimoSeguimiento: new Date('2025-10-27'),
					notasSeguimiento: 'Cliente evaluando opciones de menú',
				},
			];

			this.dataSource.data = this.cotizaciones;
			this.loading = false;
		}, 800);
	}

	/**
	 * 🔍 Aplicar filtros avanzados
	 */
	applyFilter(): void {
		const filterValue = JSON.stringify({
			texto: this.filtroTexto.trim(),
			estado: this.filtroEstado,
		});
		this.dataSource.filter = filterValue;
	}

	/**
	 * 🔄 Limpiar todos los filtros
	 */
	clearFilters(): void {
		this.filtroTexto = '';
		this.filtroEstado = '';
		this.applyFilter();
	}

	/**
	 * 👁️ Ver detalles de la cotización
	 */
	viewQuotation(cotizacion: CotizacionConSeguimiento): void {
		this.dialog.open(SeguimientoDialogComponent, {
			width: '600px',
			data: {
				cotizacion: cotizacion,
				modo: 'ver',
			},
		});
	}

	/**
	 * ✏️ Actualizar estado y seguimiento
	 */
	updateStatus(cotizacion: CotizacionConSeguimiento): void {
		const dialogRef = this.dialog.open(SeguimientoDialogComponent, {
			width: '600px',
			data: {
				cotizacion: cotizacion,
				modo: 'editar',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				// Actualizar cotización en el array
				const index = this.cotizaciones.findIndex(
					(c) => c.id === cotizacion.id,
				);
				if (index !== -1) {
					this.cotizaciones[index] = {
						...this.cotizaciones[index],
						estado: result.estado,
						ultimoSeguimiento: new Date(),
						notasSeguimiento: result.notas,
					};
					this.dataSource.data = [...this.cotizaciones];

					this.showSnackBar('Seguimiento actualizado exitosamente', 'success');
				}
			}
		});
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
	 * ⏱️ Calcular días desde último seguimiento
	 */
	getDaysSinceLastFollowUp(date?: Date): number {
		if (!date) return 0;
		const now = new Date();
		const lastFollowUp = new Date(date);
		const diffTime = Math.abs(now.getTime() - lastFollowUp.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	/**
	 * 🔄 Refrescar datos
	 */
	refresh(): void {
		this.loadMockData();
		this.showSnackBar('Datos actualizados', 'info');
	}

	/**
	 * 📊 Mostrar mensaje de notificación
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
}
