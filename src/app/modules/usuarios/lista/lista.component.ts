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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// Interfaz Usuario
export interface Usuario {
	id: number;
	nombre: string;
	correo: string;
	rol: string;
	estado: 'Activo' | 'Inactivo';
}

@Component({
	selector: 'app-lista',
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
	],
	templateUrl: './lista.component.html',
	styleUrl: './lista.component.scss',
})
export class ListaComponent implements OnInit {
	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<Usuario>([]);
	columnasDisplayed: string[] = [
		'id',
		'nombre',
		'correo',
		'rol',
		'estado',
		'acciones',
	];
	filtroTexto = '';

	// ===== ESTADOS =====
	loading = false;
	usuarios: Usuario[] = [];

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.cargarUsuarios();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.configurarFiltro();
	}

	// ===== CARGA DE DATOS =====

	/**
	 * 📊 Cargar usuarios (datos mock)
	 */
	cargarUsuarios(): void {
		this.loading = true;

		// Simulamos una carga asíncrona
		setTimeout(() => {
			this.usuarios = [
				{
					id: 1,
					nombre: 'Juan Pérez',
					correo: 'juan.perez@festum.com',
					rol: 'Administrador',
					estado: 'Activo',
				},
				{
					id: 2,
					nombre: 'María García',
					correo: 'maria.garcia@festum.com',
					rol: 'Gerente',
					estado: 'Activo',
				},
				{
					id: 3,
					nombre: 'Carlos López',
					correo: 'carlos.lopez@festum.com',
					rol: 'Vendedor',
					estado: 'Activo',
				},
				{
					id: 4,
					nombre: 'Ana Martínez',
					correo: 'ana.martinez@festum.com',
					rol: 'Coordinador',
					estado: 'Activo',
				},
				{
					id: 5,
					nombre: 'Luis Rodríguez',
					correo: 'luis.rodriguez@festum.com',
					rol: 'Vendedor',
					estado: 'Inactivo',
				},
				{
					id: 6,
					nombre: 'Laura Hernández',
					correo: 'laura.hernandez@festum.com',
					rol: 'Asistente',
					estado: 'Activo',
				},
				{
					id: 7,
					nombre: 'Roberto Sánchez',
					correo: 'roberto.sanchez@festum.com',
					rol: 'Gerente',
					estado: 'Activo',
				},
				{
					id: 8,
					nombre: 'Patricia Torres',
					correo: 'patricia.torres@festum.com',
					rol: 'Vendedor',
					estado: 'Inactivo',
				},
				{
					id: 9,
					nombre: 'Diego Ramírez',
					correo: 'diego.ramirez@festum.com',
					rol: 'Coordinador',
					estado: 'Activo',
				},
				{
					id: 10,
					nombre: 'Carmen Flores',
					correo: 'carmen.flores@festum.com',
					rol: 'Asistente',
					estado: 'Activo',
				},
			];

			this.dataSource.data = this.usuarios;
			this.loading = false;
		}, 800);
	}

	// ===== FILTRADO =====

	/**
	 * 🔍 Configurar filtro personalizado
	 */
	private configurarFiltro(): void {
		this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
			const searchStr = filter.toLowerCase();
			return (
				data.nombre.toLowerCase().includes(searchStr) ||
				data.correo.toLowerCase().includes(searchStr) ||
				data.rol.toLowerCase().includes(searchStr)
			);
		};
	}

	/**
	 * 🔎 Aplicar filtro de búsqueda
	 */
	aplicarFiltro(): void {
		this.dataSource.filter = this.filtroTexto.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	// ===== ACCIONES =====

	/**
	 * ➕ Abrir modal para agregar nuevo usuario
	 */
	agregarUsuario(): void {
		this.mostrarMensaje('Función "Agregar Usuario" en desarrollo');
	}

	/**
	 * ✏️ Editar usuario
	 */
	editarUsuario(usuario: Usuario): void {
		this.mostrarMensaje(`Editando usuario: ${usuario.nombre}`);
	}

	/**
	 * 🗑️ Eliminar usuario con confirmación
	 */
	eliminarUsuario(usuario: Usuario): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Confirmar eliminación',
				message: `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre}"?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				// Simulamos eliminación
				this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
				this.dataSource.data = this.usuarios;
				this.mostrarMensaje(
					`Usuario "${usuario.nombre}" eliminado exitosamente`,
				);
			}
		});
	}

	// ===== UTILIDADES =====

	/**
	 * 📌 TrackBy para optimizar rendimiento
	 */
	trackByUsuarioId(_index: number, usuario: Usuario): number {
		return usuario.id;
	}

	/**
	 * 📢 Mostrar mensaje de notificación
	 */
	private mostrarMensaje(mensaje: string): void {
		this.snackBar.open(mensaje, 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}
}
