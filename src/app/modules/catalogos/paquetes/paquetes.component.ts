import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PaquetesService } from '../../../core/services/paquetes.service';
import type { Paquete } from '../../../core/models/paquete.model';
import { PaqueteDialogComponent } from './paquete-dialog/paquete-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'app-paquetes',
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatDividerModule,
		MatTooltipModule,
		MatDialogModule,
		MatSnackBarModule,
	],
	templateUrl: './paquetes.component.html',
	styleUrl: './paquetes.component.scss',
})
export class PaquetesComponent implements OnInit {
	dataSource = new MatTableDataSource<Paquete>([]);
	columnasDisplayed: string[] = [
		'id',
		'tipo',
		'nombre',
		'categoria',
		'stock',
		'precio',
		'acciones',
	];
	loading = false;
	paquetes: Paquete[] = [];

	// Filtros
	filtroTexto = '';
	filtroTipo = '';
	filtroCategoria = '';

	// Opciones para filtros
	tiposDisponibles = [
		{ value: '', label: 'Todos' },
		{ value: 'Paquete', label: 'Paquetes' },
		{ value: 'Servicio', label: 'Servicios' },
	];

	categoriasDisponibles = [
		{ value: '', label: 'Todas' },
		{ value: 'Boda', label: 'Boda' },
		{ value: 'Corporativo', label: 'Corporativo' },
		{ value: 'Lounge', label: 'Lounge' },
		{ value: 'XV Años', label: 'XV Años' },
		{ value: 'Infantil', label: 'Infantil' },
		{ value: 'Graduación', label: 'Graduación' },
	];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private paquetesService: PaquetesService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
	) {}

	ngOnInit(): void {
		this.configurarTabla();
		this.suscribirAServicio();
		this.cargarPaquetes();
	}

	private configurarTabla(): void {
		setTimeout(() => {
			if (this.paginator) this.dataSource.paginator = this.paginator;
			if (this.sort) this.dataSource.sort = this.sort;

			// Configurar filtro personalizado
			this.dataSource.filterPredicate = (data: Paquete, filter: string) => {
				const filterObj = JSON.parse(filter);

				let matches = true;

				// Filtro por texto
				if (filterObj.texto) {
					const searchText = filterObj.texto.toLowerCase();
					matches =
						matches &&
						(data.nombre.toLowerCase().includes(searchText) ||
							data.descripcionCorta.toLowerCase().includes(searchText) ||
							data.categoria.toLowerCase().includes(searchText));
				}

				// Filtro por tipo
				if (filterObj.tipo) {
					matches = matches && data.tipo === filterObj.tipo;
				}

				// Filtro por categoría
				if (filterObj.categoria) {
					matches = matches && data.categoria === filterObj.categoria;
				}

				return matches;
			};
		});
	}

	private suscribirAServicio(): void {
		this.paquetesService.paquetes$.subscribe((items: Paquete[]) => {
			this.paquetes = items;
			this.dataSource.data = items;
		});

		this.paquetesService.loading$.subscribe((l: boolean) => {
			this.loading = l;
		});
	}

	cargarPaquetes(): void {
		this.paquetesService.getPaquetes().subscribe();
	}

	/**
	 * 🔍 Aplicar filtros
	 */
	aplicarFiltros(): void {
		const filterValue = JSON.stringify({
			texto: this.filtroTexto.trim().toLowerCase(),
			tipo: this.filtroTipo,
			categoria: this.filtroCategoria,
		});

		this.dataSource.filter = filterValue;

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * ➕ Abrir modal para crear nuevo paquete
	 */
	abrirModalCrear(): void {
		const dialogRef = this.dialog.open(PaqueteDialogComponent, {
			width: '1200px',
			maxWidth: '95vw',
			height: '90vh',
			maxHeight: '900px',
			disableClose: true,
			panelClass: 'large-dialog-panel',
			data: {
				modo: 'crear',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.crearPaquete(result);
			}
		});
	}

	/**
	 * ✏️ Abrir modal para editar paquete
	 */
	editarPaquete(paquete: Paquete): void {
		const dialogRef = this.dialog.open(PaqueteDialogComponent, {
			width: '1200px',
			maxWidth: '95vw',
			height: '90vh',
			maxHeight: '900px',
			disableClose: true,
			panelClass: 'large-dialog-panel',
			data: {
				paquete: paquete,
				modo: 'editar',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.actualizarPaquete(result);
			}
		});
	}

	/**
	 * ➕ Crear nuevo paquete
	 */
	private crearPaquete(paqueteData: Paquete): void {
		this.paquetesService.crearPaquete(paqueteData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Paquete creado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al crear paquete',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al crear paquete:', error);
				this.mostrarMensaje('Error al crear el paquete', 'error');
			},
		});
	}

	/**
	 * ✏️ Actualizar paquete existente
	 */
	private actualizarPaquete(paqueteData: Paquete): void {
		this.paquetesService.actualizarPaquete(paqueteData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Paquete actualizado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al actualizar paquete',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al actualizar paquete:', error);
				this.mostrarMensaje('Error al actualizar el paquete', 'error');
			},
		});
	}

	/**
	 * 🗑️ Confirmar y eliminar paquete
	 */
	confirmarEliminacion(paquete: Paquete): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '480px',
			disableClose: true,
			data: {
				title: 'Eliminar Paquete',
				message: `¿Está seguro de que desea eliminar el paquete "${paquete.nombre}"? Esta acción no se puede deshacer.`,
				confirmText: 'Eliminar Paquete',
				cancelText: 'Cancelar',
				type: 'danger',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.eliminarPaquete(paquete.id);
			}
		});
	}

	/**
	 * 🗑️ Eliminar paquete
	 */
	private eliminarPaquete(id: number): void {
		this.paquetesService.eliminarPaquete(id).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Paquete eliminado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al eliminar paquete',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al eliminar paquete:', error);
				this.mostrarMensaje('Error al eliminar el paquete', 'error');
			},
		});
	}

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

	// Placeholder para futuras acciones (editar/ver)
	verPaquete(paquete: Paquete): void {
		// TODO: abrir detalle/diálogo
		console.log('Ver paquete', paquete);
	}
}
