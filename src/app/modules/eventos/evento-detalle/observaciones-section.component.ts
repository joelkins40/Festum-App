import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface Observacion {
	id: number;
	fecha: Date;
	texto: string;
	autor?: string;
}

@Component({
	selector: 'app-observaciones-section',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatChipsModule],
	template: `
		<section class="observaciones-section">
			<div class="section-header">
				<mat-icon class="section-icon">description</mat-icon>
				<h2>Observaciones</h2>
			</div>
			<div class="section-content">
				@if (observaciones.length > 0) {
				<div class="observaciones-list">
					@for (obs of observaciones; track obs.id) {
					<div class="observacion-item">
						<div class="observacion-header">
							<mat-icon class="obs-icon">note</mat-icon>
							<span class="obs-fecha">{{ formatDate(obs.fecha) }}</span>
							@if (obs.autor) {
							<mat-chip class="chip-autor">
								<mat-icon class="chip-icon">person</mat-icon>
								{{ obs.autor }}
							</mat-chip>
							}
						</div>
						<p class="observacion-texto">{{ obs.texto }}</p>
					</div>
					}
				</div>
				} @else {
				<div class="empty-state">
					<mat-icon>note_add</mat-icon>
					<p>No hay observaciones registradas para este evento</p>
				</div>
				}
			</div>
		</section>
	`,
	styles: [
		`
			.observaciones-section {
				background: #ffffff;
				border-radius: 12px;
				padding: 24px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				border-left: 4px solid #20b2aa;
				margin-bottom: 24px;
			}

			.section-header {
				display: flex;
				align-items: center;
				gap: 12px;
				margin-bottom: 24px;
				padding-bottom: 16px;
				border-bottom: 1px solid #e9ecef;
			}

			.section-icon {
				font-size: 28px;
				width: 28px;
				height: 28px;
				color: #20b2aa;
			}

			h2 {
				margin: 0;
				font-size: 20px;
				font-weight: 600;
				color: #2d3436;
				letter-spacing: -0.5px;
			}

			.section-content {
				padding: 0;
			}

			.observaciones-list {
				display: flex;
				flex-direction: column;
				gap: 16px;
			}

			.observacion-item {
				padding: 16px;
				background-color: #f8f9fa;
				border-radius: 8px;
				border-left: 3px solid #20b2aa;
				transition: all 0.2s ease;
			}

			.observacion-item:hover {
				background-color: #e9ecef;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
			}

			.observacion-header {
				display: flex;
				align-items: center;
				gap: 12px;
				margin-bottom: 12px;
			}

			.obs-icon {
				font-size: 20px;
				width: 20px;
				height: 20px;
				color: #636e72;
			}

			.obs-fecha {
				font-size: 13px;
				color: #636e72;
				font-weight: 500;
			}

			.chip-autor {
				height: 24px;
				font-size: 12px;
				background-color: #20b2aa;
				color: white;
			}

			.chip-icon {
				font-size: 16px;
				width: 16px;
				height: 16px;
				margin-right: 4px;
			}

			.observacion-texto {
				margin: 0;
				font-size: 14px;
				color: #2d3436;
				line-height: 1.6;
				padding-left: 32px;
			}

			.empty-state {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 48px 24px;
				text-align: center;
				gap: 16px;
			}

			.empty-state mat-icon {
				font-size: 64px;
				width: 64px;
				height: 64px;
				color: #b2bec3;
			}

			.empty-state p {
				margin: 0;
				color: #636e72;
				font-size: 14px;
			}
		`,
	],
})
export class ObservacionesSectionComponent {
	@Input() eventoId?: string;

	// Mock data - puede ser reemplazado por datos reales
	observaciones: Observacion[] = [
		{
			id: 1,
			fecha: new Date('2024-11-10'),
			texto:
				'Cliente solicita confirmación de menú vegetariano para 15 invitados.',
			autor: 'Admin',
		},
		{
			id: 2,
			fecha: new Date('2024-11-12'),
			texto:
				'Verificar disponibilidad de sonido adicional para ceremonia exterior.',
			autor: 'Coordinador',
		},
		{
			id: 3,
			fecha: new Date('2024-11-15'),
			texto: 'Pendiente: Confirmar decoración floral antes del evento.',
		},
	];

	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(new Date(date));
	}
}
