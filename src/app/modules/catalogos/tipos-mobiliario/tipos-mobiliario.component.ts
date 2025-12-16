import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

// Models y Services
import {
	TipoMobiliario,
	CrearTipoMobiliarioDto,
	ActualizarTipoMobiliarioDto,
} from '../../../core/models/tipo-mobiliario.model';
import { TiposMobiliarioService } from '../../../core/services/tipos-mobiliario.service';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DynamicFormDialogComponent } from '../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { DynamicFormConfig } from '../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.types';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ButtonIconComponent } from '../../../shared/components/button-icon';
import { ChipComponent } from '../../../shared/components/chip';

@Component({
	selector: 'app-tipos-mobiliario',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatCardModule,
		MatTabsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
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
		ButtonComponent,
		ChipComponent,
		ButtonIconComponent,
	],
	templateUrl: './tipos-mobiliario.component.html',
	styleUrl: './tipos-mobiliario.component.scss',
})
export class TiposMobiliarioComponent implements OnInit {
	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<TipoMobiliario>([]);
	columnasDisplayed: string[] = [
		'id',
		'descripcion',
		'fechaCreacion',
		'activo',
		'acciones',
	];

	// ===== FILTROS =====
	filtroTexto = '';
	filtroEstado = 'todos'; // 'todos', 'activo', 'inactivo'

	// Opciones para el filtro de estado
	opcionesEstado = [
		{ value: 'todos', label: 'Todos los estados' },
		{ value: 'activo', label: 'Solo activos' },
		{ value: 'inactivo', label: 'Solo inactivos' },
	];

	// ===== ESTADOS =====
	loading = false;
	tiposMobiliario: TipoMobiliario[] = [];

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('fileInput') fileInput!: ElementRef;

	constructor(
		private tiposMobiliarioService: TiposMobiliarioService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}
	ngOnInit(): void {
		this.cargarTiposMobiliario();
		this.configurarFiltros();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	// ===== CARGA DE DATOS =====
	cargarTiposMobiliario(): void {
		this.loading = true;

		this.tiposMobiliarioService.getTiposMobiliario().subscribe({
			next: (response) => {
				if (response.success && response.data) {
					this.tiposMobiliario = response.data as TipoMobiliario[];
					this.actualizarTabla();
				} else {
					this.mostrarError(
						'Error al cargar tipos de mobiliario: ' + response.message,
					);
				}
				this.loading = false;
			},
			error: (error) => {
				this.mostrarError('Error al conectar con el servidor');
				this.loading = false;
				console.error('Error:', error);
			},
		});
	}

	// ===== CONFIGURACIÓN DE FILTROS =====
	configurarFiltros(): void {
		// Configurar filtro personalizado
		this.dataSource.filterPredicate = (
			data: TipoMobiliario,
			filter: string,
		) => {
			const filtros = JSON.parse(filter);

			// Filtro por texto
			const cumpleFiltroTexto =
				!filtros.texto ||
				data.descripcion.toLowerCase().includes(filtros.texto.toLowerCase());

			// Filtro por estado
			let cumpleFiltroEstado = true;
			if (filtros.estado === 'activo') {
				cumpleFiltroEstado = data.activo === true;
			} else if (filtros.estado === 'inactivo') {
				cumpleFiltroEstado = data.activo === false;
			}

			return cumpleFiltroTexto && cumpleFiltroEstado;
		};
	}

	// ===== MÉTODOS DE FILTRADO =====
	aplicarFiltros(): void {
		const filtros = {
			texto: this.filtroTexto.trim(),
			estado: this.filtroEstado,
		};

		this.dataSource.filter = JSON.stringify(filtros);

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	limpiarFiltros(): void {
		this.filtroTexto = '';
		this.filtroEstado = 'todos';
		this.aplicarFiltros();
	}

	// ===== ACTUALIZACIÓN DE TABLA =====
	actualizarTabla(): void {
		this.dataSource.data = this.tiposMobiliario;
		this.aplicarFiltros();
	}

	// ===== OPERACIONES CRUD =====

	/**
	 * 🆕 Abrir diálogo para crear nuevo tipo de mobiliario
	 */
	crearTipoMobiliario(): void {
		const config: DynamicFormConfig = {
			title: 'Nuevo Tipo de Mobiliario',
			subtitle: 'Complete la información del tipo de mobiliario',
			fields: [
				{
					type: 'text',
					key: 'descripcion',
					label: 'Descripción',
					placeholder: 'Ej: Sillas, Mesas, Manteles, etc.',
					icon: 'chair',
					required: true,
					minLength: 2,
					maxLength: 100,
				},
			],
			confirmButtonText: 'Crear',
			cancelButtonText: 'Cancelar',
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			width: '500px',
			disableClose: true,
			data: config,
		});

		dialogRef.afterClosed().subscribe((resultado) => {
			if (resultado?.confirmed) {
				this.loading = true;

				const dto: CrearTipoMobiliarioDto = {
					descripcion: resultado.data.descripcion,
				};

				this.tiposMobiliarioService.crearTipoMobiliario(dto).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarExito(response.message);
							this.cargarTiposMobiliario();
						} else {
							this.mostrarError(response.message);
						}
						this.loading = false;
					},
					error: (error) => {
						this.mostrarError('Error al crear tipo de mobiliario');
						this.loading = false;
						console.error('Error:', error);
					},
				});
			}
		});
	}

	/**
	 * ✏️ Abrir diálogo para editar tipo de mobiliario
	 */
	editarTipoMobiliario(tipoMobiliario: TipoMobiliario): void {
		const config: DynamicFormConfig = {
			title: 'Editar Tipo de Mobiliario',
			subtitle: 'Modifique la información del tipo de mobiliario',
			fields: [
				{
					type: 'text',
					key: 'descripcion',
					label: 'Descripción',
					placeholder: 'Ej: Sillas, Mesas, Manteles, etc.',
					icon: 'chair',
					required: true,
					minLength: 2,
					maxLength: 100,
					value: tipoMobiliario.descripcion,
				},
			],
			confirmButtonText: 'Actualizar',
			cancelButtonText: 'Cancelar',
		};

		const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
			width: '500px',
			disableClose: true,
			data: config,
		});

		dialogRef.afterClosed().subscribe((resultado) => {
			if (resultado?.confirmed) {
				this.loading = true;

				const dto: ActualizarTipoMobiliarioDto = {
					id: tipoMobiliario.id,
					descripcion: resultado.data.descripcion,
				};

				this.tiposMobiliarioService.actualizarTipoMobiliario(dto).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarExito(response.message);
							this.cargarTiposMobiliario();
						} else {
							this.mostrarError(response.message);
						}
						this.loading = false;
					},
					error: (error) => {
						this.mostrarError('Error al actualizar tipo de mobiliario');
						this.loading = false;
						console.error('Error:', error);
					},
				});
			}
		});
	}

	/**
	 * 🗑️ Confirmar y eliminar tipo de mobiliario
	 */
	eliminarTipoMobiliario(tipoMobiliario: TipoMobiliario): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				titulo: 'Confirmar Eliminación',
				mensaje: `¿Está seguro de que desea eliminar el tipo de mobiliario "${tipoMobiliario.descripcion}"?`,
				textoConfirmar: 'Eliminar',
				textoCancel: 'Cancelar',
			},
		});

		dialogRef.afterClosed().subscribe((resultado) => {
			if (resultado) {
				this.loading = true;

				this.tiposMobiliarioService
					.eliminarTipoMobiliario(tipoMobiliario.id)
					.subscribe({
						next: (response) => {
							if (response.success) {
								this.mostrarExito(response.message);
								this.cargarTiposMobiliario();
							} else {
								this.mostrarError(response.message);
							}
							this.loading = false;
						},
						error: (error) => {
							this.mostrarError('Error al eliminar tipo de mobiliario');
							this.loading = false;
							console.error('Error:', error);
						},
					});
			}
		});
	}

	/**
	 * 🔄 Alternar estado activo/inactivo
	 */
	alternarEstado(tipoMobiliario: TipoMobiliario): void {
		this.loading = true;

		this.tiposMobiliarioService.alternarEstado(tipoMobiliario.id).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarExito(response.message);
					this.cargarTiposMobiliario();
				} else {
					this.mostrarError(response.message);
				}
				this.loading = false;
			},
			error: (error) => {
				this.mostrarError('Error al cambiar estado');
				this.loading = false;
				console.error('Error:', error);
			},
		});
	}

	// ===== IMPORTACIÓN/EXPORTACIÓN CSV =====

	/**
	 * 📥 Abrir selector de archivo para importar CSV
	 */
	abrirImportarCSV(): void {
		// TODO: Implement CSV import functionality
		this.fileInput.nativeElement.click();
	}

	/**
	 * 📥 Procesar archivo CSV seleccionado
	 */
	procesarArchivoCSV(event: Event): void {
		const archivo = (event.target as HTMLInputElement).files?.[0];

		if (!archivo) return;

		if (!archivo.name.toLowerCase().endsWith('.csv')) {
			this.mostrarError('Por favor seleccione un archivo CSV válido');
			return;
		}

		// TODO: Implement actual CSV processing
		this.mostrarInfo('Funcionalidad de importación CSV en desarrollo');

		// Reset file input
		this.fileInput.nativeElement.value = '';
	}

	/**
	 * 📤 Exportar datos a CSV
	 */
	exportarCSV(): void {
		if (this.tiposMobiliario.length === 0) {
			this.mostrarInfo('No hay datos para exportar');
			return;
		}

		this.loading = true;

		this.tiposMobiliarioService.exportarACSV().subscribe({
			next: (blob) => {
				// Crear enlace de descarga
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `tipos-mobiliario-${new Date().toISOString().split('T')[0]}.csv`;
				link.click();

				// Limpiar URL objeto
				window.URL.revokeObjectURL(url);

				this.mostrarExito('Archivo CSV descargado exitosamente');
				this.loading = false;
			},
			error: (error) => {
				this.mostrarError('Error al exportar datos');
				this.loading = false;
				console.error('Error:', error);
			},
		});
	}

	// ===== MÉTODOS DE UTILIDAD =====

	private mostrarExito(mensaje: string): void {
		this.snackBar.open(mensaje, 'Cerrar', {
			duration: 3000,
			panelClass: ['success-snackbar'],
		});
	}

	private mostrarError(mensaje: string): void {
		this.snackBar.open(mensaje, 'Cerrar', {
			duration: 5000,
			panelClass: ['error-snackbar'],
		});
	}

	private mostrarInfo(mensaje: string): void {
		this.snackBar.open(mensaje, 'Cerrar', {
			duration: 3000,
			panelClass: ['info-snackbar'],
		});
	}

	// ===== GETTERS PARA TEMPLATE =====

	get tieneResultados(): boolean {
		return this.dataSource.filteredData.length > 0;
	}

	get totalFiltrados(): number {
		return this.dataSource.filteredData.length;
	}

	get totalRegistros(): number {
		return this.tiposMobiliario.length;
	}
}
