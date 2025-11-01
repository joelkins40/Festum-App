import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CheckingInvitadosService } from './checking-invitados.service';
import { Invitado, Evento, CheckingStats } from './models/invitado.model';

/**
 * Componente para realizar el checking de invitados en eventos
 */
@Component({
	selector: 'app-checking-invitados',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
	],
	templateUrl: './checking-invitados.component.html',
	styleUrl: './checking-invitados.component.scss',
})
export class CheckingInvitadosComponent implements OnInit {
	// Dependency injection
	private readonly checkingService = inject(CheckingInvitadosService);
	private readonly snackBar = inject(MatSnackBar);

	// Referencias a paginador y ordenamiento
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	// Data sources
	eventos: Evento[] = [];
	dataSource = new MatTableDataSource<Invitado>([]);

	// Estado del componente
	selectedEventId: number | null = null;
	searchTerm = '';
	isLoading = false;

	// Estadísticas
	stats: CheckingStats = {
		totalGuests: 0,
		checkedIn: 0,
		pending: 0,
		totalPeople: 0,
	};

	// Columnas de la tabla
	displayedColumns: string[] = [
		'reservationCode',
		'fullName',
		'contactPhone',
		'companions',
		'status',
		'actions',
	];

	ngOnInit(): void {
		this.loadEventos();
	}

	/**
	 * Carga la lista de eventos disponibles
	 */
	loadEventos(): void {
		this.isLoading = true;
		this.checkingService.getEventos().subscribe({
			next: (eventos) => {
				this.eventos = eventos;
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error al cargar eventos:', error);
				this.showMessage('Error al cargar eventos', 'error');
				this.isLoading = false;
			},
		});
	}

	/**
	 * Maneja el cambio de evento seleccionado
	 */
	onEventoChange(): void {
		if (this.selectedEventId) {
			this.loadInvitados();
			this.loadStats();
		} else {
			this.dataSource.data = [];
			this.resetStats();
		}
	}

	/**
	 * Carga los invitados del evento seleccionado
	 */
	loadInvitados(): void {
		if (!this.selectedEventId) return;

		this.isLoading = true;
		this.checkingService.getInvitadosByEvento(this.selectedEventId).subscribe({
			next: (invitados) => {
				this.dataSource.data = invitados;
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				// Configurar filtro personalizado
				this.dataSource.filterPredicate = (data: Invitado, filter: string) => {
					const searchStr = filter.toLowerCase();
					return (
						data.fullName.toLowerCase().includes(searchStr) ||
						data.reservationCode.toLowerCase().includes(searchStr) ||
						data.contactPhone.includes(searchStr)
					);
				};

				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error al cargar invitados:', error);
				this.showMessage('Error al cargar invitados', 'error');
				this.isLoading = false;
			},
		});
	}

	/**
	 * Carga las estadísticas del evento
	 */
	loadStats(): void {
		if (!this.selectedEventId) return;

		this.checkingService.getStats(this.selectedEventId).subscribe({
			next: (stats) => {
				this.stats = stats;
			},
			error: (error) => {
				console.error('Error al cargar estadísticas:', error);
			},
		});
	}

	/**
	 * Aplica el filtro de búsqueda
	 */
	applyFilter(): void {
		this.dataSource.filter = this.searchTerm.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * Limpia el filtro de búsqueda
	 */
	clearFilter(): void {
		this.searchTerm = '';
		this.applyFilter();
	}

	/**
	 * Registra el check-in de un invitado
	 */
	checkIn(invitado: Invitado): void {
		if (!this.selectedEventId) return;

		this.checkingService
			.checkInInvitado(this.selectedEventId, invitado.id)
			.subscribe({
				next: (success) => {
					if (success) {
						this.showMessage(
							`✓ ${invitado.fullName} registrado exitosamente`,
							'success',
						);
						this.loadInvitados();
						this.loadStats();
					} else {
						this.showMessage('Error al registrar el check-in', 'error');
					}
				},
				error: (error) => {
					console.error('Error al registrar check-in:', error);
					this.showMessage('Error al registrar el check-in', 'error');
				},
			});
	}

	/**
	 * Deshace el check-in de un invitado
	 */
	undoCheckIn(invitado: Invitado): void {
		if (!this.selectedEventId) return;

		const confirmed = confirm(
			`¿Desea deshacer el check-in de ${invitado.fullName}?`,
		);

		if (confirmed) {
			this.checkingService
				.undoCheckIn(this.selectedEventId, invitado.id)
				.subscribe({
					next: (success) => {
						if (success) {
							this.showMessage('Check-in deshecho exitosamente', 'info');
							this.loadInvitados();
							this.loadStats();
						}
					},
					error: (error) => {
						console.error('Error al deshacer check-in:', error);
						this.showMessage('Error al deshacer el check-in', 'error');
					},
				});
		}
	}

	/**
	 * Recarga los datos del evento actual
	 */
	refreshData(): void {
		if (this.selectedEventId) {
			this.loadInvitados();
			this.loadStats();
			this.showMessage('Datos actualizados', 'info');
		}
	}

	/**
	 * Resetea las estadísticas
	 */
	private resetStats(): void {
		this.stats = {
			totalGuests: 0,
			checkedIn: 0,
			pending: 0,
			totalPeople: 0,
		};
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
	 * Obtiene el nombre del evento seleccionado
	 */
	getSelectedEventName(): string {
		const evento = this.eventos.find((e) => e.id === this.selectedEventId);
		return evento ? evento.name : '';
	}

	/**
	 * Formatea la hora de check-in
	 */
	formatCheckInTime(time?: string): string {
		if (!time) return '';
		const date = new Date(time);
		return date.toLocaleTimeString('es-MX', {
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	/**
	 * Calcula el porcentaje de asistencia
	 */
	getAttendancePercentage(): number {
		if (this.stats.totalGuests === 0) return 0;
		return Math.round((this.stats.checkedIn / this.stats.totalGuests) * 100);
	}
}
