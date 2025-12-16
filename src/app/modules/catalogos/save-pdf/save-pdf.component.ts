import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Angular Material Modules
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
import { MatMenuModule } from '@angular/material/menu';

// Models y Services
import {
	DocumentoPdf,
	TipoDocumento,
	TipoDocumentoLabels,
	TipoDocumentoIcons,
	formatearTamano,
	descargarPDF,
} from '../../../core/models/documento-pdf.model';
import { DocumentoPdfService } from '../../../core/services/documento-pdf.service';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DocumentoDialogComponent } from './documento-dialog/documento-dialog.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ButtonIconComponent } from '../../../shared/components/button-icon';
import { ChipComponent } from '../../../shared/components/chip';

@Component({
	selector: 'app-save-pdf',
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
		MatMenuModule,
		ButtonComponent,
		ButtonIconComponent,
		ChipComponent,
	],
	templateUrl: './save-pdf.component.html',
	styleUrl: './save-pdf.component.scss',
})
export class SavePdfComponent implements OnInit {
	// ===== SIGNALS (Angular 19) =====
	loading = signal(false);
	documentos = signal<DocumentoPdf[]>([]);
	filtroTexto = signal('');
	tipoFiltro = signal<TipoDocumento | 'TODOS'>('TODOS');

	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<DocumentoPdf>([]);
	columnasDisplayed: string[] = [
		'id',
		'nombre',
		'tipo',
		'nombreArchivo',
		'tamano',
		'fechaCreacion',
		'estado',
		'acciones',
	];

	// ===== ENUMS Y LABELS =====
	TipoDocumento = TipoDocumento;
	TipoDocumentoLabels = TipoDocumentoLabels;
	TipoDocumentoIcons = TipoDocumentoIcons;
	tiposDocumento = Object.values(TipoDocumento);

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private documentoPdfService: DocumentoPdfService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.cargarDocumentos();
		this.configurarTabla();
		this.suscribirACambios();
	}

	// ===== INICIALIZACIÓN =====

	/**
	 * ⚙️ Configurar tabla con paginador y ordenamiento
	 */
	private configurarTabla(): void {
		setTimeout(() => {
			if (this.paginator) {
				this.dataSource.paginator = this.paginator;
			}
			if (this.sort) {
				this.dataSource.sort = this.sort;
			}

			// Configurar filtro personalizado
			this.dataSource.filterPredicate = (
				data: DocumentoPdf,
				filter: string,
			) => {
				const searchText = filter.toLowerCase();
				return (
					data.nombre.toLowerCase().includes(searchText) ||
					data.nombreArchivo.toLowerCase().includes(searchText) ||
					data.descripcion?.toLowerCase().includes(searchText) ||
					false
				);
			};
		});
	}

	/**
	 * 📡 Suscribirse a cambios del servicio
	 */
	private suscribirACambios(): void {
		this.documentoPdfService.documentos$.subscribe((docs) => {
			this.documentos.set(docs);
			this.aplicarFiltros();
		});

		this.documentoPdfService.loading$.subscribe((loading) => {
			this.loading.set(loading);
		});
	}

	// ===== OPERACIONES CRUD =====

	/**
	 * 📋 Cargar documentos desde el servicio
	 */
	cargarDocumentos(): void {
		this.documentoPdfService.getDocumentos().subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Documentos cargados exitosamente', 'success');
				}
			},
			error: (error) => {
				console.error('Error al cargar documentos:', error);
				this.mostrarMensaje('Error al cargar documentos', 'error');
			},
		});
	}

	/**
	 * 🆕 Abrir modal para crear documento
	 */
	abrirModalCrear(): void {
		const dialogRef = this.dialog.open(DocumentoDialogComponent, {
			width: '700px',
			maxHeight: '90vh',
			disableClose: false,
			data: { modo: 'crear' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.documentoPdfService.crearDocumento(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarMensaje(
								'✅ Documento creado exitosamente',
								'success',
							);
							this.cargarDocumentos();
						}
					},
					error: (error) => {
						console.error('Error al crear documento:', error);
						this.mostrarMensaje('❌ Error al crear documento', 'error');
					},
				});
			}
		});
	}

	/**
	 * ✏️ Abrir modal para editar documento
	 */
	abrirModalEditar(documento: DocumentoPdf): void {
		const dialogRef = this.dialog.open(DocumentoDialogComponent, {
			width: '700px',
			maxHeight: '90vh',
			disableClose: false,
			data: { documento, modo: 'editar' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.documentoPdfService.actualizarDocumento(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarMensaje(
								'✅ Documento actualizado exitosamente',
								'success',
							);
							this.cargarDocumentos();
						}
					},
					error: (error) => {
						console.error('Error al actualizar documento:', error);
						this.mostrarMensaje('❌ Error al actualizar documento', 'error');
					},
				});
			}
		});
	}

	/**
	 * 🗑️ Eliminar documento
	 */
	eliminarDocumento(documento: DocumentoPdf): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '450px',
			data: {
				titulo: 'Confirmar eliminación',
				mensaje: `¿Está seguro que desea eliminar el documento "${documento.nombre}"?`,
				textoBotonConfirmar: 'Eliminar',
				textoBotonCancelar: 'Cancelar',
				colorBotonConfirmar: 'warn',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.documentoPdfService.eliminarDocumento(documento.id).subscribe({
					next: (response) => {
						if (response.success) {
							this.mostrarMensaje(
								'🗑️ Documento eliminado exitosamente',
								'success',
							);
							this.cargarDocumentos();
						}
					},
					error: (error) => {
						console.error('Error al eliminar documento:', error);
						this.mostrarMensaje('❌ Error al eliminar documento', 'error');
					},
				});
			}
		});
	}

	/**
	 * 🔄 Toggle estado del documento
	 */
	toggleEstado(documento: DocumentoPdf): void {
		this.documentoPdfService.toggleEstado(documento.id).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje(response.message, 'success');
					this.cargarDocumentos();
				}
			},
			error: (error) => {
				console.error('Error al cambiar estado:', error);
				this.mostrarMensaje('Error al cambiar estado', 'error');
			},
		});
	}

	// ===== ACCIONES DE DOCUMENTOS =====

	/**
	 * 👁️ Ver PDF
	 */
	verPdf(documento: DocumentoPdf): void {
		this.dialog.open(PdfViewerComponent, {
			width: '90vw',
			maxWidth: '1200px',
			height: '90vh',
			data: { documento },
		});
	}

	/**
	 * 📥 Descargar PDF
	 */
	descargarPdf(documento: DocumentoPdf): void {
		try {
			descargarPDF(documento);
			this.mostrarMensaje('📥 Descargando documento...', 'success');
		} catch (error) {
			console.error('Error al descargar PDF:', error);
			this.mostrarMensaje('Error al descargar documento', 'error');
		}
	}

	// ===== FILTROS Y BÚSQUEDA =====

	/**
	 * 🔍 Aplicar filtros de búsqueda
	 */
	aplicarFiltros(): void {
		let documentosFiltrados = [...this.documentos()];

		// Filtrar por tipo
		if (this.tipoFiltro() !== 'TODOS') {
			documentosFiltrados = documentosFiltrados.filter(
				(doc) => doc.tipoDocumento === this.tipoFiltro(),
			);
		}

		// Aplicar filtro de texto
		this.dataSource.data = documentosFiltrados;
		this.dataSource.filter = this.filtroTexto().trim().toLowerCase();
	}

	/**
	 * 🔍 Aplicar filtro de texto
	 */
	aplicarFiltroTexto(): void {
		this.aplicarFiltros();
	}

	/**
	 * 🔄 Limpiar filtros
	 */
	limpiarFiltros(): void {
		this.filtroTexto.set('');
		this.tipoFiltro.set('TODOS');
		this.aplicarFiltros();
	}

	// ===== UTILIDADES =====

	/**
	 * 📏 Formatear tamaño de archivo
	 */
	formatearTamano(bytes: number): string {
		return formatearTamano(bytes);
	}

	/**
	 * 🎨 Obtener color del chip de tipo
	 */
	getColorTipo(tipo: TipoDocumento): string {
		const colores: Record<TipoDocumento, string> = {
			[TipoDocumento.CONTRATO]: 'primary',
			[TipoDocumento.COTIZACION]: 'accent',
			[TipoDocumento.FACTURA]: 'warn',
			[TipoDocumento.RECIBO]: 'primary',
			[TipoDocumento.ORDEN_COMPRA]: 'accent',
			[TipoDocumento.MANUAL]: 'primary',
			[TipoDocumento.PLANTILLA]: 'accent',
			[TipoDocumento.OTRO]: 'primary',
		};
		return colores[tipo] || 'primary';
	}

	/**
	 * 📋 Obtener icono de tipo de documento
	 */
	getTipoIcon(tipo: TipoDocumento): string {
		return TipoDocumentoIcons[tipo] || 'insert_drive_file';
	}

	/**
	 * 🏷️ Obtener label de tipo de documento
	 */
	getTipoLabel(tipo: TipoDocumento): string {
		return TipoDocumentoLabels[tipo] || 'Otro';
	}

	/**
	 * 💬 Mostrar mensaje usando snackbar
	 */
	private mostrarMensaje(
		mensaje: string,
		tipo: 'success' | 'error' | 'info',
	): void {
		const config = {
			duration: 3000,
			horizontalPosition: 'end' as const,
			verticalPosition: 'top' as const,
			panelClass: [`snackbar-${tipo}`],
		};

		this.snackBar.open(mensaje, 'Cerrar', config);
	}
}
