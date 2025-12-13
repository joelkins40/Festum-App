import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GaleriaComponent } from '../galeria/galeria.component';

@Component({
	selector: 'app-multimedia-section',
	standalone: true,
	imports: [CommonModule, MatIconModule, GaleriaComponent],
	template: `
		<section class="multimedia-section">
			<div class="section-header">
				<mat-icon class="section-icon">photo_library</mat-icon>
				<h2>Multimedia</h2>
			</div>
			<div class="section-content">
				<app-galeria></app-galeria>
			</div>
		</section>
	`,
	styles: [
		`
			.multimedia-section {
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
		`,
	],
})
export class MultimediaSectionComponent {
	@Input() eventoId?: string;
}
