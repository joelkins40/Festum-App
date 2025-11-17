import { ListaEventosService } from '../../../core/services/lista-eventos.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Evento } from '../../../core/services/lista-eventos.service';

@Component({
	selector: 'app-evento-detalle-component',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		MatDividerModule,
		MatTooltipModule,
		MatProgressSpinnerModule,
	],
	templateUrl: './evento-page.component.html',
	styleUrl: './evento-page.component.scss',
})
export class EventoDetalleComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private eventosService = inject(ListaEventosService);

	// Signals
	currentIdEvent = signal(this.route.snapshot.paramMap.get('id'));
	currentEvent = signal<Evento | null>(null);
	isLoading = signal(true);
	hasError = signal(false);

	// Computed values
	subtotalProductos = computed(() => {
		const evento = this.currentEvent();
		if (!evento) return 0;
		return (
			evento.productos?.reduce((sum, p) => sum + p.subtotal, 0) || evento.total
		);
	});

	iva = computed(() => {
		return this.subtotalProductos() * 0.16;
	});

	totalConIva = computed(() => {
		return this.subtotalProductos() + this.iva();
	});

	ngOnInit(): void {
		this.loadEvento();
	}

	/**
	 * Carga los datos del evento
	 */
	private loadEvento(): void {
		const id = this.route.snapshot.paramMap.get('id');

		if (!id) {
			this.hasError.set(true);
			this.isLoading.set(false);
			return;
		}

		this.eventosService.getEventoByFolio(id).subscribe({
			next: (res) => {
				if (res.success && res.data && !Array.isArray(res.data)) {
					this.currentEvent.set(res.data);
					this.hasError.set(false);
				} else {
					this.hasError.set(true);
				}
				this.isLoading.set(false);
			},
			error: (err) => {
				console.error('Error al obtener el evento:', err);
				this.hasError.set(true);
				this.isLoading.set(false);
			},
		});
	}

	/**
	 * Formatea fecha para visualización
	 */
	formatDate(date: Date): string {
		if (!date) return 'No especificada';
		return new Intl.DateTimeFormat('es-MX', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(new Date(date));
	}

	/**
	 * Formatea precio en pesos mexicanos
	 */
	formatPrice(price: number): string {
		if (price === null || price === undefined) return '$0.00';
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(price);
	}

	/**
	 * Obtiene el tipo de lugar en texto legible
	 */
	getTipoLugarLabel(tipo: string): string {
		const labelMap: Record<string, string> = {
			direccionCliente: 'Dirección del Cliente',
			nuevaDireccion: 'Dirección Personalizada',
			salonExistente: 'Salón de Eventos',
		};
		return labelMap[tipo] || 'No especificado';
	}

	/**
	 * Obtiene la dirección formateada
	 */
	getFormattedAddress(): string {
		const evento = this.currentEvent();
		if (!evento?.lugar) return 'No especificado';

		const { lugar } = evento;

		if (lugar.tipo === 'salonExistente' && lugar.nombreSalon) {
			return lugar.nombreSalon;
		}

		if (lugar.direccion) {
			const d = lugar.direccion;
			return `${d.fullAddress}\n${d.city}, ${d.state}\nC.P. ${d.postalCode}`;
		}

		return 'No especificado';
	}

	/**
	 * Copia texto al portapapeles
	 */
	copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text).then(() => {
			// Aquí podrías mostrar un snackbar de éxito
			console.log('Copiado al portapapeles:', text);
		});
	}

	/**
	 * Navega de regreso a la lista
	 */
	goBack(): void {
		this.router.navigate(['/eventos'], { replaceUrl: true });
	}

	/**
	 * TrackBy para optimizar renderizado de listas
	 */
	trackByProductId(_index: number, item: { id: number }): number {
		return item.id;
	}
}
