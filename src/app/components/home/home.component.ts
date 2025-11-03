import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	features = [
		{
			icon: 'business',
			title: 'Espacios Únicos',
			description:
				'Amplia selección de salones y jardines diseñados para todo tipo de eventos',
		},
		{
			icon: 'verified',
			title: 'Calidad Garantizada',
			description:
				'Inmuebles con mantenimiento constante y las mejores instalaciones',
		},
		{
			icon: 'support_agent',
			title: 'Asesoría Personalizada',
			description: 'Nuestro equipo te guía para encontrar el lugar perfecto',
		},
		{
			icon: 'location_city',
			title: 'Ubicación Estratégica',
			description: 'Espacios accesibles en Tehuacán y sus alrededores',
		},
	];

	constructor(private router: Router) {}

	exploreProperties(): void {
		this.router.navigate(['/catalogos/salones']);
	}

	contactUs(): void {
		// Navegar a contacto o abrir modal
		window.location.href = 'mailto:contacto@festum.com';
	}

	trackByIndex(index: number): number {
		return index;
	}
}
