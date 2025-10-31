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
import { EventoHistorial } from '../../../core/models/evento-historial.model';
import { HistorialEventosService } from './historial-eventos.service';
import { HistorialEventosDialogComponent } from './historial-eventos-dialog/historial-eventos-dialog.component';

@Component({
	selector: 'app-historial-eventos',
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
	],
	templateUrl: './historial-eventos.component.html',
	styleUrl: './historial-eventos.component.scss',
})
export class HistorialEventosComponent implements OnInit {
	private eventosService = inject(HistorialEventosService);
	private dialog = inject(MatDialog);
	private snackBar = inject(MatSnackBar);

	displayedColumns: string[] = [
		'id',
		'cliente',
		'tipoEvento',
		'fechaEvento',
		'lugar',
		'montoTotal',
		'actions',
	];
	dataSource = new MatTableDataSource<EventoHistorial>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	ngOnInit(): void {
		this.loadEventos();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
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
		const dialogRef = this.dialog.open(HistorialEventosDialogComponent, {
			width: '600px',
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

	openEditDialog(evento: EventoHistorial): void {
		const dialogRef = this.dialog.open(HistorialEventosDialogComponent, {
			width: '600px',
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

	deleteEvento(evento: EventoHistorial): void {
		if (
			confirm(
				`¿Estás seguro de que deseas eliminar el evento de ${evento.cliente}?`,
			)
		) {
			this.eventosService.deleteEvento(evento.id).subscribe({
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

	formatCurrency(amount: number | undefined): string {
		if (!amount) return 'N/A';
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(amount);
	}

	formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'long',
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
