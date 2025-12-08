import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import {
	Nota,
	TipoNota,
	EstadoNota,
	Cliente,
	Evento,
	EstadisticasNotas,
} from '../../../core/models/notas.models';
import { FacturacionDialogComponent } from './facturacion-dialog/facturacion-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ButtonComponent } from "../../../shared/components/button";

interface InvoiceFormData {
	id?: number;
	tipo: TipoNota;
	clienteId: number;
	eventoId: number;
	fecha: Date;
	total: number;
	estado: EstadoNota;
	descripcion?: string;
}

@Component({
	selector: 'app-facturacion',
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
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatSelectModule,
    ButtonComponent
],
	templateUrl: './facturacion.component.html',
	styleUrl: './facturacion.component.scss',
})
export class FacturacionComponent implements OnInit {
	// Tabla y datos
	dataSource = new MatTableDataSource<Nota>([]);
	columnasDisplayed: string[] = [
		'tipo',
		'folio',
		'cliente',
		'evento',
		'fecha',
		'total',
		'estado',
		'acciones',
	];

	// Filtros
	filtroTexto = '';
	filtroEstado: EstadoNota | 'Todos' = 'Todos';

	// Estados
	loading = false;
	invoices: Nota[] = [];

	// Estadísticas
	estadisticas: EstadisticasNotas = {
		totalVentasMes: 0,
		totalIngresos: 0,
		promedioVenta: 0,
		cantidadNotas: 0,
	};

	// Catálogos para filtros
	estadosNota: (EstadoNota | 'Todos')[] = [
		'Todos',
		'Pendiente',
		'Pagada',
		'Cancelada',
		'Parcial',
	];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) {}

	ngOnInit(): void {
		this.loadInvoices();
		this.calculateStatistics();
		this.setupTable();
	}

	private setupTable(): void {
		setTimeout(() => {
			if (this.paginator) {
				this.dataSource.paginator = this.paginator;
			}
			if (this.sort) {
				this.dataSource.sort = this.sort;
			}

			// Configurar filtro personalizado para búsqueda combinada
			this.dataSource.filterPredicate = (data: Nota, filter: string) => {
				const searchStr = filter.toLowerCase();
				return (
					data.folio.toLowerCase().includes(searchStr) ||
					data.cliente.nombre.toLowerCase().includes(searchStr) ||
					data.evento.nombre.toLowerCase().includes(searchStr) ||
					data.tipo.toLowerCase().includes(searchStr) ||
					data.estado.toLowerCase().includes(searchStr)
				);
			};
		});
	}

	private loadInvoices(): void {
		this.loading = true;

		// Mock data - simular llamada a API
		setTimeout(() => {
			this.invoices = this.generateMockInvoices();
			this.dataSource.data = this.invoices;
			this.loading = false;
			this.calculateStatistics();
		}, 800);
	}

	private generateMockInvoices(): Nota[] {
		const clientes: Cliente[] = [
			{
				id: 1,
				nombre: 'María García López',
				informacionDeContacto: {
					telefono: '5551234567',
					email: 'maria@example.com',
				},
				clientePreferente: true,
				activo: true,
			},
			{
				id: 2,
				nombre: 'Juan Pérez Sánchez',
				informacionDeContacto: {
					telefono: '5559876543',
					email: 'juan@example.com',
				},
				clientePreferente: false,
				activo: true,
			},
			{
				id: 3,
				nombre: 'Ana Martínez Ruiz',
				informacionDeContacto: {
					telefono: '5555555555',
					email: 'ana@example.com',
				},
				clientePreferente: true,
				activo: true,
			},
			{
				id: 4,
				nombre: 'Carlos Rodríguez Torres',
				informacionDeContacto: {
					telefono: '5552222222',
					email: 'carlos@example.com',
				},
				clientePreferente: false,
				activo: true,
			},
			{
				id: 5,
				nombre: 'Laura Fernández Gómez',
				informacionDeContacto: {
					telefono: '5553333333',
					email: 'laura@example.com',
				},
				clientePreferente: true,
				activo: true,
			},
		];

		const eventos: Evento[] = [
			{
				id: 1,
				nombre: 'Boda Jardín Real',
				fecha: new Date(2025, 11, 15),
				lugar: 'Salón Jardín Real',
			},
			{
				id: 2,
				nombre: 'XV Años Elegante',
				fecha: new Date(2025, 10, 20),
				lugar: 'Salón Imperial',
			},
			{
				id: 3,
				nombre: 'Bautizo Familiar',
				fecha: new Date(2025, 11, 5),
				lugar: 'Salón Pequeño',
			},
			{
				id: 4,
				nombre: 'Graduación Universitaria',
				fecha: new Date(2025, 10, 28),
				lugar: 'Salón Principal',
			},
			{
				id: 5,
				nombre: 'Aniversario Bodas de Oro',
				fecha: new Date(2025, 11, 10),
				lugar: 'Salón VIP',
			},
		];

		const tipos: TipoNota[] = ['Paquete', 'Servicio'];
		const estados: EstadoNota[] = [
			'Pendiente',
			'Pagada',
			'Cancelada',
			'Parcial',
		];

		return Array.from({ length: 25 }, (_, i) => {
			const fecha = new Date();
			fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 60));

			return {
				id: i + 1,
				tipo: tipos[Math.floor(Math.random() * tipos.length)],
				folio: `FAC-${String(i + 1).padStart(6, '0')}`,
				cliente: clientes[Math.floor(Math.random() * clientes.length)],
				evento: eventos[Math.floor(Math.random() * eventos.length)],
				fecha: fecha,
				total: Math.floor(Math.random() * 50000) + 10000,
				estado: estados[Math.floor(Math.random() * estados.length)],
				descripcion: `Factura ${i + 1} generada automáticamente`,
				fechaCreacion: fecha,
				fechaActualizacion: fecha,
			};
		});
	}

	private calculateStatistics(): void {
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();

		// Filtrar facturas del mes actual
		const invoicesThisMonth = this.invoices.filter((inv) => {
			const invDate = new Date(inv.fecha);
			return (
				invDate.getMonth() === currentMonth &&
				invDate.getFullYear() === currentYear
			);
		});

		// Calcular totales solo de facturas pagadas o parciales
		const paidInvoices = invoicesThisMonth.filter(
			(inv) => inv.estado === 'Pagada' || inv.estado === 'Parcial',
		);
		const totalIngresos = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

		this.estadisticas = {
			totalVentasMes: invoicesThisMonth.length,
			totalIngresos: totalIngresos,
			promedioVenta:
				paidInvoices.length > 0 ? totalIngresos / paidInvoices.length : 0,
			cantidadNotas: this.invoices.length,
		};
	}

	applyFilter(): void {
		let filteredData = this.invoices;

		// Aplicar filtro de texto
		if (this.filtroTexto.trim()) {
			const searchStr = this.filtroTexto.toLowerCase().trim();
			filteredData = filteredData.filter(
				(nota) =>
					nota.folio.toLowerCase().includes(searchStr) ||
					nota.cliente.nombre.toLowerCase().includes(searchStr) ||
					nota.evento.nombre.toLowerCase().includes(searchStr) ||
					nota.tipo.toLowerCase().includes(searchStr),
			);
		}

		// Aplicar filtro de estado
		if (this.filtroEstado !== 'Todos') {
			filteredData = filteredData.filter(
				(nota) => nota.estado === this.filtroEstado,
			);
		}

		this.dataSource.data = filteredData;
	}

	clearFilters(): void {
		this.filtroTexto = '';
		this.filtroEstado = 'Todos';
		this.dataSource.data = this.invoices;
	}

	openCreateDialog(): void {
		const dialogRef = this.dialog.open(FacturacionDialogComponent, {
			width: '800px',
			disableClose: true,
			data: { modo: 'crear' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.createInvoice(result);
			}
		});
	}

	openEditDialog(invoice: Nota): void {
		const dialogRef = this.dialog.open(FacturacionDialogComponent, {
			width: '800px',
			disableClose: true,
			data: { nota: invoice, modo: 'editar' },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.updateInvoice(result);
			}
		});
	}

	openDeleteDialog(invoice: Nota): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Factura',
				message: `¿Estás seguro de eliminar la factura ${invoice.folio}?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.deleteInvoice(invoice.id);
			}
		});
	}

	viewInvoice(invoice: Nota): void {
		this.snackBar.open(`Ver detalle de factura: ${invoice.folio}`, 'Cerrar', {
			duration: 3000,
		});
		// TODO: Implementar vista de detalle
	}

	private createInvoice(invoiceData: InvoiceFormData): void {
		this.loading = true;

		// Simular creación en API
		setTimeout(() => {
			const newInvoice: Nota = {
				id: this.invoices.length + 1,
				folio: `FAC-${String(this.invoices.length + 1).padStart(6, '0')}`,
				tipo: invoiceData.tipo,
				cliente: this.findClientById(invoiceData.clienteId),
				evento: this.findEventById(invoiceData.eventoId),
				fecha: invoiceData.fecha,
				total: invoiceData.total,
				estado: invoiceData.estado,
				descripcion: invoiceData.descripcion,
				fechaCreacion: new Date(),
				fechaActualizacion: new Date(),
			};

			this.invoices.unshift(newInvoice);
			this.dataSource.data = this.invoices;
			this.calculateStatistics();
			this.loading = false;

			this.snackBar.open('Factura creada exitosamente', 'Cerrar', {
				duration: 3000,
				panelClass: ['success-snackbar'],
			});
		}, 500);
	}

	private updateInvoice(invoiceData: InvoiceFormData): void {
		this.loading = true;

		// Simular actualización en API
		setTimeout(() => {
			const index = this.invoices.findIndex((inv) => inv.id === invoiceData.id);
			if (index !== -1) {
				this.invoices[index] = {
					...this.invoices[index],
					tipo: invoiceData.tipo,
					cliente: this.findClientById(invoiceData.clienteId),
					evento: this.findEventById(invoiceData.eventoId),
					fecha: invoiceData.fecha,
					total: invoiceData.total,
					estado: invoiceData.estado,
					descripcion: invoiceData.descripcion,
					fechaActualizacion: new Date(),
				};

				this.dataSource.data = this.invoices;
				this.calculateStatistics();
			}

			this.loading = false;
			this.snackBar.open('Factura actualizada exitosamente', 'Cerrar', {
				duration: 3000,
				panelClass: ['success-snackbar'],
			});
		}, 500);
	}

	private deleteInvoice(id: number): void {
		this.loading = true;

		// Simular eliminación en API
		setTimeout(() => {
			this.invoices = this.invoices.filter((inv) => inv.id !== id);
			this.dataSource.data = this.invoices;
			this.calculateStatistics();
			this.loading = false;

			this.snackBar.open('Factura eliminada exitosamente', 'Cerrar', {
				duration: 3000,
				panelClass: ['success-snackbar'],
			});
		}, 500);
	}

	// Métodos auxiliares
	private findClientById(id: number): Cliente {
		// Mock - en producción buscar en servicio
		return {
			id,
			nombre: 'Cliente Mock',
			informacionDeContacto: {
				telefono: '5551234567',
				email: 'mock@example.com',
			},
			clientePreferente: false,
			activo: true,
		};
	}

	private findEventById(id: number): Evento {
		// Mock - en producción buscar en servicio
		return {
			id,
			nombre: 'Evento Mock',
			fecha: new Date(),
			lugar: 'Salón Mock',
		};
	}

	formatCurrency(amount: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(amount);
	}

	formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	getStatusColor(estado: EstadoNota): string {
		const colors: Record<EstadoNota, string> = {
			Pendiente: 'warn',
			Pagada: 'primary',
			Cancelada: 'accent',
			Parcial: 'basic',
		};
		return colors[estado] || 'basic';
	}

	getStatusIcon(estado: EstadoNota): string {
		const icons: Record<EstadoNota, string> = {
			Pendiente: 'schedule',
			Pagada: 'check_circle',
			Cancelada: 'cancel',
			Parcial: 'hourglass_bottom',
		};
		return icons[estado] || 'help';
	}
}
