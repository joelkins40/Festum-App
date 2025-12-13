import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { Nota, EstadisticasNotas } from '../../../core/models/notas.models';
import { NotasService } from '../../../core/services/notas.service';
import { VentaDialogComponent } from './venta-dialog/venta-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ButtonIconComponent } from '../../../shared/components/button-icon';

@Component({
	selector: 'app-nota-venta',
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
		MatTooltipModule,
		MatDividerModule,
		MatChipsModule,
		ButtonIconComponent,
	],
	templateUrl: './nota-venta.component.html',
	styleUrl: './nota-venta.component.scss',
})
export class NotasComponent implements OnInit {
	// Tabla y datos
	dataSource = new MatTableDataSource<Nota>([]);
	columnasDisplayed: string[] = [
		'tipo',
		'folio',
		'cliente',
		'evento',
		'fecha',
		'total',
		'estado',
		'acciones',
	];
	filtroTexto = '';

	// Estados
	loading = false;
	notas: Nota[] = [];

	// Estadísticas
	estadisticas: EstadisticasNotas = {
		totalVentasMes: 0,
		totalIngresos: 0,
		promedioVenta: 0,
		cantidadNotas: 0,
	};

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('fileInput') fileInput!: ElementRef;

	constructor(
		private notasService: NotasService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.cargarNotas();
		this.cargarEstadisticas();
		this.configurarTabla();
		this.suscribirACambios();
	}

	private configurarTabla(): void {
		setTimeout(() => {
			if (this.paginator) {
				this.dataSource.paginator = this.paginator;
			}
			if (this.sort) {
				this.dataSource.sort = this.sort;
			}

			// Configurar filtro personalizado
			this.dataSource.filterPredicate = (data: Nota, filter: string) => {
				const searchStr = filter.toLowerCase();
				return (
					data.folio.toLowerCase().includes(searchStr) ||
					data.cliente.nombre.toLowerCase().includes(searchStr) ||
					data.evento.nombre.toLowerCase().includes(searchStr) ||
					data.tipo.toLowerCase().includes(searchStr) ||
					data.estado.toLowerCase().includes(searchStr)
				);
			};
		});
	}

	private suscribirACambios(): void {
		this.notasService.notas$.subscribe((notas) => {
			this.notas = notas;
			this.dataSource.data = notas;
			this.cargarEstadisticas();
		});

		this.notasService.loading$.subscribe((loading) => {
			this.loading = loading;
		});
	}

	cargarNotas(): void {
		this.notasService.getNotas().subscribe({
			next: (notas) => {
				this.mostrarMensaje('Notas cargadas exitosamente', 'success');
			},
			error: (error) => {
				console.error('Error al cargar notas:', error);
				this.mostrarMensaje('Error al cargar notas', 'error');
			},
		});
	}

	cargarEstadisticas(): void {
		this.notasService.getEstadisticas().subscribe({
			next: (stats) => {
				this.estadisticas = stats;
			},
			error: (error) => {
				console.error('Error al cargar estadísticas:', error);
			},
		});
	}

	abrirModalCrear(): void {
		const dialogRef = this.dialog.open(VentaDialogComponent, {
			width: '600px',
			disableClose: true,
			data: {
				modo: 'crear',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.crearNota(result);
			}
		});
	}

	abrirModalEditar(nota: Nota): void {
		const dialogRef = this.dialog.open(VentaDialogComponent, {
			width: '600px',
			disableClose: true,
			data: {
				nota: nota,
				modo: 'editar',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.actualizarNota(result);
			}
		});
	}

	abrirModalVer(nota: Nota): void {
		// Mostrar detalles de la nota (puedes crear un componente específico para esto)
		this.mostrarMensaje(
			`Folio: ${nota.folio} - Total: $${nota.total.toLocaleString('es-MX')}`,
			'info',
		);
	}

	private crearNota(notaData: any): void {
		this.notasService.crearNota(notaData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje(response.message, 'success');
				} else {
					this.mostrarMensaje(response.message, 'error');
				}
			},
			error: (error) => {
				console.error('Error al crear nota:', error);
				this.mostrarMensaje('Error al crear la nota', 'error');
			},
		});
	}

	private actualizarNota(notaData: any): void {
		this.notasService.actualizarNota(notaData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje(response.message, 'success');
				} else {
					this.mostrarMensaje(response.message, 'error');
				}
			},
			error: (error) => {
				console.error('Error al actualizar nota:', error);
				this.mostrarMensaje('Error al actualizar la nota', 'error');
			},
		});
	}

	confirmarEliminacion(nota: Nota): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '480px',
			disableClose: true,
			data: {
				title: 'Eliminar Nota',
				message: `¿Está seguro de que desea eliminar la nota ${nota.folio}? Esta acción no se puede deshacer.`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar',
				type: 'danger',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.eliminarNota(nota.id);
			}
		});
	}

	private eliminarNota(id: number): void {
		this.notasService.eliminarNota(id).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje(response.message, 'success');
				} else {
					this.mostrarMensaje(response.message, 'error');
				}
			},
			error: (error) => {
				console.error('Error al eliminar nota:', error);
				this.mostrarMensaje('Error al eliminar la nota', 'error');
			},
		});
	}

	aplicarFiltro(): void {
		this.dataSource.filter = this.filtroTexto.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	// Obtener clase CSS según el estado
	getEstadoClass(estado: string): string {
		const clases: { [key: string]: string } = {
			Pagada: 'estado-pagada',
			Pendiente: 'estado-pendiente',
			Cancelada: 'estado-cancelada',
			Parcial: 'estado-parcial',
		};
		return clases[estado] || '';
	}

	// Formatear moneda
	formatearMoneda(valor: number): string {
		return `$${valor.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	}

	// Abrir selector de archivo para importar
	abrirImportador(): void {
		this.fileInput.nativeElement.click();
	}

	// Procesar archivo CSV seleccionado
	procesarArchivoCSV(event: any): void {
		const archivo = event.target.files[0];
		if (archivo && archivo.type === 'text/csv') {
			this.notasService.importarDesdeCSV(archivo).subscribe({
				next: (response) => {
					if (response.success) {
						this.mostrarMensaje(response.message, 'success');
						// Resetear el input file
						this.fileInput.nativeElement.value = '';
					} else {
						this.mostrarMensaje(response.message, 'error');
					}
				},
				error: (error) => {
					console.error('Error al importar CSV:', error);
					this.mostrarMensaje('Error al procesar el archivo CSV', 'error');
				},
			});
		} else {
			this.mostrarMensaje(
				'Por favor seleccione un archivo CSV válido',
				'warning',
			);
		}
	}

	// Exportar notas a CSV
	exportarCSV(): void {
		this.notasService.exportarACSV().subscribe({
			next: (blob) => {
				// Crear enlace de descarga
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `notas_venta_${new Date().toISOString().split('T')[0]}.csv`;
				link.click();

				// Limpiar
				window.URL.revokeObjectURL(url);
				this.mostrarMensaje('Archivo CSV descargado exitosamente', 'success');
			},
			error: (error) => {
				console.error('Error al exportar CSV:', error);
				this.mostrarMensaje('Error al exportar el archivo CSV', 'error');
			},
		});
	}

	private mostrarMensaje(
		mensaje: string,
		tipo: 'success' | 'error' | 'warning' | 'info' = 'info',
	): void {
		const config = {
			duration: 4000,
			horizontalPosition: 'right' as const,
			verticalPosition: 'top' as const,
			panelClass: [`snackbar-${tipo}`],
		};

		this.snackBar.open(mensaje, 'Cerrar', config);
	}
}
