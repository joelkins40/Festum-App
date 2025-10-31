import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DireccionCliente } from './direccion.model';
import { DireccionesService } from './direcciones.service';
import { DireccionDialogComponent } from './direccion-dialog/direccion-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'app-direcciones',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatDialogModule,
		MatChipsModule,
		MatTooltipModule,
	],
	templateUrl: './direcciones.component.html',
	styleUrl: './direcciones.component.scss',
})
export class DireccionesComponent implements OnInit {
	private direccionesService = inject(DireccionesService);
	private snackBar = inject(MatSnackBar);
	private dialog = inject(MatDialog);

	dataSource = new MatTableDataSource<DireccionCliente>([]);
	displayedColumns: string[] = [
		'id',
		'cliente',
		'fullAddress',
		'city',
		'state',
		'creationDate',
		'active',
		'actions',
	];

	loading = false;
	searchText = '';

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	ngOnInit(): void {
		this.loadDirecciones();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.dataSource.filterPredicate = (
			data: DireccionCliente,
			filter: string,
		) =>
			data.cliente.toLowerCase().includes(filter.toLowerCase()) ||
			data.city.toLowerCase().includes(filter.toLowerCase()) ||
			data.state.toLowerCase().includes(filter.toLowerCase());
	}

	loadDirecciones(): void {
		this.loading = true;
		this.direccionesService.getDirecciones().subscribe({
			next: (response) => {
				if (response.success && response.data) {
					this.dataSource.data = response.data as DireccionCliente[];
				}
				this.loading = false;
			},
			error: () => {
				this.showError('Error al cargar direcciones');
				this.loading = false;
			},
		});
	}

	applyFilter(): void {
		this.dataSource.filter = this.searchText.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	clearFilter(): void {
		this.searchText = '';
		this.applyFilter();
	}

	createDireccion(): void {
		const dialogRef = this.dialog.open(DireccionDialogComponent, {
			width: '800px',
			disableClose: true,
			data: { mode: 'create' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.direccionesService.createDireccion(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.showSuccess(response.message);
							this.loadDirecciones();
						}
					},
					error: () => this.showError('Error al crear dirección'),
				});
			}
		});
	}

	editDireccion(direccion: DireccionCliente): void {
		const dialogRef = this.dialog.open(DireccionDialogComponent, {
			width: '800px',
			disableClose: true,
			data: { mode: 'edit', direccion: { ...direccion } },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.direccionesService.updateDireccion(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.showSuccess(response.message);
							this.loadDirecciones();
						}
					},
					error: () => this.showError('Error al actualizar dirección'),
				});
			}
		});
	}

	deleteDireccion(direccion: DireccionCliente): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				titulo: 'Confirmar Eliminación',
				mensaje: `¿Está seguro de eliminar la dirección de ${direccion.cliente}?`,
				textoConfirmar: 'Eliminar',
				textoCancel: 'Cancelar',
			},
		});

		dialogRef.afterClosed().subscribe((confirmed) => {
			if (confirmed) {
				this.direccionesService.deleteDireccion(direccion.id).subscribe({
					next: (response) => {
						if (response.success) {
							this.showSuccess(response.message);
							this.loadDirecciones();
						}
					},
					error: () => this.showError('Error al eliminar dirección'),
				});
			}
		});
	}

	toggleActive(direccion: DireccionCliente): void {
		this.direccionesService.toggleActive(direccion.id).subscribe({
			next: (response) => {
				if (response.success) {
					this.showSuccess(response.message);
					this.loadDirecciones();
				}
			},
			error: () => this.showError('Error al cambiar estado'),
		});
	}

	private showSuccess(message: string): void {
		this.snackBar.open(message, 'Cerrar', {
			duration: 3000,
			panelClass: ['success-snackbar'],
		});
	}

	private showError(message: string): void {
		this.snackBar.open(message, 'Cerrar', {
			duration: 5000,
			panelClass: ['error-snackbar'],
		});
	}
}
