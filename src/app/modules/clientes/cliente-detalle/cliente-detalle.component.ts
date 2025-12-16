import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientesService } from '../../../core/services/clientes.service';
import { Cliente } from '../../../core/models/cliente.model';

import { DireccionesSectionComponent } from './sections/direcciones-section.component';
import { ContactosSectionComponent } from './sections/contactos-section.component';
import { HistorialSectionComponent } from './sections/historial-section.component';
import { ClienteDialogComponent } from '../lista-clientes/cliente-dialog/cliente-dialog.component';
import { ChipComponent } from '../../../shared/components/chip';

@Component({
	selector: 'app-cliente-detalle',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatTabsModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		MatProgressSpinnerModule,
		MatCardModule,
		MatDividerModule,
		MatTooltipModule,
		MatDialogModule,
		DireccionesSectionComponent,
		ContactosSectionComponent,
		HistorialSectionComponent,
		ChipComponent,
	],
	templateUrl: './cliente-detalle.component.html',
	styleUrl: './cliente-detalle.component.scss',
})
export class ClienteDetalleComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private clientesService = inject(ClientesService);
	private dialog = inject(MatDialog);

	// Signals
	currentClienteId = signal(this.route.snapshot.paramMap.get('id'));
	currentCliente = signal<Cliente | null>(null);
	isLoading = signal(true);
	hasError = signal(false);

	// Computed
	direccionPrincipal = computed(() => {
		const cliente = this.currentCliente();
		return cliente?.direcciones[0]?.formatted.line1 || 'Sin dirección';
	});

	totalDirecciones = computed(() => {
		return this.currentCliente()?.direcciones.length || 0;
	});

	ngOnInit(): void {
		this.loadCliente();
	}

	private loadCliente(): void {
		const id = this.route.snapshot.paramMap.get('id');

		if (!id) {
			this.hasError.set(true);
			this.isLoading.set(false);
			return;
		}

		this.clientesService.getClienteById(Number(id)).subscribe({
			next: (response) => {
				if (
					response.success &&
					response.data &&
					!Array.isArray(response.data)
				) {
					this.currentCliente.set(response.data);
					this.hasError.set(false);
				} else {
					this.hasError.set(true);
				}
				this.isLoading.set(false);
			},
			error: (err) => {
				console.error('Error al cargar cliente:', err);
				this.hasError.set(true);
				this.isLoading.set(false);
			},
		});
	}

	goBack(): void {
		this.router.navigate(['/clientes']);
	}

	editCliente(): void {
		const dialogRef = this.dialog.open(ClienteDialogComponent, {
			width: '900px',
			maxHeight: '90vh',
			data: {
				cliente: this.currentCliente(),
				modo: 'editar',
			},
			disableClose: true,
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				// Recargar datos del cliente
				this.loadCliente();
			}
		});
	}

	copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text);
	}
}
