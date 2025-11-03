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
import { Invitado } from './invitados-mock.service';
import { InvitadoDialogComponent } from './invitado-dialog.component';

export interface Evento {
	id: number;
	cliente: string;
	tipoEvento: string;
	fechaEvento: Date;
	lugar: string;
	montoTotal?: number;
	invitados: Invitado[];
}

/**
 * Componente para gestionar múltiples eventos y sus invitados
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
	private readonly dialog = inject(MatDialog);
	private readonly snackBar = inject(MatSnackBar);

	// Data sources para las tablas
	eventosDataSource = new MatTableDataSource<Evento>([]);
	invitadosDataSource = new MatTableDataSource<Invitado>([]);

	// Referencias a paginador y ordenamiento para invitados
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	// Evento seleccionado actualmente
	selectedEvento: Evento | null = null;

	// Columnas para tabla de eventos
	eventosDisplayedColumns: string[] = [
		'id',
		'cliente',
		'tipoEvento',
		'fechaEvento',
		'lugar',
		'montoTotal',
		'actions',
	];

	// Columnas para tabla de invitados
	invitadosDisplayedColumns: string[] = [
		'id',
		'fullName',
		'contactPhone',
		'secondaryContactPhone',
		'email',
		'numberOfCompanions',
		'willAttend',
		'actions',
	];

	// Datos mock de eventos con sus invitados
	eventos: Evento[] = [
		{
			id: 1,
			cliente: 'María González',
			tipoEvento: 'Boda',
			fechaEvento: new Date('2025-12-15'),
			lugar: 'Salón Imperial',
			montoTotal: 150000,
			invitados: [
				{
					id: 1,
					fullName: 'Patricia López Hernández',
					contactPhone: '+52 55 1234 5678',
					secondaryContactPhone: '+52 55 8765 4321',
					email: 'patricia.lopez@email.com',
					numberOfCompanions: 3,
					willAttend: true,
				},
				{
					id: 2,
					fullName: 'Fernando García Ruiz',
					contactPhone: '+52 33 2345 6789',
					email: 'fernando.garcia@email.com',
					numberOfCompanions: 2,
					willAttend: true,
				},
				{
					id: 3,
					fullName: 'Gabriela Martínez Silva',
					contactPhone: '+52 81 3456 7890',
					secondaryContactPhone: '+52 81 9876 5432',
					email: 'gabriela.martinez@email.com',
					numberOfCompanions: 1,
					willAttend: true,
				},
				{
					id: 4,
					fullName: 'Ricardo Sánchez Torres',
					contactPhone: '+52 55 4567 8901',
					numberOfCompanions: 0,
					willAttend: false,
				},
				{
					id: 5,
					fullName: 'Daniela Fernández Castro',
					contactPhone: '+52 33 5678 9012',
					secondaryContactPhone: '+52 33 1234 9876',
					email: 'daniela.fernandez@email.com',
					numberOfCompanions: 4,
					willAttend: true,
				},
			],
		},
		{
			id: 2,
			cliente: 'Carlos Ramírez',
			tipoEvento: 'XV Años',
			fechaEvento: new Date('2025-11-20'),
			lugar: 'Jardín Las Rosas',
			montoTotal: 85000,
			invitados: [
				{
					id: 6,
					fullName: 'Andrea Ramírez González',
					contactPhone: '+52 81 6789 0123',
					email: 'andrea.ramirez@email.com',
					numberOfCompanions: 2,
					willAttend: true,
				},
				{
					id: 7,
					fullName: 'Luis Miguel Pérez',
					contactPhone: '+52 55 7890 1234',
					secondaryContactPhone: '+52 55 4321 8765',
					email: 'luis.perez@email.com',
					numberOfCompanions: 1,
					willAttend: true,
				},
				{
					id: 8,
					fullName: 'Carolina Morales López',
					contactPhone: '+52 33 8901 2345',
					numberOfCompanions: 3,
					willAttend: true,
				},
				{
					id: 9,
					fullName: 'Roberto Torres Jiménez',
					contactPhone: '+52 81 9012 3456',
					email: 'roberto.torres@email.com',
					numberOfCompanions: 0,
					willAttend: false,
				},
			],
		},
		{
			id: 3,
			cliente: 'Ana Martínez',
			tipoEvento: 'Cumpleaños',
			fechaEvento: new Date('2025-12-01'),
			lugar: 'Terraza Vista Hermosa',
			montoTotal: 45000,
			invitados: [
				{
					id: 10,
					fullName: 'José Luis Hernández',
					contactPhone: '+52 55 1122 3344',
					secondaryContactPhone: '+52 55 5566 7788',
					email: 'jose.hernandez@email.com',
					numberOfCompanions: 2,
					willAttend: true,
				},
				{
					id: 11,
					fullName: 'Mónica Castro Vargas',
					contactPhone: '+52 33 2233 4455',
					email: 'monica.castro@email.com',
					numberOfCompanions: 1,
					willAttend: true,
				},
				{
					id: 12,
					fullName: 'Alberto Díaz Moreno',
					contactPhone: '+52 81 3344 5566',
					numberOfCompanions: 0,
					willAttend: true,
				},
			],
		},
		{
			id: 4,
			cliente: 'Roberto Silva',
			tipoEvento: 'Graduación',
			fechaEvento: new Date('2025-11-30'),
			lugar: 'Salón Real',
			montoTotal: 62000,
			invitados: [
				{
					id: 13,
					fullName: 'Sandra Ortiz Méndez',
					contactPhone: '+52 55 4455 6677',
					secondaryContactPhone: '+52 55 8899 0011',
					email: 'sandra.ortiz@email.com',
					numberOfCompanions: 2,
					willAttend: true,
				},
				{
					id: 14,
					fullName: 'Eduardo Gómez Reyes',
					contactPhone: '+52 33 5566 7788',
					email: 'eduardo.gomez@email.com',
					numberOfCompanions: 1,
					willAttend: false,
				},
				{
					id: 15,
					fullName: 'Claudia Ramos Gutiérrez',
					contactPhone: '+52 81 6677 8899',
					numberOfCompanions: 3,
					willAttend: true,
				},
				{
					id: 16,
					fullName: 'Miguel Ángel Vega',
					contactPhone: '+52 55 7788 9900',
					secondaryContactPhone: '+52 55 1122 9988',
					email: 'miguel.vega@email.com',
					numberOfCompanions: 0,
					willAttend: true,
				},
			],
		},
	];

	// Estadísticas de invitados
	stats = {
		total: 0,
		confirmed: 0,
		pending: 0,
		totalCompanions: 0,
	};

	/**
	 * Inicialización del componente
	 */
	ngOnInit(): void {
		this.loadEventos();
	}

	/**
	 * Carga la lista de eventos
	 */
	loadEventos(): void {
		// Por ahora usamos datos mock, en el futuro se cargaría desde un servicio
		this.eventosDataSource.data = this.eventos;
	}

	/**
	 * Selecciona un evento y carga sus invitados
	 */
	selectEvento(evento: Evento): void {
		this.selectedEvento = evento;
		this.loadInvitadosForEvento(evento);
	}

	/**
	 * Carga la lista de invitados para un evento específico
	 */
	loadInvitadosForEvento(evento: Evento): void {
		// Cargar los invitados del evento seleccionado
		this.invitadosDataSource.data = evento.invitados;

		// Configurar paginador y ordenamiento después de que la vista se haya inicializado
		setTimeout(() => {
			this.invitadosDataSource.paginator = this.paginator;
			this.invitadosDataSource.sort = this.sort;
		});

		// Configurar el filtro personalizado
		this.invitadosDataSource.filterPredicate = (
			data: Invitado,
			filter: string,
		) => {
			const dataStr =
				`${data.fullName} ${data.contactPhone} ${data.email || ''}`.toLowerCase();
			return dataStr.includes(filter);
		};

		// Calcular estadísticas basadas en los invitados del evento
		this.calculateStats(evento.invitados);
	}

	/**
	 * Calcula las estadísticas de invitados
	 */
	calculateStats(invitados: Invitado[]): void {
		this.stats.total = invitados.length;
		this.stats.confirmed = invitados.filter((i) => i.willAttend).length;
		this.stats.pending = invitados.filter((i) => !i.willAttend).length;
		this.stats.totalCompanions = invitados
			.filter((i) => i.willAttend)
			.reduce((sum, i) => sum + i.numberOfCompanions, 0);
	}

	/**
	 * Elimina un evento después de confirmación
	 */
	deleteEvento(evento: Evento): void {
		const confirmed = confirm(
			`¿Está seguro de eliminar el evento "${evento.tipoEvento} - ${evento.cliente}"?`,
		);

		if (confirmed) {
			// Eliminar del array
			this.eventos = this.eventos.filter((e) => e.id !== evento.id);
			this.eventosDataSource.data = this.eventos;

			// Si era el evento seleccionado, limpiar selección
			if (this.selectedEvento?.id === evento.id) {
				this.selectedEvento = null;
				this.invitadosDataSource.data = [];
				this.stats = {
					total: 0,
					confirmed: 0,
					pending: 0,
					totalCompanions: 0,
				};
			}

			this.showMessage('Evento eliminado exitosamente', 'success');
		}
	}

	/**
	 * Importa invitados desde un archivo CSV
	 */
	importarCSV(): void {
		if (!this.selectedEvento) {
			this.showMessage('Debe seleccionar un evento primero', 'info');
			return;
		}

		// TODO: Implementar lógica de importación CSV
		this.showMessage('Funcionalidad de importación en desarrollo', 'info');
	}

	/**
	 * Exporta la lista de invitados a CSV
	 */
	exportarCSV(): void {
		if (!this.selectedEvento) {
			this.showMessage('Debe seleccionar un evento primero', 'info');
			return;
		}

		// TODO: Implementar lógica de exportación CSV
		this.showMessage('Funcionalidad de exportación en desarrollo', 'info');
	}

	/**
	 * Aplica el filtro de búsqueda a la tabla de invitados
	 */
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.invitadosDataSource.filter = filterValue.trim().toLowerCase();

		if (this.invitadosDataSource.paginator) {
			this.invitadosDataSource.paginator.firstPage();
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
			if (result && this.selectedEvento) {
				// Agregar el invitado al evento seleccionado
				const newId =
					Math.max(...this.selectedEvento.invitados.map((i) => i.id), 0) + 1;
				const newInvitado = { ...result, id: newId };
				this.selectedEvento.invitados.push(newInvitado);

				// Recargar la vista
				this.loadInvitadosForEvento(this.selectedEvento);
				this.showMessage('Invitado creado exitosamente', 'success');
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
			if (result && this.selectedEvento) {
				// Actualizar el invitado en el evento seleccionado
				const index = this.selectedEvento.invitados.findIndex(
					(i) => i.id === result.id,
				);
				if (index !== -1) {
					this.selectedEvento.invitados[index] = result;
					this.loadInvitadosForEvento(this.selectedEvento);
					this.showMessage('Invitado actualizado exitosamente', 'success');
				}
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

		if (confirmed && this.selectedEvento) {
			// Eliminar el invitado del evento seleccionado
			this.selectedEvento.invitados = this.selectedEvento.invitados.filter(
				(i) => i.id !== invitado.id,
			);
			this.loadInvitadosForEvento(this.selectedEvento);
			this.showMessage('Invitado eliminado exitosamente', 'success');
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
