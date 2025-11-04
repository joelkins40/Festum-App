import { ListaEventosService } from './../lista/lista-eventos.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Evento } from '../lista/lista-eventos.service';

@Component({
	selector: 'app-evento-detalle-component',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './eventoDetalle.component.html',
	styleUrl: './eventoDetalle.component.css',
})
export class EventoDetalleComponent {
	route = inject(ActivatedRoute);
	eventosService = inject(ListaEventosService);

	currentIdEvent = signal(this.route.snapshot.paramMap.get('id'));
	currentEvent = signal<Evento>({} as Evento);

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');

		// todo: manejar este error
		if (!id) return;

		this.eventosService.getEventoByFolio(id).subscribe({
			next: (res) => {
				if (res.success && res.data) {
					this.currentEvent.set(res.data);
				}
			},
			error: (err) => {
				console.error('Error al obtener el evento:', err);
			},
		});
		// console.log('ID del evento:', id);
	}
}
