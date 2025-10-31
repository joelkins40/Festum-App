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

import { Contacto } from '../../../core/models/contacto.model';
import { ContactosService } from './contactos.service';
import { ContactoDialogComponent } from './contacto-dialog/contacto-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'app-contactos-frecuentes',
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
	templateUrl: './contactos-frecuentes.component.html',
	styleUrl: './contactos-frecuentes.component.scss',
})
export class ContactosFrecuentesComponent implements OnInit {
	private contactosService = inject(ContactosService);
	private snackBar = inject(MatSnackBar);
	private dialog = inject(MatDialog);

	dataSource = new MatTableDataSource<Contacto>([]);
	displayedColumns: string[] = [
		'id',
		'nombre',
		'phone',
		'email',
		'contactoAlternativo',
		'clientePreferente',
		'activo',
		'fechaCreacion',
		'actions',
	];

	loading = false;
	searchText = '';

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	ngOnInit(): void {
		this.loadContactos();
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.dataSource.filterPredicate = (data: Contacto, filter: string) =>
			data.nombre.toLowerCase().includes(filter.toLowerCase()) ||
			data.informacionDeContacto.email
				.toLowerCase()
				.includes(filter.toLowerCase()) ||
			data.informacionDeContacto.phone
				.toLowerCase()
				.includes(filter.toLowerCase());
	}

	loadContactos(): void {
		this.loading = true;
		this.contactosService.getContactos().subscribe({
			next: (response) => {
				if (response.success && response.data) {
					this.dataSource.data = response.data as Contacto[];
				}
				this.loading = false;
			},
			error: () => {
				this.showError('Error al cargar contactos');
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

	createContacto(): void {
		const dialogRef = this.dialog.open(ContactoDialogComponent, {
			width: '700px',
			disableClose: true,
			data: { mode: 'create' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.contactosService.createContacto(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.showSuccess(response.message);
							this.loadContactos();
						}
					},
					error: () => this.showError('Error al crear contacto'),
				});
			}
		});
	}

	editContacto(contacto: Contacto): void {
		const dialogRef = this.dialog.open(ContactoDialogComponent, {
			width: '700px',
			disableClose: true,
			data: { mode: 'edit', contacto: { ...contacto } },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.contactosService.updateContacto(result).subscribe({
					next: (response) => {
						if (response.success) {
							this.showSuccess(response.message);
							this.loadContactos();
						}
					},
					error: () => this.showError('Error al actualizar contacto'),
				});
			}
		});
	}

	deleteContacto(contacto: Contacto): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				titulo: 'Confirmar Eliminación',
				mensaje: `¿Está seguro de eliminar el contacto de ${contacto.nombre}?`,
				textoConfirmar: 'Eliminar',
				textoCancel: 'Cancelar',
			},
		});

		dialogRef.afterClosed().subscribe((confirmed) => {
			if (confirmed) {
				this.contactosService.deleteContacto(contacto.id).subscribe({
					next: (response) => {
						if (response.success) {
							this.showSuccess(response.message);
							this.loadContactos();
						}
					},
					error: () => this.showError('Error al eliminar contacto'),
				});
			}
		});
	}

	toggleActive(contacto: Contacto): void {
		this.contactosService.toggleActive(contacto.id).subscribe({
			next: (response) => {
				if (response.success) {
					this.showSuccess(response.message);
					this.loadContactos();
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
