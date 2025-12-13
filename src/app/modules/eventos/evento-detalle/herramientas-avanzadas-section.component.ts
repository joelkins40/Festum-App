import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

interface HerramientaAvanzada {
	titulo: string;
	descripcion: string;
	icono: string;
	ruta: string;
	color: string;
}

@Component({
	selector: 'app-herramientas-avanzadas-section',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatTooltipModule,
	],
	template: `
		<section class="herramientas-section">
			<div class="section-header">
				<mat-icon class="section-icon">build_circle</mat-icon>
				<h2>Herramientas Avanzadas</h2>
			</div>
			<div class="section-content">
				<div class="herramientas-grid">
					@for (herramienta of herramientas; track herramienta.ruta) {
					<mat-card
						class="herramienta-card"
						(click)="navegarA(herramienta.ruta)"
						matTooltip="Clic para acceder"
					>
						<div class="card-content">
							<div class="card-icon">
								<mat-icon>{{ herramienta.icono }}</mat-icon>
							</div>
							<div class="card-text">
								<h3>{{ herramienta.titulo }}</h3>
								<p>{{ herramienta.descripcion }}</p>
							</div>
							<div class="card-action">
								<mat-icon>arrow_forward</mat-icon>
							</div>
						</div>
					</mat-card>
					}
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.herramientas-section {
				background: #ffffff;
				border-radius: 12px;
				padding: 24px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				// border-left: 4px solid #20b2aa;
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

			.herramientas-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
				gap: 16px;
			}

			.herramienta-card {
				cursor: pointer;
				transition: all 0.3s ease;
				// border-left: 4px solid #20b2aa;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}

			.herramienta-card:hover {
				transform: translateY(-4px);
				box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
			}

			.card-content {
				display: flex;
				align-items: center;
				gap: 16px;
				padding: 8px;
			}

			.card-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 56px;
				height: 56px;
				background-color: rgba(32, 178, 170, 0.1);
				border-radius: 12px;
				flex-shrink: 0;
			}

			.card-icon mat-icon {
				font-size: 32px;
				width: 32px;
				height: 32px;

        color: var(--color-primary);
			}

			.card-text {
				flex: 1;
			}

			.card-text h3 {
				margin: 0 0 4px 0;
				font-size: 16px;
				font-weight: 600;
				color: #2d3436;
			}

			.card-text p {
				margin: 0;
				font-size: 13px;
				color: #636e72;
				line-height: 1.4;
			}

			.card-action {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 32px;
				height: 32px;
				flex-shrink: 0;
			}

			.card-action mat-icon {
				font-size: 24px;
				width: 24px;
				height: 24px;
				color: #b2bec3;
				transition: all 0.2s ease;
			}

			.herramienta-card:hover .card-action mat-icon {
				color: #20b2aa;
				transform: translateX(4px);
			}

			@media (max-width: 768px) {
				.herramientas-grid {
					grid-template-columns: 1fr;
				}
			}
		`,
	],
})
export class HerramientasAvanzadasSectionComponent {
	@Input() eventoId?: string;

	constructor(private router: Router) {}

	get herramientas(): HerramientaAvanzada[] {
		const baseEventoPath = this.eventoId
			? `/eventos/${this.eventoId}`
			: '/eventos';

		return [
			{
				titulo: 'Cronograma',
				descripcion: 'Planifica y gestiona el cronograma del evento',
				icono: 'schedule',
				ruta: `${baseEventoPath}/cronograma`,
				color: '#20b2aa',
			},
			{
				titulo: 'Plano',
				descripcion: 'Visualiza y edita la distribución de mesas y espacios',
				icono: 'map',
				ruta: `${baseEventoPath}/plano`,
				color: '#6c5ce7',
			},
			{
				titulo: 'Invitados',
				descripcion: 'Administra la lista de invitados y confirmaciones',
				icono: 'people',
				ruta: `${baseEventoPath}/invitados`,
				color: '#00b894',
			},
			{
				titulo: 'Productos y Servicios',
				descripcion: 'Gestiona el catálogo de productos y servicios del evento',
				icono: 'inventory_2',
				ruta: `${baseEventoPath}/productos-servicios`,
				color: '#fd79a8',
			},
		];
	}

	navegarA(ruta: string): void {
		this.router.navigate([ruta]);
	}
}
