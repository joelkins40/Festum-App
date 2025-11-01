import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InvitadosMockService, Invitado } from './invitados-mock.service';
import { InvitadoDialogComponent } from './invitado-dialog.component';

/**
 * Componente para gestionar la lista de invitados de un evento
 */
@Component({
	selector: 'app-invitados',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatPaginatorModule,
		MatSortModule,
		MatChipsModule,
		MatTooltipModule,
		MatSnackBarModule,
	],
	templateUrl: './invitados.component.html',
	styleUrl: './invitados.component.scss',
})
export class InvitadosComponent implements OnInit {
	// Dependency injection usando inject()
	private readonly invitadosService = inject(InvitadosMockService);
	private readonly dialog = inject(MatDialog);
	private readonly snackBar = inject(MatSnackBar);

	// Data source para la tabla
	dataSource = new MatTableDataSource<Invitado>([]);

	// Referencias a paginador y ordenamiento
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	// Columnas a mostrar en la tabla
	displayedColumns: string[] = [
		'id',
		'fullName',
		'contactPhone',
		'secondaryContactPhone',
		'email',
		'numberOfCompanions',
		'willAttend',
		'actions',
	];

	// Estadísticas de invitados
	stats = {
		total: 0,
		confirmed: 0,
		pending: 0,
		totalCompanions: 0,
	};

	ngOnInit(): void {
		this.loadInvitados();
		this.loadStats();
	}

	/**
	 * Carga la lista de invitados desde el servicio
	 */
	loadInvitados(): void {
		this.invitadosService.getInvitados().subscribe({
			next: (response) => {
				if (response.success && Array.isArray(response.data)) {
					this.dataSource.data = response.data;
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;

					// Configurar filtro personalizado
					this.dataSource.filterPredicate = (
						data: Invitado,
						filter: string,
					) => {
						const searchStr = filter.toLowerCase();
						return (
							data.fullName.toLowerCase().includes(searchStr) ||
							data.contactPhone.includes(searchStr) ||
							data.secondaryContactPhone?.includes(searchStr) ||
							data.email?.toLowerCase().includes(searchStr) ||
							data.id.toString().includes(searchStr)
						);
					};
				}
			},
			error: (error) => {
				console.error('Error al cargar invitados:', error);
				this.showMessage('Error al cargar invitados', 'error');
			},
		});
	}

	/**
	 * Carga las estadísticas de invitados
	 */
	loadStats(): void {
		this.invitadosService.getStats().subscribe({
			next: (stats) => {
				this.stats = stats;
			},
		});
	}

	/**
	 * Aplica el filtro de búsqueda a la tabla
	 */
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * Abre el diálogo para crear un nuevo invitado
	 */
	openCreateDialog(): void {
		const dialogRef = this.dialog.open(InvitadoDialogComponent, {
			width: '600px',
			data: { mode: 'create' },
		});

		dialogRef.afterClosed().subscribe((result: Invitado | undefined) => {
			if (result) {
				this.invitadosService.createInvitado(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.showMessage('Invitado creado exitosamente', 'success');
							this.loadInvitados();
							this.loadStats();
						}
					},
					error: (error) => {
						console.error('Error al crear invitado:', error);
						this.showMessage('Error al crear invitado', 'error');
					},
				});
			}
		});
	}

	/**
	 * Abre el diálogo para editar un invitado existente
	 */
	openEditDialog(invitado: Invitado): void {
		const dialogRef = this.dialog.open(InvitadoDialogComponent, {
			width: '600px',
			data: { invitado, mode: 'edit' },
		});

		dialogRef.afterClosed().subscribe((result: Invitado | undefined) => {
			if (result) {
				this.invitadosService.updateInvitado(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.showMessage('Invitado actualizado exitosamente', 'success');
							this.loadInvitados();
							this.loadStats();
						}
					},
					error: (error) => {
						console.error('Error al actualizar invitado:', error);
						this.showMessage('Error al actualizar invitado', 'error');
					},
				});
			}
		});
	}

	/**
	 * Elimina un invitado después de confirmación
	 */
	deleteInvitado(invitado: Invitado): void {
		const confirmed = confirm(
			`¿Está seguro de eliminar al invitado "${invitado.fullName}"?`,
		);

		if (confirmed) {
			this.invitadosService.deleteInvitado(invitado.id).subscribe({
				next: (response) => {
					if (response.success) {
						this.showMessage('Invitado eliminado exitosamente', 'success');
						this.loadInvitados();
						this.loadStats();
					}
				},
				error: (error) => {
					console.error('Error al eliminar invitado:', error);
					this.showMessage('Error al eliminar invitado', 'error');
				},
			});
		}
	}

	/**
	 * Muestra un mensaje usando MatSnackBar
	 */
	private showMessage(
		message: string,
		type: 'success' | 'error' | 'info',
	): void {
		this.snackBar.open(message, 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: [`snackbar-${type}`],
		});
	}

	/**
	 * Calcula el total de personas (invitados + acompañantes confirmados)
	 */
	getTotalPeople(): number {
		return this.stats.confirmed + this.stats.totalCompanions;
	}
}
