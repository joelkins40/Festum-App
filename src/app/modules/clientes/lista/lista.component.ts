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
	Cliente,
	CrearClienteDto,
	ActualizarClienteDto,
} from './cliente.model';
import { ClientesService } from './clientes.service';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClienteDialogComponent } from './cliente-dialog/cliente-dialog.component';

@Component({
	selector: 'app-lista',
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
	templateUrl: './lista.component.html',
	styleUrl: './lista.component.scss',
})
export class ListaComponent implements OnInit {
	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<Cliente>([]);
	columnasDisplayed: string[] = [
		'id',
		'nombre',
		'direccion',
		'clientePreferente',
		'fechaCreacion',
		'activo',
		'acciones',
	];

	// ===== FILTROS =====
	filtroTexto = '';
	filtroClientePreferente = 'todos'; // 'todos', 'preferente', 'regular'

	// Opciones para el filtro de cliente preferente
	opcionesClientePreferente = [
		{ value: 'todos', label: 'Todos los clientes' },
		{ value: 'preferente', label: 'Solo clientes preferentes' },
		{ value: 'regular', label: 'Solo clientes regulares' },
	];

	// ===== ESTADOS =====
	loading = false;
	clientes: Cliente[] = [];

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('fileInput') fileInput!: ElementRef;

	constructor(
		private clientesService: ClientesService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.cargarClientes();
		this.configurarFiltros();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	// ===== CARGA DE DATOS =====
	cargarClientes(): void {
		this.loading = true;

		this.clientesService.getClientes().subscribe({
			next: (response) => {
				if (response.success && response.data) {
					this.clientes = response.data as Cliente[];
					this.actualizarTabla();
				} else {
					this.mostrarError('Error al cargar clientes: ' + response.message);
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
		this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
			const filtros = JSON.parse(filter);

			// Filtro por texto (nombre)
			const cumpleFiltroTexto =
				!filtros.texto ||
				data.nombre.toLowerCase().includes(filtros.texto.toLowerCase());

			// Filtro por cliente preferente
			let cumpleFiltroPreferente = true;
			if (filtros.clientePreferente === 'preferente') {
				cumpleFiltroPreferente = data.clientePreferente === true;
			} else if (filtros.clientePreferente === 'regular') {
				cumpleFiltroPreferente = data.clientePreferente === false;
			}

			return cumpleFiltroTexto && cumpleFiltroPreferente;
		};
	}

	// ===== MÉTODOS DE FILTRADO =====
	aplicarFiltros(): void {
		const filtros = {
			texto: this.filtroTexto.trim(),
			clientePreferente: this.filtroClientePreferente,
		};

		this.dataSource.filter = JSON.stringify(filtros);

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	limpiarFiltros(): void {
		this.filtroTexto = '';
		this.filtroClientePreferente = 'todos';
		this.aplicarFiltros();
	}

	// ===== ACTUALIZACIÓN DE TABLA =====
	actualizarTabla(): void {
		this.dataSource.data = this.clientes;
		this.aplicarFiltros();
	}

	// ===== OPERACIONES CRUD =====

	/**
	 * 🆕 Abrir diálogo para crear nuevo cliente
	 */
	crearCliente(): void {
		const dialogRef = this.dialog.open(ClienteDialogComponent, {
			width: '1200px',
			disableClose: true,
			data: {
				modo: 'crear',
				titulo: 'Nuevo Cliente',
			},
		});

		dialogRef.afterClosed().subscribe((resultado) => {
			if (resultado) {
				this.loading = true;

				const dto: CrearClienteDto = {
					nombre: resultado.nombre,
					direcciones: resultado.direcciones,
					clientePreferente: resultado.clientePreferente,
				};

				this.clientesService.crearCliente(dto).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarExito(response.message);
							this.cargarClientes();
						} else {
							this.mostrarError(response.message);
						}
						this.loading = false;
					},
					error: (error) => {
						this.mostrarError('Error al crear cliente');
						this.loading = false;
						console.error('Error:', error);
					},
				});
			}
		});
	}

	/**
	 * ✏️ Abrir diálogo para editar cliente
	 */
	editarCliente(cliente: Cliente): void {
		const dialogRef = this.dialog.open(ClienteDialogComponent, {
			width: '1200px',
			disableClose: true,
			data: {
				modo: 'editar',
				cliente: { ...cliente },
				titulo: 'Editar Cliente',
			},
		});

		dialogRef.afterClosed().subscribe((resultado) => {
			if (resultado) {
				this.loading = true;

				const dto: ActualizarClienteDto = {
					id: cliente.id,
					nombre: resultado.nombre,
					direcciones: resultado.direcciones,
					clientePreferente: resultado.clientePreferente,
				};

				this.clientesService.actualizarCliente(dto).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarExito(response.message);
							this.cargarClientes();
						} else {
							this.mostrarError(response.message);
						}
						this.loading = false;
					},
					error: (error) => {
						this.mostrarError('Error al actualizar cliente');
						this.loading = false;
						console.error('Error:', error);
					},
				});
			}
		});
	}

	/**
	 * 🗑️ Confirmar y eliminar cliente
	 */
	eliminarCliente(cliente: Cliente): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				titulo: 'Confirmar Eliminación',
				mensaje: `¿Está seguro de que desea eliminar el cliente "${cliente.nombre}"?`,
				textoConfirmar: 'Eliminar',
				textoCancel: 'Cancelar',
			},
		});

		dialogRef.afterClosed().subscribe((resultado) => {
			if (resultado) {
				this.loading = true;

				this.clientesService.eliminarCliente(cliente.id).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarExito(response.message);
							this.cargarClientes();
						} else {
							this.mostrarError(response.message);
						}
						this.loading = false;
					},
					error: (error) => {
						this.mostrarError('Error al eliminar cliente');
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
	alternarEstado(cliente: Cliente): void {
		this.loading = true;

		this.clientesService.alternarEstado(cliente.id).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarExito(response.message);
					this.cargarClientes();
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
		if (this.clientes.length === 0) {
			this.mostrarInfo('No hay datos para exportar');
			return;
		}

		this.loading = true;

		this.clientesService.exportarACSV().subscribe({
			next: (blob) => {
				// Crear enlace de descarga
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
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
		return this.clientes.length;
	}
}
