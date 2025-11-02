import { Component, OnInit, ViewChild, inject } from '@angular/core';
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

import {
	Cotizacion,
	CotizacionEstado,
	CotizacionStats,
} from '../../../core/models/cotizacion.model';
import { CotizacionesMockService } from './cotizaciones-mock.service';

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
	],
	templateUrl: './listado.component.html',
	styleUrl: './listado.component.scss',
})
export class ListadoComponent implements OnInit {
	// Inyección de dependencias usando inject()
	private cotizacionesService = inject(CotizacionesMockService);
	private snackBar = inject(MatSnackBar);

	// Referencias a componentes de Material
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	// Propiedades del componente
	displayedColumns: string[] = [
		'id',
		'cliente',
		'fecha',
		'total',
		'estado',
		'acciones',
	];
	dataSource = new MatTableDataSource<Cotizacion>([]);
	searchTerm = '';
	isLoading = true;
	stats: CotizacionStats = {
		total: 0,
		pendientes: 0,
		aprobadas: 0,
		rechazadas: 0,
	};

	// Referencia a enum para usar en template
	CotizacionEstado = CotizacionEstado;

	ngOnInit(): void {
		this.loadCotizaciones();
		this.loadStats();
	}

	/**
	 * Carga las cotizaciones desde el servicio
	 * Simula un tiempo de carga inicial
	 */
	loadCotizaciones(): void {
		this.isLoading = true;

		this.cotizacionesService.getCotizaciones().subscribe({
			next: (cotizaciones) => {
				this.dataSource.data = cotizaciones;
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				// Configurar filtro personalizado
				this.dataSource.filterPredicate = this.createFilterPredicate();

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

	/**
	 * Crea una función de filtrado personalizada para la tabla
	 * Busca coincidencias en cliente y otros campos
	 */
	createFilterPredicate() {
		return (cotizacion: Cotizacion, filter: string): boolean => {
			const searchStr = filter.toLowerCase();
			return (
				cotizacion.cliente.toLowerCase().includes(searchStr) ||
				cotizacion.id.toString().includes(searchStr) ||
				cotizacion.estado.toLowerCase().includes(searchStr) ||
				this.formatCurrency(cotizacion.total).includes(searchStr)
			);
		};
	}

	/**
	 * Aplica el filtro de búsqueda a la tabla
	 */
	applyFilter(): void {
		this.dataSource.filter = this.searchTerm.trim().toLowerCase();

		// Volver a la primera página después de filtrar
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * Limpia el filtro de búsqueda
	 */
	clearFilter(): void {
		this.searchTerm = '';
		this.applyFilter();
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

	/**
	 * Maneja la acción de editar una cotización
	 * @param cotizacion - Cotización a editar
	 */
	editCotizacion(cotizacion: Cotizacion): void {
		console.log('Editar cotización:', cotizacion);
		this.showNotification(`Editar: ${cotizacion.cliente}`, 'info');
		// TODO: Abrir dialog de edición
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

	/**
	 * Muestra una notificación al usuario
	 * @param message - Mensaje a mostrar
	 * @param type - Tipo de notificación (success, error, info)
	 */
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
