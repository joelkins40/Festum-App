import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SalonesService } from '../../../../core/services/salones.service';
import { Salon } from '../../../../core/models/salon.model';
import { PlanoViewComponent } from '../../../../shared/components/plano-view/plano-view.component';
import { ElementItem } from '../../../../shared/components/plano-view/types';


/**
 * Componente para visualizar el plano de un salón específico.
 *
 * Reconstruido con Angular 19 usando signals y sintaxis moderna.
 * Obtiene el ID del salón desde la ruta y carga sus datos desde el servicio.
 * Integra el componente plano-view para mostrar el diseño del salón en modo solo lectura.
 */
@Component({
	selector: 'app-plano-salones',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatTooltipModule,
		MatProgressSpinnerModule,
		PlanoViewComponent,
	],
	templateUrl: './plano-salones.component.html',
	styleUrl: './plano-salones.component.scss',
})
export class PlanoSalonesComponent implements OnInit {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly salonesService = inject(SalonesService);

	// Signals para estado reactivo
	readonly salonId = signal<number | null>(null);
	readonly salon = signal<Salon | null>(null);
	readonly planoElements = signal<ElementItem[]>([]);
	readonly plantillaNombre = signal<string>('');
	readonly loading = signal<boolean>(true);
	readonly errorCarga = signal<boolean>(false);
	readonly errorMessage = signal<string>('');

	// Computed para nombre del salón
	readonly salonNombre = computed(() => this.salon()?.nombre ?? '');

	ngOnInit(): void {
		this.loadSalonFromRoute();
	}

	/**
	 * Carga el salón desde el parámetro de ruta
	 */
	private loadSalonFromRoute(): void {
		const idParam = this.route.snapshot.paramMap.get('id');

		if (!idParam) {
			this.handleError('No se proporcionó un ID de salón válido');
			return;
		}

		const id = parseInt(idParam, 10);

		if (isNaN(id)) {
			this.handleError('El ID del salón no es válido');
			return;
		}

		this.salonId.set(id);
		this.loadSalonData(id);
	}

	/**
	 * Carga los datos del salón desde el servicio
	 */
	private loadSalonData(id: number): void {
		this.loading.set(true);

		this.salonesService.getSalonById(id).subscribe({
			next: (response) => {
				if (response.success && response.data && !Array.isArray(response.data)) {
					this.salon.set(response.data);
					this.loadPlanoTemplate(response.data);
				} else {
					this.handleError('No se pudo encontrar el salón solicitado');
				}
			},
			error: (err) => {
				console.error('Error al cargar salón:', err);
				this.handleError('Error al cargar los datos del salón');
			},
			complete: () => {
				this.loading.set(false);
			}
		});
	}

	/**
	 * Carga la plantilla del plano desde los datos del salón
	 */
	private loadPlanoTemplate(salon: Salon): void {
		if (salon.planoTemplate?.elementos) {
			this.planoElements.set(salon.planoTemplate.elementos);
			this.plantillaNombre.set(salon.planoTemplate.plantillaNombre || 'Sin plantilla');
		} else {
			// Si no hay plantilla, mostrar arreglo vacío
			this.planoElements.set([]);
			this.plantillaNombre.set('Sin plantilla configurada');
		}
	}

	/**
	 * Maneja errores mostrando mensaje y actualizando estado
	 */
	private handleError(message: string): void {
		this.errorCarga.set(true);
		this.errorMessage.set(message);
		this.loading.set(false);
	}

	/**
	 * Navega de regreso a la lista de salones
	 */
	navigateBack(): void {
		this.router.navigate(['/catalogos/salones']);
	}
}
