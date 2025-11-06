import {
	Component,
	DestroyRef,
	inject,
	OnInit,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { MatBadgeModule } from '@angular/material/badge';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
	RolDialogComponent,
	RolDialogData,
} from './rol-dialog/rol-dialog.component';
import {
	PermisosDialogComponent,
	PermisosDialogData,
} from './permisos-dialog/permisos-dialog.component';

// Interfaces
export interface Rol {
	id: number;
	nombreRol: string;
	descripcion: string;
	numeroDeUsuariosAsignados: number;
	permisos?: string[];
}

export interface Permiso {
	id: string;
	nombre: string;
	descripcion: string;
	categoria: string;
	activo: boolean;
}

@Component({
	selector: 'app-roles-permisos',
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
		MatBadgeModule,
	],
	templateUrl: './roles-permisos.component.html',
	styleUrl: './roles-permisos.component.scss',
})
export class RolesPermisosComponent implements OnInit {
	// ===== TABLA Y DATOS =====
	dataSource = new MatTableDataSource<Rol>([]);
	columnasDisplayed: string[] = [
		'id',
		'nombreRol',
		'descripcion',
		'numeroDeUsuariosAsignados',
		'acciones',
	];
	filtroTexto = '';

	// ===== ESTADOS =====
	loading = false;
	roles: Rol[] = [];
	todosLosPermisos: Permiso[] = [];

	// ===== VIEW CHILDREN =====
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	// ===== INJECT DEPENDENCIES =====
	private readonly destroyRef = inject(DestroyRef);

	constructor(
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.inicializarPermisos();
		this.cargarRoles();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.configurarFiltro();
	}

	// ===== INICIALIZACIÓN =====

	/**
	 * 🔐 Inicializar permisos disponibles en el sistema
	 */
	private inicializarPermisos(): void {
		this.todosLosPermisos = [
			// Usuarios
			{
				id: 'usuarios.ver',
				nombre: 'Ver Usuarios',
				descripcion: 'Visualizar lista de usuarios del sistema',
				categoria: 'Usuarios',
				activo: true,
			},
			{
				id: 'usuarios.crear',
				nombre: 'Crear Usuarios',
				descripcion: 'Agregar nuevos usuarios al sistema',
				categoria: 'Usuarios',
				activo: true,
			},
			{
				id: 'usuarios.editar',
				nombre: 'Editar Usuarios',
				descripcion: 'Modificar información de usuarios existentes',
				categoria: 'Usuarios',
				activo: true,
			},
			{
				id: 'usuarios.eliminar',
				nombre: 'Eliminar Usuarios',
				descripcion: 'Eliminar usuarios del sistema',
				categoria: 'Usuarios',
				activo: true,
			},
			// Roles
			{
				id: 'roles.gestionar',
				nombre: 'Gestionar Roles',
				descripcion: 'Crear, editar y eliminar roles y permisos',
				categoria: 'Roles',
				activo: true,
			},
			{
				id: 'roles.ver',
				nombre: 'Ver Roles',
				descripcion: 'Visualizar roles y sus permisos',
				categoria: 'Roles',
				activo: true,
			},
			// Eventos
			{
				id: 'eventos.ver',
				nombre: 'Ver Eventos',
				descripcion: 'Visualizar lista de eventos',
				categoria: 'Eventos',
				activo: true,
			},
			{
				id: 'eventos.gestionar',
				nombre: 'Gestionar Eventos',
				descripcion: 'Crear, editar y eliminar eventos',
				categoria: 'Eventos',
				activo: true,
			},
			// Cotizaciones
			{
				id: 'cotizaciones.ver',
				nombre: 'Ver Cotizaciones',
				descripcion: 'Visualizar cotizaciones del sistema',
				categoria: 'Cotizaciones',
				activo: true,
			},
			{
				id: 'cotizaciones.crear',
				nombre: 'Crear Cotizaciones',
				descripcion: 'Generar nuevas cotizaciones',
				categoria: 'Cotizaciones',
				activo: true,
			},
			{
				id: 'cotizaciones.editar',
				nombre: 'Editar Cotizaciones',
				descripcion: 'Modificar cotizaciones existentes',
				categoria: 'Cotizaciones',
				activo: true,
			},
			{
				id: 'cotizaciones.gestionar',
				nombre: 'Gestionar Cotizaciones',
				descripcion: 'Control completo sobre cotizaciones',
				categoria: 'Cotizaciones',
				activo: true,
			},
			// Clientes
			{
				id: 'clientes.ver',
				nombre: 'Ver Clientes',
				descripcion: 'Visualizar información de clientes',
				categoria: 'Clientes',
				activo: true,
			},
			{
				id: 'clientes.gestionar',
				nombre: 'Gestionar Clientes',
				descripcion: 'Crear, editar y eliminar clientes',
				categoria: 'Clientes',
				activo: true,
			},
			// Reportes
			{
				id: 'reportes.ver',
				nombre: 'Ver Reportes',
				descripcion: 'Visualizar reportes y estadísticas',
				categoria: 'Reportes',
				activo: true,
			},
			{
				id: 'reportes.generar',
				nombre: 'Generar Reportes',
				descripcion: 'Crear y exportar reportes personalizados',
				categoria: 'Reportes',
				activo: true,
			},
			// Servicios
			{
				id: 'servicios.gestionar',
				nombre: 'Gestionar Servicios',
				descripcion: 'Administrar servicios disponibles',
				categoria: 'Servicios',
				activo: true,
			},
			// Calendario
			{
				id: 'calendario.ver',
				nombre: 'Ver Calendario',
				descripcion: 'Visualizar calendario de eventos',
				categoria: 'Calendario',
				activo: true,
			},
			{
				id: 'calendario.gestionar',
				nombre: 'Gestionar Calendario',
				descripcion: 'Administrar eventos en el calendario',
				categoria: 'Calendario',
				activo: true,
			},
			// Dashboard
			{
				id: 'dashboard.ver',
				nombre: 'Ver Dashboard',
				descripcion: 'Acceso al panel principal',
				categoria: 'Dashboard',
				activo: true,
			},
		];
	}

	// ===== CARGA DE DATOS =====

	/**
	 * 📊 Cargar roles (datos mock)
	 */
	cargarRoles(): void {
		this.loading = true;

		// Simulamos una carga asíncrona
		setTimeout(() => {
			this.roles = [
				{
					id: 1,
					nombreRol: 'Administrador',
					descripcion:
						'Acceso completo a todas las funcionalidades del sistema',
					numeroDeUsuariosAsignados: 3,
					permisos: [
						'usuarios.crear',
						'usuarios.editar',
						'usuarios.eliminar',
						'roles.gestionar',
						'eventos.gestionar',
						'cotizaciones.gestionar',
					],
				},
				{
					id: 2,
					nombreRol: 'Gerente',
					descripcion:
						'Gestión de eventos, cotizaciones y visualización de reportes',
					numeroDeUsuariosAsignados: 5,
					permisos: [
						'eventos.gestionar',
						'cotizaciones.gestionar',
						'reportes.ver',
						'clientes.gestionar',
					],
				},
				{
					id: 3,
					nombreRol: 'Supervisor',
					descripcion: 'Supervisión de operaciones y gestión de personal',
					numeroDeUsuariosAsignados: 4,
					permisos: ['eventos.ver', 'usuarios.ver', 'reportes.ver'],
				},
				{
					id: 4,
					nombreRol: 'Vendedor',
					descripcion: 'Creación de cotizaciones y gestión de clientes',
					numeroDeUsuariosAsignados: 8,
					permisos: [
						'cotizaciones.crear',
						'cotizaciones.editar',
						'clientes.gestionar',
					],
				},
				{
					id: 5,
					nombreRol: 'Coordinador',
					descripcion: 'Coordinación de eventos y servicios',
					numeroDeUsuariosAsignados: 6,
					permisos: [
						'eventos.gestionar',
						'servicios.gestionar',
						'calendario.gestionar',
					],
				},
				{
					id: 6,
					nombreRol: 'Asistente',
					descripcion: 'Soporte general y tareas administrativas básicas',
					numeroDeUsuariosAsignados: 10,
					permisos: ['clientes.ver', 'eventos.ver', 'calendario.ver'],
				},
				{
					id: 7,
					nombreRol: 'Invitado',
					descripcion: 'Acceso limitado solo de lectura',
					numeroDeUsuariosAsignados: 2,
					permisos: ['dashboard.ver'],
				},
			];

			this.dataSource.data = this.roles;
			this.loading = false;
		}, 800);
	}

	// ===== FILTRADO =====

	/**
	 * 🔍 Configurar filtro personalizado
	 */
	private configurarFiltro(): void {
		this.dataSource.filterPredicate = (data: Rol, filter: string) => {
			const searchStr = filter.toLowerCase();
			return (
				data.nombreRol.toLowerCase().includes(searchStr) ||
				data.descripcion.toLowerCase().includes(searchStr)
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
	 * ➕ Abrir modal para agregar nuevo rol
	 */
	agregarRol(): void {
		const dialogData: RolDialogData = {
			modo: 'crear',
		};

		const dialogRef = this.dialog.open(RolDialogComponent, {
			width: '600px',
			maxWidth: '95vw',
			disableClose: false,
			data: dialogData,
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result) => {
				if (result) {
					this.crearNuevoRol(result);
				}
			});
	}

	/**
	 * ✏️ Editar rol
	 */
	editarRol(rol: Rol): void {
		const dialogData: RolDialogData = {
			modo: 'editar',
			rol: rol,
		};

		const dialogRef = this.dialog.open(RolDialogComponent, {
			width: '600px',
			maxWidth: '95vw',
			disableClose: false,
			data: dialogData,
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result) => {
				if (result) {
					this.actualizarRolExistente(result);
				}
			});
	}

	/**
	 * 🧩 Gestionar permisos del rol
	 */
	gestionarPermisos(rol: Rol): void {
		const dialogData: PermisosDialogData = {
			rol: rol,
			todosLosPermisos: this.todosLosPermisos,
		};

		const dialogRef = this.dialog.open(PermisosDialogComponent, {
			width: '800px',
			maxWidth: '95vw',
			maxHeight: '90vh',
			disableClose: false,
			data: dialogData,
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result) => {
				if (result) {
					this.actualizarPermisosRol(result);
				}
			});
	}

	/**
	 * 💾 Crear nuevo rol
	 */
	private crearNuevoRol(data: {
		nombreRol: string;
		descripcion: string;
	}): void {
		// Generar nuevo ID
		const nuevoId =
			this.roles.length > 0 ? Math.max(...this.roles.map((r) => r.id)) + 1 : 1;

		const nuevoRol: Rol = {
			id: nuevoId,
			nombreRol: data.nombreRol,
			descripcion: data.descripcion,
			numeroDeUsuariosAsignados: 0,
			permisos: [],
		};

		// Agregar al inicio del array
		this.roles.unshift(nuevoRol);
		this.dataSource.data = this.roles;

		this.mostrarMensaje(`Rol "${data.nombreRol}" creado exitosamente`);
	}

	/**
	 * 🔄 Actualizar rol existente
	 */
	private actualizarRolExistente(data: {
		id: number;
		nombreRol: string;
		descripcion: string;
	}): void {
		const index = this.roles.findIndex((r) => r.id === data.id);
		if (index !== -1) {
			this.roles[index] = {
				...this.roles[index],
				nombreRol: data.nombreRol,
				descripcion: data.descripcion,
			};

			this.dataSource.data = this.roles;
			this.mostrarMensaje(`Rol "${data.nombreRol}" actualizado exitosamente`);
		}
	}

	/**
	 * 🔐 Actualizar permisos de un rol
	 */
	private actualizarPermisosRol(data: {
		rolId: number;
		permisos: string[];
	}): void {
		const index = this.roles.findIndex((r) => r.id === data.rolId);
		if (index !== -1) {
			this.roles[index].permisos = data.permisos;
			this.dataSource.data = this.roles;
			this.mostrarMensaje(
				`Permisos actualizados para "${this.roles[index].nombreRol}"`,
			);
		}
	}

	/**
	 * 🗑️ Eliminar rol con confirmación
	 */
	eliminarRol(rol: Rol): void {
		// Verificar si el rol tiene usuarios asignados
		if (rol.numeroDeUsuariosAsignados > 0) {
			this.mostrarMensaje(
				`No se puede eliminar el rol "${rol.nombreRol}" porque tiene ${rol.numeroDeUsuariosAsignados} usuario(s) asignado(s)`,
			);
			return;
		}

		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Confirmar eliminación',
				message: `¿Estás seguro de que deseas eliminar el rol "${rol.nombreRol}"?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar',
			},
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result) => {
				if (result) {
					// Simulamos eliminación
					this.roles = this.roles.filter((r) => r.id !== rol.id);
					this.dataSource.data = this.roles;
					this.mostrarMensaje(`Rol "${rol.nombreRol}" eliminado exitosamente`);
				}
			});
	}

	// ===== UTILIDADES =====

	/**
	 * 📌 TrackBy para optimizar rendimiento
	 */
	trackByRolId(_index: number, rol: Rol): number {
		return rol.id;
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
