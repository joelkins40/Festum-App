import { Component, OnInit, inject, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InvitadosMockService, Invitado } from './invitados-mock.service';
import { InvitadoDialogComponent } from './invitado-dialog.component';

export interface Evento {
	id: number;
	cliente: string;
	tipoEvento: string;
	fechaEvento: Date;
	lugar: string;
	montoTotal?: number;
}

/**
 * Componente para gestionar múltiples eventos y sus invitados
 */
@Component({
	selector: 'app-invitados',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatPaginatorModule,
		MatSortModule,
		MatChipsModule,
		MatTooltipModule,
		MatSnackBarModule,
	],
	templateUrl: './invitados.component.html',
	styleUrl: './invitados.component.scss',
})
export class InvitadosComponent implements OnInit {
	// Dependency injection usando inject()
	private readonly invitadosService = inject(InvitadosMockService);
	private readonly dialog = inject(MatDialog);
	private readonly snackBar = inject(MatSnackBar);

	// Data sources para las tablas
	eventosDataSource = new MatTableDataSource<Evento>([]);
	invitadosDataSource = new MatTableDataSource<Invitado>([]);

	// Referencias a paginador y ordenamiento para invitados
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	// Evento seleccionado actualmente
	selectedEvento: Evento | null = null;

	// Columnas para tabla de eventos
	eventosDisplayedColumns: string[] = [
		'id',
		'cliente',
		'tipoEvento',
		'fechaEvento',
		'lugar',
		'montoTotal',
		'actions',
	];

	// Columnas para tabla de invitados
	invitadosDisplayedColumns: string[] = [
		'id',
		'fullName',
		'contactPhone',
		'secondaryContactPhone',
		'email',
		'numberOfCompanions',
		'willAttend',
		'actions',
	];

	// Datos mock de eventos
	eventos: Evento[] = [
		{
			id: 1,
			cliente: 'María González',
			tipoEvento: 'Boda',
			fechaEvento: new Date('2025-12-15'),
			lugar: 'Salón Imperial',
			montoTotal: 150000,
		},
		{
			id: 2,
			cliente: 'Carlos Ramírez',
			tipoEvento: 'XV Años',
			fechaEvento: new Date('2025-11-20'),
			lugar: 'Jardín Las Rosas',
			montoTotal: 85000,
		},
		{
			id: 3,
			cliente: 'Ana Martínez',
			tipoEvento: 'Cumpleaños',
			fechaEvento: new Date('2025-12-01'),
			lugar: 'Terraza Vista Hermosa',
			montoTotal: 45000,
		},
		{
			id: 4,
			cliente: 'Roberto Silva',
			tipoEvento: 'Graduación',
			fechaEvento: new Date('2025-11-30'),
			lugar: 'Salón Real',
			montoTotal: 62000,
		},
	];

	// Estadísticas de invitados
	stats = {
		total: 0,
		confirmed: 0,
		pending: 0,
		totalCompanions: 0,
	};

	/**
	 * Inicialización del componente
	 */
	ngOnInit(): void {
		this.loadEventos();
	}

	/**
	 * Carga la lista de eventos
	 */
	loadEventos(): void {
		// Por ahora usamos datos mock, en el futuro se cargaría desde un servicio
		this.eventosDataSource.data = this.eventos;
	}

	/**
	 * Selecciona un evento y carga sus invitados
	 */
	selectEvento(evento: Evento): void {
		this.selectedEvento = evento;
		this.loadInvitadosForEvento(evento.id);
	}

	/**
	 * Carga la lista de invitados para un evento específico
	 */
	loadInvitadosForEvento(eventoId: number): void {
		// En el futuro, se filtraría por eventoId
		console.log('Cargando invitados para evento:', eventoId);

		this.invitadosService.getInvitados().subscribe({
			next: (response) => {
				if (response.success && response.data) {
					this.invitadosDataSource.data = Array.isArray(response.data)
						? response.data
						: [response.data];
					this.invitadosDataSource.paginator = this.paginator;
					this.invitadosDataSource.sort = this.sort;

					// Configurar el filtro personalizado
					this.invitadosDataSource.filterPredicate = (
						data: Invitado,
						filter: string,
					) => {
						const dataStr =
							`${data.fullName} ${data.contactPhone} ${data.email}`.toLowerCase();
						return dataStr.includes(filter);
					};

					// Cargar estadísticas
					this.loadStats();
				}
			},
			error: (error) => {
				console.error('Error al cargar invitados:', error);
				this.showMessage('Error al cargar los invitados', 'error');
			},
		});
	}

	/**
	 * Elimina un evento después de confirmación
	 */
	deleteEvento(evento: Evento): void {
		const confirmed = confirm(
			`¿Está seguro de eliminar el evento "${evento.tipoEvento} - ${evento.cliente}"?`,
		);

		if (confirmed) {
			// Eliminar del array
			this.eventos = this.eventos.filter((e) => e.id !== evento.id);
			this.eventosDataSource.data = this.eventos;

			// Si era el evento seleccionado, limpiar selección
			if (this.selectedEvento?.id === evento.id) {
				this.selectedEvento = null;
				this.invitadosDataSource.data = [];
				this.stats = {
					total: 0,
					confirmed: 0,
					pending: 0,
					totalCompanions: 0,
				};
			}

			this.showMessage('Evento eliminado exitosamente', 'success');
		}
	}

	/**
	 * Importa invitados desde un archivo CSV
	 */
	importarCSV(): void {
		if (!this.selectedEvento) {
			this.showMessage('Debe seleccionar un evento primero', 'info');
			return;
		}

		// TODO: Implementar lógica de importación CSV
		this.showMessage('Funcionalidad de importación en desarrollo', 'info');
	}

	/**
	 * Exporta la lista de invitados a CSV
	 */
	exportarCSV(): void {
		if (!this.selectedEvento) {
			this.showMessage('Debe seleccionar un evento primero', 'info');
			return;
		}

		// TODO: Implementar lógica de exportación CSV
		this.showMessage('Funcionalidad de exportación en desarrollo', 'info');
	}

	/**
	 * Carga las estadísticas de invitados
	 */
	loadStats(): void {
		this.invitadosService.getStats().subscribe({
			next: (stats) => {
				this.stats = stats;
			},
		});
	}

	/**
	 * Aplica el filtro de búsqueda a la tabla de invitados
	 */
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.invitadosDataSource.filter = filterValue.trim().toLowerCase();

		if (this.invitadosDataSource.paginator) {
			this.invitadosDataSource.paginator.firstPage();
		}
	}

	/**
	 * Abre el diálogo para crear un nuevo invitado
	 */
	openCreateDialog(): void {
		const dialogRef = this.dialog.open(InvitadoDialogComponent, {
			width: '600px',
			data: { mode: 'create' },
		});

		dialogRef.afterClosed().subscribe((result: Invitado | undefined) => {
			if (result) {
				this.invitadosService.createInvitado(result).subscribe({
					next: (response) => {
						if (response.success && this.selectedEvento) {
							this.showMessage('Invitado creado exitosamente', 'success');
							this.loadInvitadosForEvento(this.selectedEvento.id);
						}
					},
					error: (error) => {
						console.error('Error al crear invitado:', error);
						this.showMessage('Error al crear invitado', 'error');
					},
				});
			}
		});
	}

	/**
	 * Abre el diálogo para editar un invitado existente
	 */
	openEditDialog(invitado: Invitado): void {
		const dialogRef = this.dialog.open(InvitadoDialogComponent, {
			width: '600px',
			data: { invitado, mode: 'edit' },
		});

		dialogRef.afterClosed().subscribe((result: Invitado | undefined) => {
			if (result) {
				this.invitadosService.updateInvitado(result).subscribe({
					next: (response) => {
						if (response.success && this.selectedEvento) {
							this.showMessage('Invitado actualizado exitosamente', 'success');
							this.loadInvitadosForEvento(this.selectedEvento.id);
						}
					},
					error: (error) => {
						console.error('Error al actualizar invitado:', error);
						this.showMessage('Error al actualizar invitado', 'error');
					},
				});
			}
		});
	}

	/**
	 * Elimina un invitado después de confirmación
	 */
	deleteInvitado(invitado: Invitado): void {
		const confirmed = confirm(
			`¿Está seguro de eliminar al invitado "${invitado.fullName}"?`,
		);

		if (confirmed) {
			this.invitadosService.deleteInvitado(invitado.id).subscribe({
				next: (response) => {
					if (response.success && this.selectedEvento) {
						this.showMessage('Invitado eliminado exitosamente', 'success');
						this.loadInvitadosForEvento(this.selectedEvento.id);
					}
				},
				error: (error) => {
					console.error('Error al eliminar invitado:', error);
					this.showMessage('Error al eliminar invitado', 'error');
				},
			});
		}
	}

	/**
	 * Muestra un mensaje usando MatSnackBar
	 */
	private showMessage(
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

	/**
	 * Calcula el total de personas (invitados + acompañantes confirmados)
	 */
	getTotalPeople(): number {
		return this.stats.confirmed + this.stats.totalCompanions;
	}
}
