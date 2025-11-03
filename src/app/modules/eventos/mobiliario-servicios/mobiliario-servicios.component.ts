import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MobiliarioServiciosDialogComponent } from './mobiliario-servicios-dialog/mobiliario-servicios-dialog.component';

export interface MobiliarioServicio {
	id: number;
	tipo: 'Mobiliario' | 'Servicio';
	nombre: string;
	descripcion: string;
	cantidad: number;
	precioUnitario: number;
	subtotal: number;
	estado: 'Disponible' | 'Reservado' | 'Entregado';
}

@Component({
	selector: 'app-mobiliario-servicios',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatTooltipModule,
		MatCardModule,
		MatDialogModule,
		MatSnackBarModule,
	],
	templateUrl: './mobiliario-servicios.component.html',
	styleUrl: './mobiliario-servicios.component.scss',
})
export class MobiliarioServiciosComponent {
	private dialog = inject(MatDialog);
	private snackBar = inject(MatSnackBar);

	// Controles de filtro
	searchControl = new FormControl('');
	tipoControl = new FormControl('');
	estadoControl = new FormControl('');

	// Datos mock
	items = signal<MobiliarioServicio[]>([
		{
			id: 1,
			tipo: 'Mobiliario',
			nombre: 'Silla Tiffany Blanca',
			descripcion: 'Silla elegante estilo Tiffany en color blanco',
			cantidad: 120,
			precioUnitario: 45.0,
			subtotal: 5400.0,
			estado: 'Reservado',
		},
		{
			id: 2,
			tipo: 'Mobiliario',
			nombre: 'Mesa Redonda 10 personas',
			descripcion: 'Mesa redonda con capacidad para 10 comensales',
			cantidad: 12,
			precioUnitario: 350.0,
			subtotal: 4200.0,
			estado: 'Entregado',
		},
		{
			id: 3,
			tipo: 'Servicio',
			nombre: 'Servicio de Meseros',
			descripcion: 'Personal capacitado para atención a invitados',
			cantidad: 8,
			precioUnitario: 800.0,
			subtotal: 6400.0,
			estado: 'Reservado',
		},
		{
			id: 4,
			tipo: 'Mobiliario',
			nombre: 'Mantel Blanco Premium',
			descripcion: 'Mantelería de alta calidad en color blanco',
			cantidad: 15,
			precioUnitario: 120.0,
			subtotal: 1800.0,
			estado: 'Disponible',
		},
		{
			id: 5,
			tipo: 'Servicio',
			nombre: 'Iluminación LED Ambiental',
			descripcion: 'Sistema de iluminación LED con control de colores',
			cantidad: 1,
			precioUnitario: 2500.0,
			subtotal: 2500.0,
			estado: 'Reservado',
		},
		{
			id: 6,
			tipo: 'Servicio',
			nombre: 'Equipo de Sonido Profesional',
			descripcion: 'Sistema de audio completo con micrófonos y bocinas',
			cantidad: 1,
			precioUnitario: 3500.0,
			subtotal: 3500.0,
			estado: 'Entregado',
		},
	]);

	// Columnas de la tabla
	displayedColumns: string[] = [
		'tipo',
		'nombre',
		'descripcion',
		'cantidad',
		'precioUnitario',
		'subtotal',
		'estado',
		'acciones',
	];

	// Items filtrados basados en los controles de búsqueda
	filteredItems = computed(() => {
		const search = this.searchControl.value?.toLowerCase() || '';
		const tipo = this.tipoControl.value || '';
		const estado = this.estadoControl.value || '';

		return this.items().filter((item) => {
			const matchSearch =
				!search ||
				item.nombre.toLowerCase().includes(search) ||
				item.descripcion.toLowerCase().includes(search);

			const matchTipo = !tipo || item.tipo === tipo;
			const matchEstado = !estado || item.estado === estado;

			return matchSearch && matchTipo && matchEstado;
		});
	});

	// Cálculos de totales
	subtotalGeneral = computed(() => {
		return this.items().reduce((sum, item) => sum + item.subtotal, 0);
	});

	iva = computed(() => {
		return this.subtotalGeneral() * 0.16; // 16% IVA
	});

	totalGeneral = computed(() => {
		return this.subtotalGeneral() + this.iva();
	});

	openDialog(item?: MobiliarioServicio): void {
		const dialogRef = this.dialog.open(MobiliarioServiciosDialogComponent, {
			width: '600px',
			data: item || null,
		});

		dialogRef
			.afterClosed()
			.subscribe((result: MobiliarioServicio | undefined) => {
				if (result) {
					if (item) {
						this.updateItem(result);
					} else {
						this.addItem(result);
					}
				}
			});
	}

	addItem(item: MobiliarioServicio): void {
		const newId = Math.max(...this.items().map((i) => i.id), 0) + 1;
		const newItem = {
			...item,
			id: newId,
			subtotal: item.cantidad * item.precioUnitario,
		};

		this.items.update((items) => [...items, newItem]);
		this.snackBar.open('Elemento agregado correctamente', 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}

	updateItem(item: MobiliarioServicio): void {
		this.items.update((items) =>
			items.map((i) =>
				i.id === item.id
					? { ...item, subtotal: item.cantidad * item.precioUnitario }
					: i,
			),
		);
		this.snackBar.open('Elemento actualizado correctamente', 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}

	deleteItem(id: number): void {
		const item = this.items().find((i) => i.id === id);
		this.items.update((items) => items.filter((i) => i.id !== id));
		this.snackBar.open(`"${item?.nombre}" eliminado del evento`, 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}

	updateQuantity(item: MobiliarioServicio, newQuantity: number): void {
		if (newQuantity < 1) {
			this.snackBar.open('La cantidad debe ser mayor a 0', 'Cerrar', {
				duration: 2000,
				horizontalPosition: 'end',
				verticalPosition: 'top',
			});
			return;
		}

		const updatedItem = {
			...item,
			cantidad: newQuantity,
			subtotal: newQuantity * item.precioUnitario,
		};

		this.updateItem(updatedItem);
	}

	clearFilters(): void {
		this.searchControl.setValue('');
		this.tipoControl.setValue('');
		this.estadoControl.setValue('');
	}

	getEstadoColor(estado: string): string {
		switch (estado) {
			case 'Disponible':
				return 'primary';
			case 'Reservado':
				return 'accent';
			case 'Entregado':
				return '';
			default:
				return '';
		}
	}

	getEstadoIcon(estado: string): string {
		switch (estado) {
			case 'Disponible':
				return 'check_circle';
			case 'Reservado':
				return 'schedule';
			case 'Entregado':
				return 'local_shipping';
			default:
				return 'help';
		}
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(value);
	}

	trackByItem(_index: number, item: MobiliarioServicio): number {
		return item.id;
	}
}
