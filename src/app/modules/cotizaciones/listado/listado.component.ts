import {
	Component,
	OnInit,
	ViewChild,
	inject,
	AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
	Cotizacion,
	CotizacionEstado,
	CotizacionStats,
} from '../../../core/models/cotizacion.model';
import { CotizacionesMockService } from './cotizaciones-mock.service';
import { CotizacionesListadoDialogComponent } from './cotizaciones-listado-dialog/cotizaciones-listado-dialog.component';

/**
 * Componente para mostrar el listado de cotizaciones
 * Incluye funcionalidades de búsqueda, filtrado y acciones CRUD
 */
@Component({
	selector: 'app-listado',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatChipsModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatDialogModule,
	],
	templateUrl: './listado.component.html',
	styleUrl: './listado.component.scss',
})
export class ListadoComponent implements OnInit, AfterViewInit {
	private cotizacionesService = inject(CotizacionesMockService);
	private snackBar = inject(MatSnackBar);
	private dialog = inject(MatDialog);

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	displayedColumns: string[] = [
		'id',
		'cliente',
		'fecha',
		'total',
		'estado',
		'acciones',
	];
	dataSource = new MatTableDataSource<Cotizacion>([]);
	allCotizaciones: Cotizacion[] = [];

	// Filtros
	filterClientName = '';
	filterStatus = '';
	filterStartDate: Date | null = null;
	filterEndDate: Date | null = null;

	isLoading = true;
	stats: CotizacionStats = {
		total: 0,
		pendientes: 0,
		aprobadas: 0,
		rechazadas: 0,
	};

	CotizacionEstado = CotizacionEstado;
	estadosArray = Object.values(CotizacionEstado);

	ngOnInit(): void {
		this.loadCotizaciones();
		this.loadStats();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	loadCotizaciones(): void {
		this.isLoading = true;

		this.cotizacionesService.getCotizaciones().subscribe({
			next: (cotizaciones) => {
				this.allCotizaciones = cotizaciones;
				this.dataSource.data = cotizaciones;
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error al cargar cotizaciones:', error);
				this.showNotification('Error al cargar las cotizaciones', 'error');
				this.isLoading = false;
			},
		});
	}

	/**
	 * Carga las estadísticas de cotizaciones
	 */
	loadStats(): void {
		this.cotizacionesService.getStats().subscribe({
			next: (stats) => {
				this.stats = stats;
			},
			error: (error) => {
				console.error('Error al cargar estadísticas:', error);
			},
		});
	}

	applyFilters(): void {
		let filtered = [...this.allCotizaciones];

		// Filtro por nombre de cliente
		if (this.filterClientName) {
			const searchTerm = this.filterClientName.toLowerCase();
			filtered = filtered.filter((c) =>
				c.cliente.toLowerCase().includes(searchTerm),
			);
		}

		// Filtro por estado
		if (this.filterStatus) {
			filtered = filtered.filter((c) => c.estado === this.filterStatus);
		}

		// Filtro por rango de fechas
		if (this.filterStartDate) {
			const startDate = this.filterStartDate;
			filtered = filtered.filter((c) => {
				const cotizacionDate = new Date(c.fecha);
				return cotizacionDate >= startDate;
			});
		}

		if (this.filterEndDate) {
			const endDate = this.filterEndDate;
			filtered = filtered.filter((c) => {
				const cotizacionDate = new Date(c.fecha);
				return cotizacionDate <= endDate;
			});
		}

		this.dataSource.data = filtered;

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	clearFilters(): void {
		this.filterClientName = '';
		this.filterStatus = '';
		this.filterStartDate = null;
		this.filterEndDate = null;
		this.applyFilters();
	}

	/**
	 * Maneja la acción de ver detalle de una cotización
	 * @param cotizacion - Cotización a visualizar
	 */
	viewDetail(cotizacion: Cotizacion): void {
		console.log('Ver detalle de cotización:', cotizacion);
		this.showNotification(`Ver detalle: ${cotizacion.cliente}`, 'info');
		// TODO: Navegar a página de detalle o abrir modal
	}

	openCreateDialog(): void {
		const dialogRef = this.dialog.open(CotizacionesListadoDialogComponent, {
			width: '600px',
			data: { mode: 'create' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.cotizacionesService.createCotizacion(result).subscribe({
					next: () => {
						this.showNotification('Cotización creada exitosamente', 'success');
						this.loadCotizaciones();
						this.loadStats();
					},
					error: (error) => {
						console.error('Error al crear:', error);
						this.showNotification('Error al crear la cotización', 'error');
					},
				});
			}
		});
	}

	editCotizacion(cotizacion: Cotizacion): void {
		const dialogRef = this.dialog.open(CotizacionesListadoDialogComponent, {
			width: '600px',
			data: {
				mode: 'edit',
				cotizacion: { ...cotizacion },
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.cotizacionesService
					.updateCotizacion(cotizacion.id, result)
					.subscribe({
						next: () => {
							this.showNotification(
								'Cotización actualizada exitosamente',
								'success',
							);
							this.loadCotizaciones();
							this.loadStats();
						},
						error: (error) => {
							console.error('Error al actualizar:', error);
							this.showNotification(
								'Error al actualizar la cotización',
								'error',
							);
						},
					});
			}
		});
	}

	/**
	 * Maneja la acción de eliminar una cotización
	 * @param cotizacion - Cotización a eliminar
	 */
	deleteCotizacion(cotizacion: Cotizacion): void {
		console.log('Eliminar cotización:', cotizacion);

		// Simular eliminación (en producción, mostrar confirmación primero)
		this.cotizacionesService.deleteCotizacion(cotizacion.id).subscribe({
			next: () => {
				this.showNotification(
					`Cotización ${cotizacion.id} eliminada`,
					'success',
				);
				this.loadCotizaciones(); // Recargar datos
				this.loadStats(); // Actualizar estadísticas
			},
			error: (error) => {
				console.error('Error al eliminar:', error);
				this.showNotification('Error al eliminar la cotización', 'error');
			},
		});
	}

	/**
	 * Formatea un número como moneda mexicana
	 * @param amount - Cantidad a formatear
	 * @returns String formateado como moneda
	 */
	formatCurrency(amount: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(amount);
	}

	/**
	 * Formatea una fecha para mostrar
	 * @param date - Fecha a formatear
	 * @returns String con la fecha formateada
	 */
	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}).format(new Date(date));
	}

	/**
	 * Obtiene la clase CSS para el chip de estado
	 * @param estado - Estado de la cotización
	 * @returns Nombre de la clase CSS
	 */
	getEstadoClass(estado: CotizacionEstado): string {
		switch (estado) {
			case CotizacionEstado.APROBADA:
				return 'estado-aprobada';
			case CotizacionEstado.PENDIENTE:
				return 'estado-pendiente';
			case CotizacionEstado.RECHAZADA:
				return 'estado-rechazada';
			default:
				return '';
		}
	}

	/**
	 * Obtiene el icono para el chip de estado
	 * @param estado - Estado de la cotización
	 * @returns Nombre del icono de Material
	 */
	getEstadoIcon(estado: CotizacionEstado): string {
		switch (estado) {
			case CotizacionEstado.APROBADA:
				return 'check_circle';
			case CotizacionEstado.PENDIENTE:
				return 'schedule';
			case CotizacionEstado.RECHAZADA:
				return 'cancel';
			default:
				return 'help';
		}
	}

	/**
	 * Calcula el porcentaje de un valor respecto al total
	 */
	getPercentage(value: number): number {
		return this.stats.total > 0
			? Math.round((value / this.stats.total) * 100)
			: 0;
	}

	exportToCSV(): void {
		const data = this.dataSource.data;

		if (data.length === 0) {
			this.showNotification('No hay datos para exportar', 'info');
			return;
		}

		const headers = ['ID', 'Cliente', 'Fecha', 'Total', 'Estado'];
		const csvData = data.map((c) => [
			c.id,
			c.cliente,
			this.formatDate(c.fecha),
			c.total,
			c.estado,
		]);

		const csvContent = [
			headers.join(','),
			...csvData.map((row) => row.join(',')),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		link.setAttribute('href', url);
		link.setAttribute('download', `cotizaciones_${Date.now()}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		this.showNotification('CSV exportado exitosamente', 'success');
	}

	importFromCSV(): void {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.csv';

		input.onchange = (e: Event) => {
			const target = e.target as HTMLInputElement;
			const file = target.files?.[0];

			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const csv = event.target?.result as string;
					this.processCSV(csv);
				};
				reader.readAsText(file);
			}
		};

		input.click();
	}

	private processCSV(csv: string): void {
		const lines = csv.split('\n');
		const headers = lines[0].split(',');

		// Validación básica
		if (lines.length < 2) {
			this.showNotification('El archivo CSV está vacío', 'error');
			return;
		}

		this.showNotification('Funcionalidad de importación en desarrollo', 'info');
		console.log('CSV procesado:', { headers, rowCount: lines.length - 1 });
	}

	private showNotification(
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
