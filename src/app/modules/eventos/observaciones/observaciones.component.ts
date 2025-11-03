import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ObservacionesDialogComponent } from './observaciones-dialog/observaciones-dialog.component';

export enum ObservationStatus {
	PENDING = 'Pendiente',
	IN_PROGRESS = 'En Progreso',
	RESOLVED = 'Resuelto',
	INFO = 'Información',
}

export interface Observation {
	id: number;
	author: string;
	date: Date;
	text: string;
	status: ObservationStatus;
	tags?: string[];
}

@Component({
	selector: 'app-observaciones',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatChipsModule,
		MatDividerModule,
		MatTooltipModule,
		MatDialogModule,
	],
	templateUrl: './observaciones.component.html',
	styleUrl: './observaciones.component.scss',
})
export class ObservacionesComponent {
	observations = signal<Observation[]>([
		{
			id: 1,
			author: 'Ana García',
			date: new Date('2025-11-01T10:30:00'),
			text: 'El cliente solicita cambiar el color de la mantelería de blanco a azul marino. Ya confirmé disponibilidad con el proveedor.',
			status: ObservationStatus.RESOLVED,
			tags: ['Decoración', 'Mantelería'],
		},
		{
			id: 2,
			author: 'Carlos Mendoza',
			date: new Date('2025-11-01T14:15:00'),
			text: 'Recordatorio: El cliente mencionó que tiene invitados con restricciones alimentarias (vegetarianos y celíacos). Coordinar con el chef.',
			status: ObservationStatus.PENDING,
			tags: ['Catering', 'Menú', 'Alergias'],
		},
		{
			id: 3,
			author: 'Laura Martínez',
			date: new Date('2025-11-02T09:00:00'),
			text: 'Se confirmó la contratación del grupo musical "Los Trovadores" para amenizar el evento de 8pm a 12am.',
			status: ObservationStatus.RESOLVED,
			tags: ['Entretenimiento', 'Música'],
		},
		{
			id: 4,
			author: 'Roberto Silva',
			date: new Date('2025-11-02T11:45:00'),
			text: 'El cliente pregunta si es posible extender el horario del evento hasta la 1am. Verificar disponibilidad del salón y costos adicionales.',
			status: ObservationStatus.IN_PROGRESS,
			tags: ['Horario', 'Salón'],
		},
		{
			id: 5,
			author: 'María López',
			date: new Date('2025-11-02T16:30:00'),
			text: 'Confirmada la entrega de las sillas Tiffany el día anterior al evento. El proveedor llegará a las 2pm para el montaje.',
			status: ObservationStatus.RESOLVED,
			tags: ['Mobiliario', 'Logística'],
		},
		{
			id: 6,
			author: 'Diego Ramírez',
			date: new Date('2025-11-03T08:20:00'),
			text: 'El sistema de sonido presenta fallas intermitentes. Técnico vendrá mañana para revisión completa.',
			status: ObservationStatus.PENDING,
			tags: ['Sonido', 'Técnico', 'Urgente'],
		},
	]);

	private dialog = inject(MatDialog);

	openDialog(observation?: Observation): void {
		const dialogRef = this.dialog.open(ObservacionesDialogComponent, {
			width: '600px',
			data: observation || null,
		});

		dialogRef.afterClosed().subscribe((result: Observation | undefined) => {
			if (result) {
				if (observation) {
					// Editar observación existente
					this.updateObservation(result);
				} else {
					// Agregar nueva observación
					this.addObservation(result);
				}
			}
		});
	}

	addObservation(observation: Observation): void {
		const newId = Math.max(...this.observations().map((o) => o.id), 0) + 1;
		const newObservation = { ...observation, id: newId, date: new Date() };
		this.observations.update((obs) => [newObservation, ...obs]);
	}

	updateObservation(observation: Observation): void {
		this.observations.update((obs) =>
			obs.map((o) => (o.id === observation.id ? observation : o)),
		);
	}

	deleteObservation(id: number): void {
		this.observations.update((obs) => obs.filter((o) => o.id !== id));
	}

	getStatusColor(status: ObservationStatus): string {
		switch (status) {
			case ObservationStatus.PENDING:
				return 'warn';
			case ObservationStatus.IN_PROGRESS:
				return 'accent';
			case ObservationStatus.RESOLVED:
				return 'primary';
			case ObservationStatus.INFO:
			default:
				return '';
		}
	}

	getStatusIcon(status: ObservationStatus): string {
		switch (status) {
			case ObservationStatus.PENDING:
				return 'schedule';
			case ObservationStatus.IN_PROGRESS:
				return 'autorenew';
			case ObservationStatus.RESOLVED:
				return 'check_circle';
			case ObservationStatus.INFO:
			default:
				return 'info';
		}
	}

	formatDateTime(date: Date): string {
		const now = new Date();
		const diffMs = now.getTime() - new Date(date).getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Hace un momento';
		if (diffMins < 60)
			return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
		if (diffHours < 24)
			return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
		if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

		return new Date(date).toLocaleDateString('es-MX', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	trackByObservation(_index: number, observation: Observation): number {
		return observation.id;
	}
}
