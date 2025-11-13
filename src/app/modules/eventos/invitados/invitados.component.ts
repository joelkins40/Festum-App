import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Invitado } from './invitado-dialog/invitados-mock.service';
import { InvitadoDialogComponent } from './invitado-dialog/invitado-dialog.component';

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
		FormsModule,
		MatCardModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
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

	// Filtros para eventos
	eventoSearchText = '';
	tipoEventoFilter = '';
	lugarFilter = '';

	// Listas únicas para los filtros
	get tiposEvento(): string[] {
		return [...new Set(this.eventos.map((e) => e.tipoEvento))];
	}

	get lugares(): string[] {
		return [...new Set(this.eventos.map((e) => e.lugar))];
	}

	/**
	 * Inicialización del componente
	 */
	ngOnInit(): void {
		this.loadEventos();
		this.setupEventosFilter();
	}

	/**
	 * Carga la lista de eventos
	 */
	loadEventos(): void {
		// Por ahora usamos datos mock, en el futuro se cargaría desde un servicio
		this.eventosDataSource.data = this.eventos;
	}

	/**
	 * Configura el filtro personalizado para la tabla de eventos
	 */
	setupEventosFilter(): void {
		this.eventosDataSource.filterPredicate = (
			evento: Evento,
			filter: string,
		) => {
			const searchStr = filter.toLowerCase();

			// Filtro por texto de búsqueda
			const matchesSearch =
				!this.eventoSearchText ||
				evento.cliente.toLowerCase().includes(searchStr) ||
				evento.tipoEvento.toLowerCase().includes(searchStr) ||
				evento.lugar.toLowerCase().includes(searchStr);

			// Filtro por tipo de evento
			const matchesTipo =
				!this.tipoEventoFilter || evento.tipoEvento === this.tipoEventoFilter;

			// Filtro por lugar
			const matchesLugar =
				!this.lugarFilter || evento.lugar === this.lugarFilter;

			return matchesSearch && matchesTipo && matchesLugar;
		};
	}

	/**
	 * Aplica los filtros a la tabla de eventos
	 */
	applyEventosFilter(): void {
		// Usamos el texto de búsqueda como filtro principal
		this.eventosDataSource.filter = this.eventoSearchText.trim().toLowerCase();
	}

	/**
	 * Limpia todos los filtros de eventos
	 */
	clearEventosFilters(): void {
		this.eventoSearchText = '';
		this.tipoEventoFilter = '';
		this.lugarFilter = '';
		this.eventosDataSource.filter = '';
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

		// Crear input file dinámicamente
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = '.csv';
		fileInput.style.display = 'none';

		// Manejar la selección del archivo
		fileInput.addEventListener('change', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const file = target.files?.[0];

			if (!file) {
				return;
			}

			// Validar tipo de archivo
			if (!file.name.endsWith('.csv')) {
				this.showMessage('Por favor seleccione un archivo CSV válido', 'error');
				return;
			}

			// Leer el archivo
			const reader = new FileReader();

			reader.onload = (e: ProgressEvent<FileReader>) => {
				try {
					const contenido = e.target?.result as string;
					this.procesarCSV(contenido);
				} catch (error) {
					console.error('Error al procesar CSV:', error);
					this.showMessage(
						'Error al procesar el archivo CSV. Verifique el formato.',
						'error',
					);
				}
			};

			reader.onerror = () => {
				this.showMessage('Error al leer el archivo', 'error');
			};

			reader.readAsText(file, 'UTF-8');
		});

		// Limpiar el input después de usarlo
		fileInput.addEventListener('change', () => {
			setTimeout(() => {
				document.body.removeChild(fileInput);
			}, 100);
		});

		// Agregar al DOM y hacer clic
		document.body.appendChild(fileInput);
		fileInput.click();
	}

	/**
	 * Procesa el contenido del archivo CSV y actualiza la lista de invitados
	 */
	private procesarCSV(contenido: string): void {
		if (!this.selectedEvento) {
			return;
		}

		// Validar que el archivo no esté vacío
		if (!contenido || contenido.trim().length === 0) {
			this.showMessage('El archivo CSV está vacío', 'error');
			return;
		}

		// Dividir en líneas y limpiar
		const lineas = contenido
			.split('\n')
			.map((linea) => linea.trim())
			.filter((linea) => linea.length > 0);

		if (lineas.length < 2) {
			this.showMessage(
				'El archivo CSV debe contener encabezados y al menos una fila de datos',
				'error',
			);
			return;
		}

		// Obtener y validar encabezados
		const encabezados = this.parsearLineaCSV(lineas[0]);
		const encabezadosEsperados = [
			'Nombre Completo',
			'Teléfono Principal',
			'Teléfono Secundario',
			'Email',
			'Acompañantes',
			'Confirmado',
		];

		// Validar que los encabezados coincidan
		if (!this.validarEncabezados(encabezados, encabezadosEsperados)) {
			this.showMessage(
				`Los encabezados del CSV no coinciden. Se esperan: ${encabezadosEsperados.join(', ')}`,
				'error',
			);
			return;
		}

		// Procesar las filas de datos
		const invitadosImportados: Invitado[] = [];
		const errores: string[] = [];

		for (let i = 1; i < lineas.length; i++) {
			const lineaActual = lineas[i];
			const campos = this.parsearLineaCSV(lineaActual);

			if (campos.length !== encabezadosEsperados.length) {
				errores.push(`Fila ${i + 1}: número incorrecto de columnas`);
				continue;
			}

			try {
				const invitado = this.crearInvitadoDesdeCSV(campos);
				if (invitado) {
					invitadosImportados.push(invitado);
				}
			} catch (error) {
				errores.push(
					`Fila ${i + 1}: ${error instanceof Error ? error.message : 'error desconocido'}`,
				);
			}
		}

		// Mostrar errores si los hay
		if (errores.length > 0) {
			const mensajeError =
				errores.length > 3
					? `Se encontraron ${errores.length} errores en el archivo. Primeros 3:\n${errores.slice(0, 3).join('\n')}`
					: `Errores encontrados:\n${errores.join('\n')}`;

			this.showMessage(mensajeError, 'error');
			return;
		}

		// Validar que se importó al menos un invitado
		if (invitadosImportados.length === 0) {
			this.showMessage(
				'No se pudo importar ningún invitado del archivo',
				'error',
			);
			return;
		}

		// Obtener el siguiente ID disponible
		const maxId =
			this.selectedEvento.invitados.length > 0
				? Math.max(...this.selectedEvento.invitados.map((inv) => inv.id))
				: 0;

		// Asignar IDs únicos a los invitados importados
		invitadosImportados.forEach((invitado, index) => {
			invitado.id = maxId + index + 1;
		});

		// Combinar con la lista actual
		this.selectedEvento.invitados = [
			...this.selectedEvento.invitados,
			...invitadosImportados,
		];

		// Actualizar el DataSource
		this.invitadosDataSource.data = this.selectedEvento.invitados;

		// Actualizar estadísticas
		this.calculateStats(this.selectedEvento.invitados);

		// Mensaje de éxito
		this.showMessage(
			`Se importaron exitosamente ${invitadosImportados.length} invitado(s)`,
			'success',
		);

		// TODO: Cuando exista el backend, enviar los datos al servidor
		// this.http.post('/api/eventos/' + this.selectedEvento.id + '/invitados/import', invitadosImportados)
		//   .subscribe({
		//     next: (response) => {
		//       this.showMessage('Invitados importados y guardados en el servidor', 'success');
		//       this.cargarInvitados(); // Recargar desde el servidor
		//     },
		//     error: (error) => {
		//       this.showMessage('Error al guardar en el servidor', 'error');
		//     }
		//   });
	}

	/**
	 * Parsea una línea CSV respetando campos entre comillas
	 */
	private parsearLineaCSV(linea: string): string[] {
		const campos: string[] = [];
		let campoActual = '';
		let dentroDeComillas = false;

		for (let i = 0; i < linea.length; i++) {
			const char = linea[i];

			if (char === '"') {
				dentroDeComillas = !dentroDeComillas;
			} else if (char === ',' && !dentroDeComillas) {
				campos.push(campoActual.trim());
				campoActual = '';
			} else {
				campoActual += char;
			}
		}

		// Agregar el último campo
		campos.push(campoActual.trim());

		return campos;
	}

	/**
	 * Valida que los encabezados del CSV coincidan con los esperados
	 */
	private validarEncabezados(actuales: string[], esperados: string[]): boolean {
		if (actuales.length !== esperados.length) {
			return false;
		}

		for (let i = 0; i < esperados.length; i++) {
			// Normalizar: quitar comillas y espacios extra
			const actual = actuales[i].replace(/"/g, '').trim();
			const esperado = esperados[i];

			if (actual !== esperado) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Crea un objeto Invitado desde una fila CSV
	 */
	private crearInvitadoDesdeCSV(campos: string[]): Invitado {
		// Limpiar comillas de los campos
		const limpiarCampo = (campo: string): string => {
			return campo.replace(/^"|"$/g, '').trim();
		};

		const nombreCompleto = limpiarCampo(campos[0]);
		const telefonoPrincipal = limpiarCampo(campos[1]);
		const telefonoSecundario = limpiarCampo(campos[2]);
		const email = limpiarCampo(campos[3]);
		const acompanantesStr = limpiarCampo(campos[4]);
		const confirmadoStr = limpiarCampo(campos[5]);

		// Validaciones
		if (!nombreCompleto) {
			throw new Error('El nombre completo es obligatorio');
		}

		if (!telefonoPrincipal) {
			throw new Error('El teléfono principal es obligatorio');
		}

		// Validar y convertir acompañantes
		const acompanantes = parseInt(acompanantesStr, 10);
		if (Number.isNaN(acompanantes) || acompanantes < 0) {
			throw new Error(
				`Acompañantes debe ser un número válido (≥0), se recibió: "${acompanantesStr}"`,
			);
		}

		// Validar y convertir confirmado
		const confirmadoUpper = confirmadoStr.toUpperCase();
		if (confirmadoUpper !== 'S' && confirmadoUpper !== 'N') {
			throw new Error(
				`Confirmado debe ser "S" o "N", se recibió: "${confirmadoStr}"`,
			);
		}
		const confirmado = confirmadoUpper === 'S';

		// Crear el objeto invitado
		const invitado: Invitado = {
			id: 0, // Se asignará después
			fullName: nombreCompleto,
			contactPhone: telefonoPrincipal,
			numberOfCompanions: acompanantes,
			willAttend: confirmado,
		};

		// Agregar campos opcionales solo si tienen valor
		if (telefonoSecundario) {
			invitado.secondaryContactPhone = telefonoSecundario;
		}

		if (email) {
			invitado.email = email;
		}

		return invitado;
	}

	/**
	 * Exporta la lista de invitados a CSV
	 */
	exportarCSV(): void {
		if (!this.selectedEvento) {
			this.showMessage('Debe seleccionar un evento primero', 'info');
			return;
		}

		try {
			// Validar que existan invitados para exportar
			const invitados = this.selectedEvento.invitados;

			if (!invitados || invitados.length === 0) {
				this.showMessage('No hay invitados para exportar', 'info');
				return;
			}

			// Definir los encabezados del CSV
			const headers = [
				'ID',
				'Nombre Completo',
				'Teléfono Principal',
				'Teléfono Secundario',
				'Email',
				'Acompañantes',
				'Confirmado',
			];

			// Construir las filas del CSV
			const rows = invitados.map((invitado) => [
				invitado.id.toString(),
				`"${invitado.fullName}"`, // Comillas para nombres con comas
				`"${invitado.contactPhone}"`,
				`"${invitado.secondaryContactPhone || ''}"`,
				`"${invitado.email || ''}"`,
				invitado.numberOfCompanions.toString(),
				invitado.willAttend ? 'Sí' : 'No',
			]);

			// Combinar encabezados y filas
			const csvContent = [
				headers.join(','),
				...rows.map((row) => row.join(',')),
			].join('\n');

			// Agregar BOM para compatibilidad con Excel y caracteres especiales
			const BOM = '\uFEFF';
			const csvWithBOM = BOM + csvContent;

			// Crear el Blob con el contenido CSV
			const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });

			// Generar nombre del archivo con fecha actual
			const fecha = new Date().toISOString().split('T')[0];
			const eventoNombre = this.selectedEvento.tipoEvento.replace(/\s+/g, '_');
			const clienteNombre = this.selectedEvento.cliente.replace(/\s+/g, '_');
			const fileName = `invitados_${eventoNombre}_${clienteNombre}_${fecha}.csv`;

			// Crear un enlace temporal para la descarga
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);

			link.setAttribute('href', url);
			link.setAttribute('download', fileName);
			link.style.visibility = 'hidden';

			// Agregar al documento, hacer clic y remover
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Liberar recursos
			setTimeout(() => {
				URL.revokeObjectURL(url);
			}, 100);

			this.showMessage(
				`CSV exportado exitosamente: ${invitados.length} invitado(s)`,
				'success',
			);
		} catch (error) {
			console.error('Error al exportar CSV:', error);
			this.showMessage(
				'Error al exportar el archivo CSV. Por favor, intente nuevamente.',
				'error',
			);
		}
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
