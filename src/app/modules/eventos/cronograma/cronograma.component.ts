import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
	TimelineEvent,
	ViewMode,
	EventStatus,
	MonthGroup,
	YearGroup,
	TimelineClient,
	LocationType,
	EventLocation,
} from '../../../core/models/event-timeline.model';
import { CronogramaDialogComponent } from './cronograma-dialog/cronograma-dialog.component';

@Component({
	selector: 'app-cronograma',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatIconModule,
		MatTooltipModule,
		MatCardModule,
		MatChipsModule,
		MatDialogModule,
		MatSnackBarModule,
	],
	templateUrl: './cronograma.component.html',
	styleUrl: './cronograma.component.scss',
	animations: [
		trigger('fadeSlide', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateY(20px)' }),
				animate(
					'300ms ease-out',
					style({ opacity: 1, transform: 'translateY(0)' }),
				),
			]),
			transition(':leave', [
				animate(
					'200ms ease-in',
					style({ opacity: 0, transform: 'translateY(-10px)' }),
				),
			]),
		]),
	],
})
export class CronogramaComponent implements OnInit {
	// Signals para manejo de estado
	viewMode = signal<ViewMode>(ViewMode.MONTHLY);
	events = signal<TimelineEvent[]>([]);
	loading = signal(false);
	selectedYear = signal(new Date().getFullYear());

	// Enums para el template
	ViewMode = ViewMode;
	EventStatus = EventStatus;

	// Computed para datos agrupados
	monthlyGroups = computed(() => this.groupByMonth(this.events()));
	yearlyGroups = computed(() => this.groupByYear(this.events()));

	constructor(
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
	) {}

	ngOnInit(): void {
		this.loadEvents();
	}

	/**
	 * Carga eventos (mock data por ahora)
	 */
	private loadEvents(): void {
		this.loading.set(true);

		// Simular carga de datos
		setTimeout(() => {
			this.events.set(this.getMockEvents());
			this.loading.set(false);
		}, 800);
	}

	/**
	 * Cambia el modo de vista
	 */
	changeViewMode(mode: ViewMode): void {
		this.viewMode.set(mode);
	}

	/**
	 * Abre dialog para crear nuevo evento
	 */
	createEvent(): void {
		const dialogRef = this.dialog.open(CronogramaDialogComponent, {
			width: '700px',
			data: {
				mode: 'create',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const newEvent: TimelineEvent = {
					id: Date.now(),
					nombre: result.nombre,
					cliente: result.cliente,
					fechaInicio: result.fechaInicio,
					fechaFin: result.fechaFin,
					ubicacion: result.ubicacion,
					descripcion: result.descripcion,
					status: result.status,
					color: this.getStatusColor(result.status),
				};

				this.events.update((events) => [...events, newEvent]);
				this.showSnackBar('Evento creado exitosamente', 'success');
			}
		});
	}

	/**
	 * Abre dialog para ver/editar evento
	 */
	openEventDialog(event: TimelineEvent): void {
		const dialogRef = this.dialog.open(CronogramaDialogComponent, {
			width: '700px',
			data: {
				mode: 'edit',
				event: event,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.events.update((events) =>
					events.map((e) =>
						e.id === event.id
							? { ...e, ...result, color: this.getStatusColor(result.status) }
							: e,
					),
				);
				this.showSnackBar('Evento actualizado exitosamente', 'success');
			}
		});
	}

	/**
	 * Elimina un evento
	 */
	deleteEvent(event: TimelineEvent, clickEvent: Event): void {
		clickEvent.stopPropagation();

		if (confirm(`¿Está seguro de eliminar el evento "${event.nombre}"?`)) {
			this.events.update((events) => events.filter((e) => e.id !== event.id));
			this.showSnackBar('Evento eliminado', 'info');
		}
	}

	/**
	 * Agrupa eventos por mes para vista mensual
	 */
	private groupByMonth(events: TimelineEvent[]): MonthGroup[] {
		const groups = new Map<string, TimelineEvent[]>();

		events.forEach((event) => {
			const date = new Date(event.fechaInicio);
			const key = `${date.getFullYear()}-${date.getMonth()}`;

			if (!groups.has(key)) {
				groups.set(key, []);
			}
			const group = groups.get(key);
			if (group) {
				group.push(event);
			}
		});

		const result: MonthGroup[] = [];
		groups.forEach((eventList, key) => {
			const [year, month] = key.split('-').map(Number);
			result.push({
				month: this.getMonthName(month),
				monthNumber: month,
				year: year,
				events: eventList.sort(
					(a, b) =>
						new Date(a.fechaInicio).getTime() -
						new Date(b.fechaInicio).getTime(),
				),
			});
		});

		return result.sort((a, b) => {
			if (a.year !== b.year) return b.year - a.year;
			return b.monthNumber - a.monthNumber;
		});
	}

	/**
	 * Agrupa eventos por año para vista anual
	 */
	private groupByYear(events: TimelineEvent[]): YearGroup[] {
		const yearMap = new Map<number, TimelineEvent[]>();

		events.forEach((event) => {
			const year = new Date(event.fechaInicio).getFullYear();
			if (!yearMap.has(year)) {
				yearMap.set(year, []);
			}
			const yearEvents = yearMap.get(year);
			if (yearEvents) {
				yearEvents.push(event);
			}
		});

		const result: YearGroup[] = [];
		yearMap.forEach((eventList, year) => {
			const monthGroups = this.groupEventsByMonth(eventList);
			result.push({
				year: year,
				totalEvents: eventList.length,
				months: monthGroups,
			});
		});

		return result.sort((a, b) => b.year - a.year);
	}

	/**
	 * Agrupa eventos por mes (helper para vista anual)
	 */
	private groupEventsByMonth(events: TimelineEvent[]): MonthGroup[] {
		const groups = new Map<number, TimelineEvent[]>();

		events.forEach((event) => {
			const month = new Date(event.fechaInicio).getMonth();
			if (!groups.has(month)) {
				groups.set(month, []);
			}
			const group = groups.get(month);
			if (group) {
				group.push(event);
			}
		});

		const result: MonthGroup[] = [];
		groups.forEach((eventList, month) => {
			result.push({
				month: this.getMonthName(month),
				monthNumber: month,
				year: new Date(eventList[0].fechaInicio).getFullYear(),
				events: eventList.sort(
					(a, b) =>
						new Date(a.fechaInicio).getTime() -
						new Date(b.fechaInicio).getTime(),
				),
			});
		});

		return result.sort((a, b) => a.monthNumber - b.monthNumber);
	}

	/**
	 * Obtiene nombre del mes
	 */
	private getMonthName(monthNumber: number): string {
		const months = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		];
		return months[monthNumber];
	}

	/**
	 * Formatea rango de fechas
	 */
	formatDateRange(start: Date, end: Date): string {
		const startDate = new Date(start);
		const endDate = new Date(end);

		const formatOptions: Intl.DateTimeFormatOptions = {
			day: '2-digit',
			month: 'short',
		};

		const startStr = startDate.toLocaleDateString('es-MX', formatOptions);
		const endStr = endDate.toLocaleDateString('es-MX', formatOptions);

		return `${startStr} → ${endStr}`;
	}

	/**
	 * Obtiene clase CSS según el estado
	 */
	getStatusClass(status: EventStatus): string {
		const statusMap: Record<EventStatus, string> = {
			[EventStatus.PENDING]: 'status-pending',
			[EventStatus.CONFIRMED]: 'status-confirmed',
			[EventStatus.COMPLETED]: 'status-completed',
			[EventStatus.CANCELED]: 'status-canceled',
		};
		return statusMap[status];
	}

	/**
	 * Obtiene icono según el estado
	 */
	getStatusIcon(status: EventStatus): string {
		const iconMap: Record<EventStatus, string> = {
			[EventStatus.PENDING]: 'schedule',
			[EventStatus.CONFIRMED]: 'check_circle',
			[EventStatus.COMPLETED]: 'done_all',
			[EventStatus.CANCELED]: 'cancel',
		};
		return iconMap[status];
	}

	/**
	 * Obtiene color según el estado
	 */
	private getStatusColor(status: EventStatus): string {
		const colorMap: Record<EventStatus, string> = {
			[EventStatus.PENDING]: '#ffc107',
			[EventStatus.CONFIRMED]: '#28a745',
			[EventStatus.COMPLETED]: '#007bff',
			[EventStatus.CANCELED]: '#dc3545',
		};
		return colorMap[status];
	}

	/**
	 * Obtiene ubicación formateada
	 */
	getLocationText(ubicacion: EventLocation): string {
		if (ubicacion.type === LocationType.SALON) {
			return ubicacion.salonName || 'Salón';
		}
		return ubicacion.address || 'Dirección no especificada';
	}

	/**
	 * TrackBy para optimización
	 */
	trackByEventId(_index: number, event: TimelineEvent): number {
		return event.id;
	}

	trackByMonth(_index: number, month: MonthGroup): string {
		return `${month.year}-${month.monthNumber}`;
	}

	trackByYear(_index: number, year: YearGroup): number {
		return year.year;
	}

	/**
	 * Muestra notificación
	 */
	private showSnackBar(
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
	 * Datos mock para desarrollo
	 */
	private getMockEvents(): TimelineEvent[] {
		const mockClients: TimelineClient[] = [
			{ id: 1, nombre: 'María González' },
			{ id: 2, nombre: 'Carlos Rodríguez' },
			{ id: 3, nombre: 'Ana Martínez' },
			{ id: 4, nombre: 'Pedro Hernández' },
			{ id: 5, nombre: 'Laura Jiménez' },
		];

		return [
			{
				id: 1,
				nombre: 'Boda María y Carlos',
				cliente: mockClients[0],
				fechaInicio: new Date('2025-12-15'),
				fechaFin: new Date('2025-12-16'),
				ubicacion: {
					type: LocationType.SALON,
					salonName: 'Salón Jardín Imperial',
					salonId: 1,
				},
				descripcion: 'Boda en jardín con 200 invitados',
				status: EventStatus.CONFIRMED,
				color: '#28a745',
			},
			{
				id: 2,
				nombre: 'XV Años Sofía',
				cliente: mockClients[1],
				fechaInicio: new Date('2025-12-20'),
				fechaFin: new Date('2025-12-20'),
				ubicacion: {
					type: LocationType.ADDRESS,
					address: 'Av. Insurgentes Sur 1234, Del Valle',
				},
				descripcion: 'Celebración de XV años temática',
				status: EventStatus.PENDING,
				color: '#ffc107',
			},
			{
				id: 3,
				nombre: 'Evento Corporativo Tech Summit',
				cliente: mockClients[2],
				fechaInicio: new Date('2025-11-25'),
				fechaFin: new Date('2025-11-25'),
				ubicacion: {
					type: LocationType.SALON,
					salonName: 'Centro de Convenciones',
					salonId: 2,
				},
				descripcion: 'Conferencia empresarial con 300 asistentes',
				status: EventStatus.CONFIRMED,
				color: '#28a745',
			},
			{
				id: 4,
				nombre: 'Bautizo Mateo',
				cliente: mockClients[3],
				fechaInicio: new Date('2025-11-10'),
				fechaFin: new Date('2025-11-10'),
				ubicacion: {
					type: LocationType.ADDRESS,
					address: 'Calle Reforma 456, Colonia Centro',
				},
				status: EventStatus.COMPLETED,
				color: '#007bff',
			},
			{
				id: 5,
				nombre: 'Aniversario 50 Años',
				cliente: mockClients[4],
				fechaInicio: new Date('2026-01-15'),
				fechaFin: new Date('2026-01-15'),
				ubicacion: {
					type: LocationType.SALON,
					salonName: 'Terraza Panorámica',
					salonId: 3,
				},
				descripcion: 'Celebración de aniversario de bodas',
				status: EventStatus.PENDING,
				color: '#ffc107',
			},
			{
				id: 6,
				nombre: 'Fiesta Graduación',
				cliente: mockClients[0],
				fechaInicio: new Date('2025-07-05'),
				fechaFin: new Date('2025-07-05'),
				ubicacion: {
					type: LocationType.ADDRESS,
					address: 'Universidad Nacional, Campus Sur',
				},
				status: EventStatus.COMPLETED,
				color: '#007bff',
			},
			{
				id: 7,
				nombre: 'Baby Shower Emma',
				cliente: mockClients[2],
				fechaInicio: new Date('2026-02-20'),
				fechaFin: new Date('2026-02-20'),
				ubicacion: {
					type: LocationType.SALON,
					salonName: 'Salón Jardín de Rosas',
					salonId: 4,
				},
				status: EventStatus.PENDING,
				color: '#ffc107',
			},
			{
				id: 8,
				nombre: 'Reunión Familiar Navideña',
				cliente: mockClients[1],
				fechaInicio: new Date('2025-12-24'),
				fechaFin: new Date('2025-12-24'),
				ubicacion: {
					type: LocationType.ADDRESS,
					address: 'Privada Los Pinos 123, Lomas',
				},
				status: EventStatus.CANCELED,
				color: '#dc3545',
			},
		];
	}
}
