import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
	FormsModule,
} from '@angular/forms';
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
import { Salon, CrearSalonDto, ActualizarSalonDto } from './salon.model';
import { TipoEvento } from '../../../core/models/tipo-evento.model';
import { SalonesService } from './salones.service';
import { TipoEventoService } from '../../../core/services/tipos-evento.service';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SalonDialogComponent } from './salon-dialog/salon-dialog.component';

@Component({
	selector: 'app-salones',
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
	],
	templateUrl: './salones.component.html',
	styleUrl: './salones.component.scss',
})
export class SalonesComponent implements OnInit {
	// ===== FORM Y VALIDACIONES =====
	salonForm!: FormGroup;
	esEdicion = false;
	salonSeleccionado: Salon | null = null;

	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<Salon>([]);
	columnasDisplayed: string[] = [
		'id',
		'nombre',
		'direccion',
		'capacidad',
		'tipoEvento',
		'precio',
		'telefono',
		'activo',
		'acciones',
	];
	filtroTexto = '';
	filtroTipoEvento = '';
	filtroActivo = '';

	// ===== ESTADOS =====
	loading = false;
	salones: Salon[] = [];
	tiposEvento: TipoEvento[] = [];

	// Opciones para filtros
	opcionesActivo = [
		{ value: '', label: 'Todos' },
		{ value: 'true', label: 'Activos' },
		{ value: 'false', label: 'Inactivos' },
	];

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('fileInput') fileInput!: ElementRef;

	constructor(
		private fb: FormBuilder,
		private salonesService: SalonesService,
		private tipoEventoService: TipoEventoService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {
		this.inicializarFormulario();
	}

	ngOnInit(): void {
		this.cargarDatos();
		this.configurarTabla();
		this.suscribirACambios();
	}

	// ===== INICIALIZACIÓN =====

	/**
	 * 🔧 Inicializar formulario reactivo
	 */
	private inicializarFormulario(): void {
		this.salonForm = this.fb.group({
			nombre: [
				'',
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
				],
			],
			direccion: [
				'',
				[
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(200),
				],
			],
			capacidadDePersonas: [
				0,
				[Validators.required, Validators.min(1), Validators.max(1000)],
			],
			tipoEventoId: ['', [Validators.required]],
			precioRenta: [0, [Validators.required, Validators.min(0)]],
			telefonoContacto: ['', [Validators.pattern(/^[0-9\-\s\+\(\)]+$/)]],
		});
	}

	/**
	 * ⚙️ Configurar tabla con paginador y ordenamiento
	 */
	private configurarTabla(): void {
		// Configurar después de que la vista se haya inicializado
		setTimeout(() => {
			if (this.paginator) {
				this.dataSource.paginator = this.paginator;
			}
			if (this.sort) {
				this.dataSource.sort = this.sort;
			}

			// Configurar filtro personalizado
			this.dataSource.filterPredicate = (data: Salon, filter: string) => {
				const filterObj = JSON.parse(filter);

				let matches = true;

				// Filtro por texto
				if (filterObj.texto) {
					const searchText = filterObj.texto.toLowerCase();
					matches =
						matches &&
						(data.nombre.toLowerCase().includes(searchText) ||
							data.direccion.toLowerCase().includes(searchText) ||
							data.tipoEvento.descripcion.toLowerCase().includes(searchText));
				}

				// Filtro por tipo de evento
				if (filterObj.tipoEvento) {
					matches =
						matches &&
						data.tipoEvento.id === parseInt(filterObj.tipoEvento, 10);
				}

				// Filtro por estado activo
				if (filterObj.activo !== '') {
					matches = matches && data.activo === (filterObj.activo === 'true');
				}

				return matches;
			};
		});
	}

	/**
	 * 📡 Suscribirse a cambios del servicio
	 */
	private suscribirACambios(): void {
		this.salonesService.salones$.subscribe((salones: Salon[]) => {
			this.salones = salones;
			this.dataSource.data = salones;
		});

		this.salonesService.loading$.subscribe((loading: boolean) => {
			this.loading = loading;
		});

		this.tipoEventoService.tiposEvento$.subscribe((tipos: TipoEvento[]) => {
			this.tiposEvento = tipos;
		});
	}

	// ===== OPERACIONES CRUD =====

	/**
	 * 📋 Cargar datos iniciales
	 */
	cargarDatos(): void {
		// Cargar salones
		this.salonesService
			.getSalones({
				busqueda: this.filtroTexto || undefined,
				tipoEventoId: this.filtroTipoEvento
					? parseInt(this.filtroTipoEvento, 10)
					: undefined,
				activo:
					this.filtroActivo !== '' ? this.filtroActivo === 'true' : undefined,
			})
			.subscribe({
				next: (response) => {
					if (response.success) {
						this.mostrarMensaje('Salones cargados exitosamente', 'success');
					}
				},
				error: (error) => {
					console.error('Error al cargar salones:', error);
					this.mostrarMensaje('Error al cargar salones', 'error');
				},
			});

		// Cargar tipos de evento
		this.tipoEventoService.getTiposEvento().subscribe({
			next: (response) => {
				if (!response.success) {
					console.warn('Error al cargar tipos de evento');
				}
			},
			error: (error) => {
				console.error('Error al cargar tipos de evento:', error);
			},
		});
	}

	/**
	 * 🔍 Aplicar filtros
	 */
	aplicarFiltros(): void {
		const filterValue = JSON.stringify({
			texto: this.filtroTexto.trim().toLowerCase(),
			tipoEvento: this.filtroTipoEvento,
			activo: this.filtroActivo,
		});

		this.dataSource.filter = filterValue;

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * ➕ Abrir modal para crear nuevo salón
	 */
	abrirModalCrear(): void {
		const dialogRef = this.dialog.open(SalonDialogComponent, {
			width: '700px',
			maxWidth: '95vw',
			disableClose: true,
			data: {
				modo: 'crear',
				tiposEvento: this.tiposEvento,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.crearSalon(result);
			}
		});
	}

	/**
	 * ✏️ Abrir modal para editar salón
	 */
	abrirModalEditar(salon: Salon): void {
		const dialogRef = this.dialog.open(SalonDialogComponent, {
			width: '700px',
			maxWidth: '95vw',
			disableClose: true,
			data: {
				salon: salon,
				modo: 'editar',
				tiposEvento: this.tiposEvento,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.actualizarSalon(result);
			}
		});
	}

	/**
	 * ➕ Crear nuevo salón
	 */
	private crearSalon(salonData: CrearSalonDto): void {
		this.salonesService.crearSalon(salonData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Salón creado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al crear salón',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al crear salón:', error);
				this.mostrarMensaje('Error al crear el salón', 'error');
			},
		});
	}

	/**
	 * ✏️ Actualizar salón existente
	 */
	private actualizarSalon(salonData: ActualizarSalonDto): void {
		this.salonesService.actualizarSalon(salonData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Salón actualizado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al actualizar salón',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al actualizar salón:', error);
				this.mostrarMensaje('Error al actualizar el salón', 'error');
			},
		});
	}

	/**
	 * 🗑️ Confirmar y eliminar salón
	 */
	confirmarEliminacion(salon: Salon): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '480px',
			disableClose: true,
			data: {
				title: 'Eliminar Salón',
				message: `¿Está seguro de que desea eliminar el salón "${salon.nombre}"? Esta acción no se puede deshacer.`,
				confirmText: 'Eliminar Salón',
				cancelText: 'Cancelar',
				type: 'danger',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.eliminarSalon(salon.id);
			}
		});
	}

	/**
	 * 🗑️ Eliminar salón
	 */
	private eliminarSalon(id: number): void {
		this.salonesService.eliminarSalon(id).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Salón eliminado exitosamente', 'success');

					// Si estaba editando este salón, cancelar edición
					if (this.salonSeleccionado?.id === id) {
						this.cancelarEdicion();
					}
				} else {
					this.mostrarMensaje(
						response.message || 'Error al eliminar salón',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al eliminar salón:', error);
				this.mostrarMensaje('Error al eliminar el salón', 'error');
			},
		});
	}

	// ===== UTILIDADES DEL FORMULARIO =====

	/**
	 * 🧹 Limpiar formulario
	 */
	limpiarFormulario(): void {
		this.salonForm.reset();
		this.cancelarEdicion();
	}

	/**
	 * ❌ Cancelar edición
	 */
	cancelarEdicion(): void {
		this.esEdicion = false;
		this.salonSeleccionado = null;
		this.limpiarFormulario();
	}

	// ===== IMPORTAR/EXPORTAR CSV =====

	/**
	 * 📥 Abrir selector de archivo para importar
	 */
	abrirImportador(): void {
		this.fileInput.nativeElement.click();
	}

	/**
	 * 📁 Procesar archivo CSV seleccionado
	 */
	procesarArchivoCSV(event: Event): void {
		const target = event.target as HTMLInputElement;
		const archivo = target.files?.[0];
		if (archivo && archivo.type === 'text/csv') {
			this.salonesService.importarDesdeCSV(archivo).subscribe({
				next: (response) => {
					if (response.success) {
						this.mostrarMensaje(
							response.message || 'Archivo CSV importado exitosamente',
							'success',
						);
						// Resetear el input file
						this.fileInput.nativeElement.value = '';
					} else {
						this.mostrarMensaje(
							response.message || 'Error al importar CSV',
							'error',
						);
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

	/**
	 * 📤 Exportar salones a CSV
	 */
	exportarCSV(): void {
		this.salonesService.exportarACSV().subscribe({
			next: (blob) => {
				// Crear enlace de descarga
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `salones_${new Date().toISOString().split('T')[0]}.csv`;
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

	// ===== UTILIDADES =====

	/**
	 * 📢 Mostrar mensaje con SnackBar
	 */
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

	/**
	 * 🎯 Getter para facilitar acceso a controles del formulario
	 */
	get f() {
		return this.salonForm.controls;
	}
}
