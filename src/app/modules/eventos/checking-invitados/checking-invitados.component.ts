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
import { CheckingInvitadosService } from '../../../core/services/checking-invitados.service';
import {
	Invitado,
	Evento,
	CheckingStats,
} from '../../../core/models/invitado.model';
import { ButtonIconComponent } from '../../../shared/components/button-icon';

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
		ButtonIconComponent,
	],
	templateUrl: './checking-invitados.component.html',
	styleUrl: './checking-invitados.component.scss',
})
export class CheckingInvitadosComponent implements OnInit {
	// Dependency injection
	private readonly checkingService = inject(CheckingInvitadosService);
	private readonly snackBar = inject(MatSnackBar);

	// Referencias a paginador y ordenamiento
	@ViewChild('invitadosPaginator') invitadosPaginator!: MatPaginator;
	@ViewChild('invitadosSort') invitadosSort!: MatSort;

	// Data sources
	eventosDataSource = new MatTableDataSource<Evento>([]);
	invitadosDataSource = new MatTableDataSource<Invitado>([]);

	// Estado del componente
	selectedEvento: Evento | null = null;
	searchTerm = '';
	isLoading = false;

	// Filtros para eventos
	eventoSearchText = '';
	tipoEventoFilter = '';
	fechaFilter = '';

	// Columnas de la tabla de eventos
	eventosDisplayedColumns: string[] = [
		'id',
		'cliente',
		'tipoEvento',
		'fechaEvento',
		'lugar',
		'montoTotal',
		'actions',
	];

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

	// Listas únicas para los filtros
	get tiposEvento(): string[] {
		return [...new Set(this.eventosDataSource.data.map((e) => e.tipoEvento))];
	}

	get meses(): string[] {
		const meses = this.eventosDataSource.data.map((e) => {
			const fecha = new Date(e.fechaEvento);
			return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
		});
		return [...new Set(meses)].sort();
	}

	/**
	 * Carga la lista de eventos disponibles
	 */
	loadEventos(): void {
		this.isLoading = true;
		this.checkingService.getEventos().subscribe({
			next: (eventos) => {
				this.eventosDataSource.data = eventos;
				this.setupEventosFilter();
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
	 * Configura el filtro personalizado para la tabla de eventos
	 */
	setupEventosFilter(): void {
		this.eventosDataSource.filterPredicate = (
			evento: Evento,
			filter: string,
		) => {
			const searchStr = filter.toLowerCase();

			// Filtro por texto de búsqueda
			const matchesSearch =
				!this.eventoSearchText ||
				evento.cliente.toLowerCase().includes(searchStr) ||
				evento.tipoEvento.toLowerCase().includes(searchStr) ||
				evento.lugar.toLowerCase().includes(searchStr);

			// Filtro por tipo de evento
			const matchesTipo =
				!this.tipoEventoFilter || evento.tipoEvento === this.tipoEventoFilter;

			// Filtro por mes
			let matchesFecha = true;
			if (this.fechaFilter) {
				const fechaEvento = new Date(evento.fechaEvento);
				const mesFiltro = `${fechaEvento.getFullYear()}-${String(fechaEvento.getMonth() + 1).padStart(2, '0')}`;
				matchesFecha = mesFiltro === this.fechaFilter;
			}

			return matchesSearch && matchesTipo && matchesFecha;
		};
	}

	/**
	 * Aplica los filtros a la tabla de eventos
	 */
	applyEventosFilter(): void {
		this.eventosDataSource.filter = this.eventoSearchText.trim().toLowerCase();
	}

	/**
	 * Limpia todos los filtros de eventos
	 */
	clearEventosFilters(): void {
		this.eventoSearchText = '';
		this.tipoEventoFilter = '';
		this.fechaFilter = '';
		this.eventosDataSource.filter = '';
	}

	/**
	 * Selecciona un evento y carga sus invitados
	 */
	selectEvento(evento: Evento): void {
		this.selectedEvento = evento;
		this.loadInvitados();
		this.loadStats();
	}

	/**
	 * Carga los invitados del evento seleccionado
	 */
	loadInvitados(): void {
		if (!this.selectedEvento) return;

		this.isLoading = true;
		this.checkingService
			.getInvitadosByEvento(this.selectedEvento.id)
			.subscribe({
				next: (invitados) => {
					this.invitadosDataSource.data = invitados;
					this.invitadosDataSource.paginator = this.invitadosPaginator;
					this.invitadosDataSource.sort = this.invitadosSort;

					// Configurar filtro personalizado
					this.invitadosDataSource.filterPredicate = (
						data: Invitado,
						filter: string,
					) => {
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
		if (!this.selectedEvento) return;

		this.checkingService.getStats(this.selectedEvento.id).subscribe({
			next: (stats) => {
				this.stats = stats;
			},
			error: (error) => {
				console.error('Error al cargar estadísticas:', error);
			},
		});
	}

	/**
	 * Aplica el filtro de búsqueda de invitados
	 */
	applyFilter(): void {
		this.invitadosDataSource.filter = this.searchTerm.trim().toLowerCase();

		if (this.invitadosDataSource.paginator) {
			this.invitadosDataSource.paginator.firstPage();
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
		if (!this.selectedEvento) return;

		this.checkingService
			.checkInInvitado(this.selectedEvento.id, invitado.id)
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
		if (!this.selectedEvento) return;

		const confirmed = confirm(
			`¿Desea deshacer el check-in de ${invitado.fullName}?`,
		);

		if (confirmed) {
			this.checkingService
				.undoCheckIn(this.selectedEvento.id, invitado.id)
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
		if (this.selectedEvento) {
			this.loadInvitados();
			this.loadStats();
			this.showMessage('Datos actualizados', 'info');
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
	 * Obtiene el nombre del evento seleccionado
	 */
	getSelectedEventName(): string {
		return this.selectedEvento ? this.selectedEvento.name : '';
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
