import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

// Dialog Component
import { MantenimientoDialogComponent } from './mantenimiento-dialog/mantenimiento-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

export interface Mantenimiento {
	id: number;
	equipo: string;
	descripcion: string;
	fechaReporte: Date;
	tecnicoAsignado: string;
	estatus: 'Pendiente' | 'En proceso' | 'Completado';
}

@Component({
	selector: 'app-mantenimiento',
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
		MatSnackBarModule,
		MatDialogModule,
		MatChipsModule,
		MatTooltipModule,
		MatDividerModule,
	],
	templateUrl: './mantenimiento.component.html',
	styleUrl: './mantenimiento.component.scss',
})
export class MantenimientoComponent implements OnInit {
	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<Mantenimiento>([]);
	columnasDisplayed: string[] = [
		'id',
		'equipo',
		'descripcion',
		'fechaReporte',
		'tecnicoAsignado',
		'estatus',
		'acciones',
	];
	filtroTexto = '';

	// ===== ESTADOS =====
	mantenimientos: Mantenimiento[] = [];

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.cargarMantenimientos();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	// ===== CARGA DE DATOS =====

	/**
	 * 📥 Cargar mantenimientos (datos mock)
	 */
	private cargarMantenimientos(): void {
		// Mock data - simulate backend response
		this.mantenimientos = [
			{
				id: 1,
				equipo: 'Sistema de Audio JBL PRX815',
				descripcion: 'Falla intermitente en el canal derecho',
				fechaReporte: new Date(2025, 10, 1),
				tecnicoAsignado: 'Carlos Ramírez',
				estatus: 'En proceso',
			},
			{
				id: 2,
				equipo: 'Iluminación LED PAR64',
				descripcion: 'No enciende, revisar fuente de poder',
				fechaReporte: new Date(2025, 10, 3),
				tecnicoAsignado: 'Ana Martínez',
				estatus: 'Pendiente',
			},
			{
				id: 3,
				equipo: 'Mesa Redonda 10 personas',
				descripcion: 'Pata floja, requiere ajuste',
				fechaReporte: new Date(2025, 9, 28),
				tecnicoAsignado: 'Luis González',
				estatus: 'Completado',
			},
			{
				id: 4,
				equipo: 'Silla Tiffany Blanca',
				descripcion: 'Respaldo agrietado, reemplazo necesario',
				fechaReporte: new Date(2025, 10, 5),
				tecnicoAsignado: 'María López',
				estatus: 'En proceso',
			},
			{
				id: 5,
				equipo: 'Proyector Epson PowerLite',
				descripcion: 'Imagen borrosa, limpieza de lente requerida',
				fechaReporte: new Date(2025, 9, 25),
				tecnicoAsignado: 'Carlos Ramírez',
				estatus: 'Completado',
			},
			{
				id: 6,
				equipo: 'Mantelería Premium (Set 20 pzas)',
				descripcion: 'Manchas persistentes, lavado especial',
				fechaReporte: new Date(2025, 10, 2),
				tecnicoAsignado: 'Ana Martínez',
				estatus: 'Pendiente',
			},
			{
				id: 7,
				equipo: 'Sistema de Enfriamiento Industrial',
				descripcion: 'Fuga de refrigerante, reparación urgente',
				fechaReporte: new Date(2025, 10, 6),
				tecnicoAsignado: 'Luis González',
				estatus: 'En proceso',
			},
			{
				id: 8,
				equipo: 'Loza Porcelana (Juego 50 pzas)',
				descripcion: '5 platos rotos, solicitar reposición',
				fechaReporte: new Date(2025, 9, 30),
				tecnicoAsignado: 'María López',
				estatus: 'Completado',
			},
			{
				id: 9,
				equipo: 'Toldo Extensible 4x3m',
				descripcion: 'Rasgadura en lona, costura requerida',
				fechaReporte: new Date(2025, 10, 4),
				tecnicoAsignado: 'Carlos Ramírez',
				estatus: 'Pendiente',
			},
			{
				id: 10,
				equipo: 'Calentador de Alimentos Industrial',
				descripcion: 'No alcanza temperatura adecuada',
				fechaReporte: new Date(2025, 9, 27),
				tecnicoAsignado: 'Ana Martínez',
				estatus: 'Completado',
			},
		];

		this.dataSource.data = this.mantenimientos;
	}

	// ===== FILTRADO =====

	/**
	 * 🔍 Aplicar filtro de búsqueda
	 */
	aplicarFiltro(): void {
		const filterValue = this.filtroTexto.trim().toLowerCase();
		this.dataSource.filter = filterValue;

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * 🧹 Limpiar filtro de búsqueda
	 */
	limpiarFiltro(): void {
		this.filtroTexto = '';
		this.dataSource.filter = '';
	}

	// ===== DIÁLOGO =====

	/**
	 * ➕ Abrir diálogo para crear nuevo mantenimiento
	 */
	agregarMantenimiento(): void {
		const dialogRef = this.dialog.open(MantenimientoDialogComponent, {
			width: '600px',
			maxWidth: '95vw',
			disableClose: true,
			data: null,
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.crearNuevoMantenimiento(result);
			}
		});
	}

	/**
	 * ✏️ Abrir diálogo para editar mantenimiento
	 */
	editarMantenimiento(mantenimiento: Mantenimiento): void {
		const dialogRef = this.dialog.open(MantenimientoDialogComponent, {
			width: '600px',
			maxWidth: '95vw',
			disableClose: true,
			data: { ...mantenimiento },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.actualizarMantenimiento(result);
			}
		});
	}

	/**
	 * 🗑️ Eliminar mantenimiento con confirmación
	 */
	eliminarMantenimiento(mantenimiento: Mantenimiento): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Mantenimiento',
				message: `¿Está seguro que desea eliminar el registro de mantenimiento del equipo "${mantenimiento.equipo}"?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar',
			},
		});

		dialogRef.afterClosed().subscribe((confirmed) => {
			if (confirmed) {
				this.ejecutarEliminacion(mantenimiento.id);
			}
		});
	}

	// ===== OPERACIONES CRUD =====

	/**
	 * ➕ Crear nuevo mantenimiento
	 */
	private crearNuevoMantenimiento(data: Partial<Mantenimiento>): void {
		const nuevoId = Math.max(...this.mantenimientos.map((m) => m.id), 0) + 1;

		const nuevoMantenimiento: Mantenimiento = {
			id: nuevoId,
			equipo: data.equipo || '',
			descripcion: data.descripcion || '',
			fechaReporte: data.fechaReporte || new Date(),
			tecnicoAsignado: data.tecnicoAsignado || '',
			estatus: data.estatus || 'Pendiente',
		};

		this.mantenimientos.push(nuevoMantenimiento);
		this.dataSource.data = this.mantenimientos;

		this.snackBar.open('Mantenimiento registrado exitosamente', 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: ['success-snackbar'],
		});
	}

	/**
	 * ✏️ Actualizar mantenimiento existente
	 */
	private actualizarMantenimiento(data: Mantenimiento): void {
		const index = this.mantenimientos.findIndex((m) => m.id === data.id);

		if (index !== -1) {
			this.mantenimientos[index] = data;
			this.dataSource.data = this.mantenimientos;

			this.snackBar.open('Mantenimiento actualizado exitosamente', 'Cerrar', {
				duration: 3000,
				horizontalPosition: 'end',
				verticalPosition: 'top',
				panelClass: ['success-snackbar'],
			});
		}
	}

	/**
	 * 🗑️ Ejecutar eliminación del mantenimiento
	 */
	private ejecutarEliminacion(id: number): void {
		this.mantenimientos = this.mantenimientos.filter((m) => m.id !== id);
		this.dataSource.data = this.mantenimientos;

		this.snackBar.open('Mantenimiento eliminado exitosamente', 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: ['success-snackbar'],
		});
	}

	// ===== UTILIDADES =====

	/**
	 * 🎨 Obtener clase CSS según estatus
	 */
	getEstatusClass(estatus: string): string {
		switch (estatus) {
			case 'Completado':
				return 'estatus-completado';
			case 'En proceso':
				return 'estatus-en-proceso';
			case 'Pendiente':
				return 'estatus-pendiente';
			default:
				return '';
		}
	}

	/**
	 * 📅 Formatear fecha
	 */
	formatearFecha(fecha: Date): string {
		return new Date(fecha).toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	/**
	 * 🔄 TrackBy para optimizar rendimiento
	 */
	trackByMantenimiento(_index: number, item: Mantenimiento): number {
		return item.id;
	}
}
