import { Component, OnInit, ViewChild, ElementRef, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PaquetesService } from '../../../core/services/paquetes.service';
import type { Paquete } from '../../../core/models/paquete.model';
import { PaqueteDialogComponent } from './paquete-dialog/paquete-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
	selector: 'app-paquetes',
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatDividerModule,
		MatTooltipModule,
		MatDialogModule,
		MatSnackBarModule,
		ButtonComponent,
	],
	templateUrl: './paquetes.component.html',
	styleUrl: './paquetes.component.scss',
})
export class PaquetesComponent implements OnInit {
	dataSource = new MatTableDataSource<Paquete>([]);
	columnasDisplayed: string[] = [
		'id',
		'tipo',
		'nombre',
		'categoria',
		'stock',
		'precio',
		'acciones',
	];
	loading = false;
	paquetes: Paquete[] = [];

	// Filtros
	filtroTexto = '';
	filtroTipo = '';
	filtroCategoria = '';

	// Opciones para filtros
	tiposDisponibles = [
		{ value: '', label: 'Todos' },
		{ value: 'Paquete', label: 'Paquetes' },
		{ value: 'Servicio', label: 'Servicios' },
	];

	categoriasDisponibles = [
		{ value: '', label: 'Todas' },
		{ value: 'Boda', label: 'Boda' },
		{ value: 'Corporativo', label: 'Corporativo' },
		{ value: 'Lounge', label: 'Lounge' },
		{ value: 'XV Años', label: 'XV Años' },
		{ value: 'Infantil', label: 'Infantil' },
		{ value: 'Graduación', label: 'Graduación' },
	];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	// Signals para importación CSV
	procesandoImportacion = signal<boolean>(false);
	errorImportacion = signal<string | null>(null);

	constructor(
		private paquetesService: PaquetesService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
	) {}

	ngOnInit(): void {
		this.configurarTabla();
		this.suscribirAServicio();
		this.cargarPaquetes();
	}

	private configurarTabla(): void {
		setTimeout(() => {
			if (this.paginator) this.dataSource.paginator = this.paginator;
			if (this.sort) this.dataSource.sort = this.sort;

			// Configurar filtro personalizado
			this.dataSource.filterPredicate = (data: Paquete, filter: string) => {
				const filterObj = JSON.parse(filter);

				let matches = true;

				// Filtro por texto
				if (filterObj.texto) {
					const searchText = filterObj.texto.toLowerCase();
					matches =
						matches &&
						(data.nombre.toLowerCase().includes(searchText) ||
							data.descripcionCorta.toLowerCase().includes(searchText) ||
							data.categoria.toLowerCase().includes(searchText));
				}

				// Filtro por tipo
				if (filterObj.tipo) {
					matches = matches && data.tipo === filterObj.tipo;
				}

				// Filtro por categoría
				if (filterObj.categoria) {
					matches = matches && data.categoria === filterObj.categoria;
				}

				return matches;
			};
		});
	}

	private suscribirAServicio(): void {
		this.paquetesService.paquetes$.subscribe((items: Paquete[]) => {
			this.paquetes = items;
			this.dataSource.data = items;
		});

		this.paquetesService.loading$.subscribe((l: boolean) => {
			this.loading = l;
		});
	}

	cargarPaquetes(): void {
		this.paquetesService.getPaquetes().subscribe();
	}

	/**
	 * 🔍 Aplicar filtros
	 */
	aplicarFiltros(): void {
		const filterValue = JSON.stringify({
			texto: this.filtroTexto.trim().toLowerCase(),
			tipo: this.filtroTipo,
			categoria: this.filtroCategoria,
		});

		this.dataSource.filter = filterValue;

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * ➕ Abrir modal para crear nuevo paquete
	 */
	abrirModalCrear(): void {
		const dialogRef = this.dialog.open(PaqueteDialogComponent, {
			width: '1200px',
			maxWidth: '95vw',
			height: '90vh',
			maxHeight: '900px',
			disableClose: true,
			panelClass: 'large-dialog-panel',
			data: {
				modo: 'crear',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.crearPaquete(result);
			}
		});
	}

	/**
	 * ✏️ Abrir modal para editar paquete
	 */
	editarPaquete(paquete: Paquete): void {
		const dialogRef = this.dialog.open(PaqueteDialogComponent, {
			width: '1200px',
			maxWidth: '95vw',
			height: '90vh',
			maxHeight: '900px',
			disableClose: true,
			panelClass: 'large-dialog-panel',
			data: {
				paquete: paquete,
				modo: 'editar',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.actualizarPaquete(result);
			}
		});
	}

	/**
	 * ➕ Crear nuevo paquete
	 */
	private crearPaquete(paqueteData: Paquete): void {
		this.paquetesService.crearPaquete(paqueteData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Paquete creado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al crear paquete',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al crear paquete:', error);
				this.mostrarMensaje('Error al crear el paquete', 'error');
			},
		});
	}

	/**
	 * ✏️ Actualizar paquete existente
	 */
	private actualizarPaquete(paqueteData: Paquete): void {
		this.paquetesService.actualizarPaquete(paqueteData).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Paquete actualizado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al actualizar paquete',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al actualizar paquete:', error);
				this.mostrarMensaje('Error al actualizar el paquete', 'error');
			},
		});
	}

	/**
	 * 🗑️ Confirmar y eliminar paquete
	 */
	confirmarEliminacion(paquete: Paquete): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '480px',
			disableClose: true,
			data: {
				title: 'Eliminar Paquete',
				message: `¿Está seguro de que desea eliminar el paquete "${paquete.nombre}"? Esta acción no se puede deshacer.`,
				confirmText: 'Eliminar Paquete',
				cancelText: 'Cancelar',
				type: 'danger',
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.eliminarPaquete(paquete.id);
			}
		});
	}

	/**
	 * 🗑️ Eliminar paquete
	 */
	private eliminarPaquete(id: number): void {
		this.paquetesService.eliminarPaquete(id).subscribe({
			next: (response) => {
				if (response.success) {
					this.mostrarMensaje('Paquete eliminado exitosamente', 'success');
				} else {
					this.mostrarMensaje(
						response.message || 'Error al eliminar paquete',
						'error',
					);
				}
			},
			error: (error) => {
				console.error('Error al eliminar paquete:', error);
				this.mostrarMensaje('Error al eliminar el paquete', 'error');
			},
		});
	}

	/**
	 * 📢 Mostrar mensaje con SnackBar
	 */
	private mostrarMensaje(
		mensaje: string,
		tipo: 'success' | 'error' | 'warning' | 'info' = 'info',
	): void {
		const config = {
			duration: 4000,
			horizontalPosition: 'right' as const,
			verticalPosition: 'top' as const,
			panelClass: [`snackbar-${tipo}`],
		};

		this.snackBar.open(mensaje, 'Cerrar', config);
	}

	// Placeholder para futuras acciones (editar/ver)
	verPaquete(paquete: Paquete): void {
		// TODO: abrir detalle/diálogo
		console.log('Ver paquete', paquete);
	}

	/**
	 * 📥 Exportar paquetes a CSV
	 */
	exportarCSV(): void {
		if (this.paquetes.length === 0) {
			this.mostrarMensaje('No hay paquetes para exportar', 'warning');
			return;
		}

		try {
			// Definir encabezados CSV
			const headers = [
				'ID',
				'Tipo',
				'Nombre',
				'Descripción Corta',
				'Categoría',
				'Disponibilidad',
				'Precio Total',
			];

			// Convertir datos a formato CSV
			const csvRows = [headers.join(',')];

			for (const paquete of this.paquetes) {
				const row = [
					paquete.id,
					this.escapeCsvValue(paquete.tipo),
					this.escapeCsvValue(paquete.nombre),
					this.escapeCsvValue(paquete.descripcionCorta),
					this.escapeCsvValue(paquete.categoria),
					this.escapeCsvValue(paquete.disponibilidad),
					paquete.precioTotal,
				];
				csvRows.push(row.join(','));
			}

			const csvContent = csvRows.join('\n');

			// Crear y descargar archivo
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);

			const fecha = new Date().toISOString().split('T')[0];
			link.setAttribute('href', url);
			link.setAttribute('download', `paquetes_festum_${fecha}.csv`);
			link.style.visibility = 'hidden';

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			this.mostrarMensaje(
				`${this.paquetes.length} paquetes exportados exitosamente`,
				'success',
			);
		} catch (error) {
			console.error('Error al exportar CSV:', error);
			this.mostrarMensaje('Error al exportar los paquetes', 'error');
		}
	}

	/**
	 * 📤 Importar paquetes desde CSV
	 */
	importarCSV(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		// Validar tipo de archivo
		if (!file.name.endsWith('.csv')) {
			this.errorImportacion.set('El archivo debe ser de tipo CSV');
			this.mostrarMensaje('Solo se permiten archivos CSV', 'error');
			input.value = '';
			return;
		}

		// Validar tamaño (máximo 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			this.errorImportacion.set('El archivo es demasiado grande (máximo 5MB)');
			this.mostrarMensaje('El archivo supera el tamaño máximo permitido', 'error');
			input.value = '';
			return;
		}

		this.procesandoImportacion.set(true);
		this.errorImportacion.set(null);

		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				const csvContent = e.target?.result as string;
				const paquetesImportados = this.parsearCSV(csvContent);

				if (paquetesImportados.length === 0) {
					throw new Error('No se encontraron paquetes válidos en el archivo');
				}

				// Importar paquetes en masa
				this.importarPaquetesEnMasa(paquetesImportados);
			} catch (error) {
				const mensaje =
					error instanceof Error ? error.message : 'Error al procesar el archivo';
				this.errorImportacion.set(mensaje);
				this.mostrarMensaje(mensaje, 'error');
				this.procesandoImportacion.set(false);
			}
		};

		reader.onerror = () => {
			this.errorImportacion.set('Error al leer el archivo');
			this.mostrarMensaje('Error al leer el archivo', 'error');
			this.procesandoImportacion.set(false);
		};

		reader.readAsText(file);
		input.value = ''; // Limpiar input
	}

	/**
	 * 📋 Parsear contenido CSV
	 */
	private parsearCSV(csvContent: string): Partial<Paquete>[] {
		const lines = csvContent.split('\n').filter((line) => line.trim());

		if (lines.length < 2) {
			throw new Error('El archivo CSV está vacío o no tiene datos');
		}

		// Omitir encabezados
		const dataLines = lines.slice(1);
		const paquetes: Partial<Paquete>[] = [];
		const errores: string[] = [];

		for (let i = 0; i < dataLines.length; i++) {
			const line = dataLines[i].trim();
			if (!line) continue;

			try {
				const valores = this.parsearLineaCSV(line);

				if (valores.length < 7) {
					errores.push(`Línea ${i + 2}: Faltan columnas`);
					continue;
				}

				// Validar campos requeridos
				const [id, tipo, nombre, descripcionCorta, categoria, disponibilidad, precioTotal] = valores;

				if (!nombre || !tipo || !categoria) {
					errores.push(`Línea ${i + 2}: Campos requeridos vacíos`);
					continue;
				}

				// Validar tipo
				if (!['Paquete', 'Servicio'].includes(tipo)) {
					errores.push(`Línea ${i + 2}: Tipo debe ser 'Paquete' o 'Servicio'`);
					continue;
				}

				// Validar precio
				const precio = parseFloat(precioTotal);
				if (isNaN(precio) || precio < 0) {
					errores.push(`Línea ${i + 2}: Precio inválido`);
					continue;
				}

				const paquete: Partial<Paquete> = {
					tipo: tipo as 'Paquete' | 'Servicio',
					nombre: nombre,
					descripcionCorta: descripcionCorta || '',
					categoria: categoria,
					disponibilidad: +disponibilidad || 0,
					precioTotal: precio,
					imagen: '',
				};

				paquetes.push(paquete);
			} catch (error) {
				errores.push(`Línea ${i + 2}: Error al procesar`);
			}
		}

		// Mostrar errores si los hay
		if (errores.length > 0) {
			const mensajeError = `Se encontraron ${errores.length} errores:\n${errores.slice(0, 5).join('\n')}`;
			if (errores.length > 5) {
				console.warn('Errores completos:', errores);
			}
			this.errorImportacion.set(mensajeError);
		}

		return paquetes;
	}

	/**
	 * 📄 Parsear línea CSV manejando comillas
	 */
	private parsearLineaCSV(line: string): string[] {
		const resultado: string[] = [];
		let valorActual = '';
		let dentroDeComillas = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];

			if (char === '"') {
				dentroDeComillas = !dentroDeComillas;
			} else if (char === ',' && !dentroDeComillas) {
				resultado.push(valorActual.trim());
				valorActual = '';
			} else {
				valorActual += char;
			}
		}

		resultado.push(valorActual.trim());
		return resultado;
	}

	/**
	 * 💾 Importar paquetes en masa
	 */
	private importarPaquetesEnMasa(paquetes: Partial<Paquete>[]): void {
		let exitosos = 0;
		let fallidos = 0;

		// Procesar secuencialmente para evitar sobrecarga
		const procesarSiguiente = (index: number) => {
			if (index >= paquetes.length) {
				// Terminar proceso
				this.procesandoImportacion.set(false);
				this.cargarPaquetes(); // Recargar tabla

				const mensaje = `Importación completada: ${exitosos} exitosos, ${fallidos} fallidos`;
				this.mostrarMensaje(mensaje, fallidos > 0 ? 'warning' : 'success');

				if (this.errorImportacion()) {
					// Limpiar error después de 10 segundos
					setTimeout(() => this.errorImportacion.set(null), 10000);
				}
				return;
			}

			const paquete = paquetes[index] as Paquete;

			this.paquetesService.crearPaquete(paquete).subscribe({
				next: (response) => {
					if (response.success) {
						exitosos++;
					} else {
						fallidos++;
					}
					procesarSiguiente(index + 1);
				},
				error: () => {
					fallidos++;
					procesarSiguiente(index + 1);
				},
			});
		};

		procesarSiguiente(0);
	}

	/**
	 * 🔒 Escapar valores CSV
	 */
	private escapeCsvValue(value: string | number): string {
		const stringValue = String(value);
		if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
			return `"${stringValue.replace(/"/g, '""')}"`;
		}
		return stringValue;
	}
}
