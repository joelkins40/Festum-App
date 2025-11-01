import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ListaEventosService, Evento } from './lista-eventos.service';
import { EventoListaDialogComponent } from './evento-lista-dialog/evento-lista-dialog.component';

@Component({
	selector: 'app-lista',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatDialogModule,
		MatSnackBarModule,
		MatChipsModule,
		MatTooltipModule,
	],
	templateUrl: './lista.component.html',
	styleUrl: './lista.component.scss',
})
export class ListaComponent implements OnInit {
	private eventosService = inject(ListaEventosService);
	private dialog = inject(MatDialog);
	private snackBar = inject(MatSnackBar);

	displayedColumns: string[] = [
		'folio',
		'nombreEvento',
		'cliente',
		'lugar',
		'fechaRecepcion',
		'fechaRegreso',
		'total',
		'actions',
	];
	dataSource = new MatTableDataSource<Evento>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	ngOnInit(): void {
		this.loadEventos();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		// Configurar filtro personalizado
		this.dataSource.filterPredicate = (data: Evento, filter: string) => {
			const searchStr = filter.toLowerCase();
			return (
				data.folio.toLowerCase().includes(searchStr) ||
				data.nombreEvento.toLowerCase().includes(searchStr) ||
				data.cliente.nombre.toLowerCase().includes(searchStr) ||
				this.getLugarDisplay(data.lugar).toLowerCase().includes(searchStr)
			);
		};
	}

	loadEventos(): void {
		this.eventosService.getEventos().subscribe({
			next: (response) => {
				if (response.success && Array.isArray(response.data)) {
					this.dataSource.data = response.data;
				}
			},
			error: () => {
				this.showMessage('Error al cargar eventos', 'error');
			},
		});
	}

	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	openCreateDialog(): void {
		const dialogRef = this.dialog.open(EventoListaDialogComponent, {
			width: '800px',
			maxHeight: '90vh',
			data: { mode: 'create' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.eventosService.createEvento(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.loadEventos();
							this.showMessage('Evento creado exitosamente', 'success');
						}
					},
					error: () => {
						this.showMessage('Error al crear evento', 'error');
					},
				});
			}
		});
	}

	openEditDialog(evento: Evento): void {
		const dialogRef = this.dialog.open(EventoListaDialogComponent, {
			width: '800px',
			maxHeight: '90vh',
			data: { evento, mode: 'edit' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.eventosService.updateEvento(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.loadEventos();
							this.showMessage('Evento actualizado exitosamente', 'success');
						}
					},
					error: () => {
						this.showMessage('Error al actualizar evento', 'error');
					},
				});
			}
		});
	}

	deleteEvento(evento: Evento): void {
		if (
			confirm(
				`¿Está seguro de que desea eliminar el evento "${evento.nombreEvento}"?`,
			)
		) {
			this.eventosService.deleteEvento(evento.id ?? 0).subscribe({
				next: (response) => {
					if (response.success) {
						this.loadEventos();
						this.showMessage('Evento eliminado exitosamente', 'success');
					}
				},
				error: () => {
					this.showMessage('Error al eliminar evento', 'error');
				},
			});
		}
	}

	getLugarDisplay(lugar: Evento['lugar']): string {
		if (lugar.tipo === 'salonExistente') {
			return lugar.nombreSalon ?? 'Salón';
		} else if (lugar.direccion) {
			return `${lugar.direccion.fullAddress}, ${lugar.direccion.city}`;
		}
		return 'Sin ubicación';
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(value);
	}

	formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	private showMessage(message: string, type: 'success' | 'error'): void {
		this.snackBar.open(message, 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
		});
	}
}
