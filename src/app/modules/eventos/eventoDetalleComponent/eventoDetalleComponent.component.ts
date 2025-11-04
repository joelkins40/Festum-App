import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-evento-detalle-component',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './eventoDetalle.component.html',
	styleUrl: './eventoDetalle.component.css',
})
export class EventoDetalleComponent {
	route = inject(ActivatedRoute);
  
  currentIdEvent = signal(this.route.snapshot.paramMap.get('id'))


	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');
		console.log('ID del evento:', id);
	}
}
