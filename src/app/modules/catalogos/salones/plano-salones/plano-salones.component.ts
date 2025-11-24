import {
	Component,
	OnInit,
	inject,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import {
	CdkDragDrop,
	CdkDrag,
	CdkDropList,
	CdkDragEnd,
	CdkDragStart,
} from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { SalonesService } from '../../../../core/services/salones.service';
import { PlanoTemplate } from '../../../../core/models/salon.model';

export interface ElementoArrastrable {
	id: string;
	tipo: string;
	nombre: string;
	icono: string;
	color: string;
	tamano: { ancho: number; alto: number };
}

export interface ElementoEnCanvas {
	id: string;
	tipo: string;
	nombre: string;
	posicion: { x: number; y: number };
	tamano: { ancho: number; alto: number };
	color: string;
	rotacion?: number;
	icono: string;
}

export interface PlantillaSalon {
	id: string;
	nombre: string;
	tipo: string;
	dimensiones: { ancho: number; alto: number };
	elementosFijos: ElementoEnCanvas[];
}

export interface DisenoGuardado {
	plantillaId: string;
	plantillaNombre: string;
	elementos: ElementoEnCanvas[];
	fechaGuardado: string;
	version: string;
}

@Component({
	selector: 'app-plano-salones',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		HttpClientModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatFormFieldModule,
		MatCardModule,
		MatSidenavModule,
		MatListModule,
		MatSnackBarModule,
		MatTooltipModule,
		MatDividerModule,
		CdkDropList,
		CdkDrag,
	],
	templateUrl: './plano-salones.component.html',
	styleUrl: './plano-salones.component.scss',
})
export class PlanoSalonesComponent implements OnInit {
	@ViewChild('canvas', { static: false })
	canvasRef!: ElementRef<HTMLDivElement>;
	@ViewChild('fileInput', { static: false })
	fileInputRef!: ElementRef<HTMLInputElement>;

	private snackBar = inject(MatSnackBar);
	private route = inject(ActivatedRoute);
	private salonesService = inject(SalonesService);

	// ID del salón actual
	salonId: number | null = null;
	salonNombre: string = '';
	errorCarga: boolean = false;

	// Datos del plano
	plantillasDisponibles: PlantillaSalon[] = [];
	plantillaSeleccionada: PlantillaSalon | null = null;
	elementosEnCanvas: ElementoEnCanvas[] = [];

	// Elementos arrastrables del sidebar
	elementosArrastrables: ElementoArrastrable[] = [
		{
			id: 'mesa-redonda',
			tipo: 'mesa-redonda',
			nombre: 'Mesa Redonda',
			icono: 'table_restaurant',
			color: '#8b4513',
			tamano: { ancho: 120, alto: 120 },
		},
		{
			id: 'mesa-rectangular',
			tipo: 'mesa-rectangular',
			nombre: 'Mesa Rectangular',
			icono: 'table_bar',
			color: '#8b4513',
			tamano: { ancho: 180, alto: 90 },
		},
		{
			id: 'silla',
			tipo: 'silla',
			nombre: 'Silla',
			icono: 'event_seat',
			color: '#654321',
			tamano: { ancho: 50, alto: 50 },
		},
		{
			id: 'escenario',
			tipo: 'escenario',
			nombre: 'Escenario',
			icono: 'theater_comedy',
			color: '#9c27b0',
			tamano: { ancho: 300, alto: 150 },
		},
		{
			id: 'barra',
			tipo: 'barra',
			nombre: 'Barra',
			icono: 'local_bar',
			color: '#20b2aa',
			tamano: { ancho: 220, alto: 80 },
		},
		{
			id: 'cabina-dj',
			tipo: 'cabina-dj',
			nombre: 'Cabina DJ/Sonido',
			icono: 'library_music',
			color: '#4a4a4a',
			tamano: { ancho: 150, alto: 120 },
		},
		{
			id: 'zona-comida',
			tipo: 'zona-comida',
			nombre: 'Zona de Comida',
			icono: 'restaurant_menu',
			color: '#ff6b35',
			tamano: { ancho: 250, alto: 180 },
		},
		{
			id: 'entrada',
			tipo: 'entrada',
			nombre: 'Entrada',
			icono: 'meeting_room',
			color: '#607d8b',
			tamano: { ancho: 90, alto: 150 },
		},
		{
			id: 'baños',
			tipo: 'baños',
			nombre: 'Baños',
			icono: 'wc',
			color: '#795548',
			tamano: { ancho: 120, alto: 120 },
		},
		{
			id: 'planta',
			tipo: 'planta',
			nombre: 'Planta/Decoración',
			icono: 'local_florist',
			color: '#4caf50',
			tamano: { ancho: 60, alto: 60 },
		},
		{
			id: 'mesa-regalos',
			tipo: 'mesa-regalos',
			nombre: 'Mesa de Regalos',
			icono: 'card_giftcard',
			color: '#e91e63',
			tamano: { ancho: 150, alto: 90 },
		},
	];

	// Control de UI
	sidebarAbierto = true;
	elementoSeleccionado: ElementoEnCanvas | null = null;

	ngOnInit() {
		// Obtener ID del salón desde la URL
		const idParam = this.route.snapshot.paramMap.get('id');
		if (idParam) {
			this.salonId = parseInt(idParam, 10);
			this.cargarPlanoDesdesalon();
		} else {
			this.errorCarga = true;
			this.mostrarError('No se proporcionó un ID de salón válido');
		}
	}

	/**
	 * Carga el plano del salón desde el servicio
	 */
	private cargarPlanoDesdesalon() {
		if (!this.salonId) return;

		this.salonesService.getSalonById(this.salonId).subscribe({
			next: (response) => {
				if (
					response.success &&
					response.data &&
					!Array.isArray(response.data)
				) {
					const salon = response.data;
					this.salonNombre = salon.nombre;

					// Verificar si el salón tiene plantilla de plano
					if (salon.planoTemplate) {
						this.cargarPlantillaDesdesalon(salon.planoTemplate);
					} else {
						this.errorCarga = true;
						this.mostrarError(
							`El salón "${salon.nombre}" no tiene una plantilla de plano configurada`,
						);
						// Cargar plantillas por defecto como fallback
						this.cargarPlantillasPorDefecto();
					}
				} else {
					this.errorCarga = true;
					this.mostrarError('No se pudo encontrar el salón solicitado');
					this.cargarPlantillasPorDefecto();
				}
			},
			error: (err) => {
				console.error('Error al cargar salón:', err);
				this.errorCarga = true;
				this.mostrarError('Error al cargar los datos del salón');
				this.cargarPlantillasPorDefecto();
			},
		});
	}

	/**
	 * Carga la plantilla del plano desde el objeto PlanoTemplate del salón
	 */
	private cargarPlantillaDesdesalon(planoTemplate: PlanoTemplate) {
		// Crear plantilla desde el objeto PlanoTemplate
		const plantilla: PlantillaSalon = {
			id: planoTemplate.plantillaId,
			nombre: planoTemplate.plantillaNombre,
			tipo: 'salon',
			dimensiones: { ancho: 800, alto: 600 }, // Dimensiones por defecto
			elementosFijos: [], // Los salones no tienen elementos fijos
		};

		this.plantillasDisponibles = [plantilla];
		this.plantillaSeleccionada = plantilla;

		// Cargar los elementos del plano
		this.elementosEnCanvas = [...planoTemplate.elementos];

		this.mostrarMensaje(
			`Plano del salón "${this.salonNombre}" cargado exitosamente`,
		);
	}

	/**
	 * Carga plantillas por defecto cuando no hay plano en el salón
	 */
	private cargarPlantillasPorDefecto() {
		this.cargarPlantillas();
	}

	cargarPlantillas() {
		// Usar plantillas estáticas para evitar problemas de HTTP
		this.plantillasDisponibles = [
			{
				id: 'clasico-rectangular',
				nombre: 'Salón Clásico Rectangular',
				tipo: 'rectangular',
				dimensiones: { ancho: 800, alto: 600 },
				elementosFijos: [
					{
						id: 'escenario',
						tipo: 'escenario',
						nombre: 'Escenario Principal',
						posicion: { x: 350, y: 50 },
						tamano: { ancho: 100, alto: 60 },
						color: '#8e24aa',
						icono: 'stage',
					},
				],
			},
			{
				id: 'salon-cuadrado',
				nombre: 'Salón Cuadrado',
				tipo: 'cuadrado',
				dimensiones: { ancho: 700, alto: 700 },
				elementosFijos: [
					{
						id: 'escenario-centro',
						tipo: 'escenario',
						nombre: 'Escenario Central',
						posicion: { x: 300, y: 320 },
						tamano: { ancho: 100, alto: 60 },
						color: '#8e24aa',
						icono: 'stage',
					},
				],
			},
		];

		if (this.plantillasDisponibles.length > 0) {
			this.seleccionarPlantilla(this.plantillasDisponibles[0]);
		} else {
			this.crearPlantillaPorDefecto();
		}
	}

	private crearPlantillaPorDefecto() {
		const plantillaPorDefecto: PlantillaSalon = {
			id: 'default',
			nombre: 'Plantilla por Defecto',
			tipo: 'rectangular',
			dimensiones: { ancho: 800, alto: 600 },
			elementosFijos: [],
		};

		this.plantillasDisponibles = [plantillaPorDefecto];
		this.seleccionarPlantilla(plantillaPorDefecto);
	}

	seleccionarPlantilla(plantilla: PlantillaSalon) {
		this.plantillaSeleccionada = plantilla;
		this.elementosEnCanvas = [...plantilla.elementosFijos];
		this.mostrarMensaje(`Plantilla "${plantilla.nombre}" cargada`);
	}

	onDrop(
		event: CdkDragDrop<ElementoArrastrable[]> | CdkDragDrop<ElementoEnCanvas[]>,
	) {
		if (event.previousContainer !== event.container) {
			// Elemento arrastrado desde sidebar al canvas
			const elementoArrastrable = event.item.data as ElementoArrastrable;

			if (elementoArrastrable && this.plantillaSeleccionada) {
				// Calcular posición basada en donde se soltó el elemento
				const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
				const dropPoint = event.dropPoint;

				// Calcular posición relativa al canvas
				const x =
					dropPoint.x - canvasRect.left - elementoArrastrable.tamano.ancho / 2;
				const y =
					dropPoint.y - canvasRect.top - elementoArrastrable.tamano.alto / 2;

				const nuevoElemento: ElementoEnCanvas = {
					id: this.generarIdUnico(),
					tipo: elementoArrastrable.tipo,
					nombre: elementoArrastrable.nombre,
					posicion: {
						x: Math.max(
							0,
							Math.min(
								x,
								this.plantillaSeleccionada.dimensiones.ancho -
									elementoArrastrable.tamano.ancho,
							),
						),
						y: Math.max(
							0,
							Math.min(
								y,
								this.plantillaSeleccionada.dimensiones.alto -
									elementoArrastrable.tamano.alto,
							),
						),
					},
					tamano: { ...elementoArrastrable.tamano },
					color: elementoArrastrable.color,
					icono: elementoArrastrable.icono,
					rotacion: 0,
				};

				this.elementosEnCanvas.push(nuevoElemento);
				this.guardarAutomaticamente();
				this.mostrarMensaje(`${elementoArrastrable.nombre} agregado`);
			}
		}
	}

	onElementDragStart(_event: CdkDragStart, _elemento: ElementoEnCanvas) {
		// El drag start se maneja automáticamente por el CDK
		// No necesitamos guardar posición original ya que usamos event.distance
	}

	onElementDragEnd(event: CdkDragEnd, elemento: ElementoEnCanvas) {
		if (!event?.source) {
			return;
		}

		// Obtener la distancia movida por el drag
		const distance = event.distance;

		if (!distance || (!distance.x && !distance.y)) {
			// No hubo movimiento, solo limpiar
			event.source.reset();
			return;
		}

		// Obtener dimensiones del canvas
		const canvasElement = this.canvasRef?.nativeElement;
		if (!canvasElement) {
			event.source.reset();
			return;
		}

		const canvasLogicalWidth =
			this.plantillaSeleccionada?.dimensiones?.ancho || 800;
		const canvasLogicalHeight =
			this.plantillaSeleccionada?.dimensiones?.alto || 600;

		// La distancia ya viene en píxeles de pantalla, necesitamos convertirla
		// a coordenadas lógicas del canvas si hay escalado
		const canvasRect = canvasElement.getBoundingClientRect();
		const scaleX = canvasRect.width / canvasLogicalWidth;
		const scaleY = canvasRect.height / canvasLogicalHeight;

		// Convertir el movimiento a coordenadas lógicas
		const deltaX = distance.x / scaleX;
		const deltaY = distance.y / scaleY;

		// Calcular nueva posición basada en la posición actual
		const nuevaX = elemento.posicion.x + deltaX;
		const nuevaY = elemento.posicion.y + deltaY;

		// Aplicar límites para mantener el elemento dentro del canvas
		const maxX = Math.max(
			0,
			canvasLogicalWidth - (elemento.tamano?.ancho || 50),
		);
		const maxY = Math.max(
			0,
			canvasLogicalHeight - (elemento.tamano?.alto || 50),
		);

		// Actualizar posición del elemento con límites
		elemento.posicion.x = Math.max(0, Math.min(Math.round(nuevaX), maxX));
		elemento.posicion.y = Math.max(0, Math.min(Math.round(nuevaY), maxY));

		// Resetear el transform del CDK para que use la nueva posición CSS
		event.source.reset();

		// Guardar cambios
		this.guardarAutomaticamente();
	}

	seleccionarElemento(elemento: ElementoEnCanvas, event: Event) {
		event.stopPropagation();
		this.elementoSeleccionado = elemento;
	}

	eliminarElemento(elemento: ElementoEnCanvas) {
		// Solo permitir eliminar elementos que no sean fijos de la plantilla
		if (
			!this.plantillaSeleccionada?.elementosFijos.find(
				(e) => e.id === elemento.id,
			)
		) {
			const index = this.elementosEnCanvas.indexOf(elemento);
			if (index > -1) {
				this.elementosEnCanvas.splice(index, 1);
				this.elementoSeleccionado = null;
				this.guardarAutomaticamente();
				this.mostrarMensaje('Elemento eliminado');
			}
		} else {
			this.mostrarMensaje(
				'No se pueden eliminar elementos fijos de la plantilla',
			);
		}
	}

	rotarElemento(elemento: ElementoEnCanvas) {
		elemento.rotacion = (elemento.rotacion || 0) + 45;
		if (elemento.rotacion >= 360) {
			elemento.rotacion = 0;
		}
		this.guardarAutomaticamente();
	}

	redimensionarElemento(
		elemento: ElementoEnCanvas,
		direccion: 'mas' | 'menos',
	) {
		if (this.isElementoFijo(elemento)) {
			this.mostrarMensaje(
				'No se puede redimensionar elementos fijos de la plantilla',
			);
			return;
		}

		const factor = direccion === 'mas' ? 1.2 : 0.8;
		const nuevoAncho = Math.max(
			40,
			Math.min(500, elemento.tamano.ancho * factor),
		);
		const nuevoAlto = Math.max(
			40,
			Math.min(500, elemento.tamano.alto * factor),
		);

		elemento.tamano.ancho = nuevoAncho;
		elemento.tamano.alto = nuevoAlto;
		this.guardarAutomaticamente();
		this.mostrarMensaje(
			`Elemento ${direccion === 'mas' ? 'ampliado' : 'reducido'}`,
		);
	}

	nuevoDiseno() {
		if (this.plantillaSeleccionada) {
			this.elementosEnCanvas = [...this.plantillaSeleccionada.elementosFijos];
			this.elementoSeleccionado = null;
			this.limpiarAutosave();
			this.mostrarMensaje('Nuevo diseño iniciado');
		}
	}

	guardarDiseno() {
		const diseno = {
			plantillaId: this.plantillaSeleccionada?.id,
			plantillaNombre: this.plantillaSeleccionada?.nombre,
			elementos: this.elementosEnCanvas.filter(
				(e) =>
					!this.plantillaSeleccionada?.elementosFijos.find(
						(f) => f.id === e.id,
					),
			),
			fechaGuardado: new Date().toISOString(),
			version: '1.0',
		};

		// Generar nombre de archivo con fecha
		const fecha = new Date().toISOString().split('T')[0];
		const nombreArchivo = `plano-evento-${fecha}.json`;

		// Crear Blob y descargar archivo
		const blob = new Blob([JSON.stringify(diseno, null, 2)], {
			type: 'application/json',
		});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = nombreArchivo;
		link.click();
		window.URL.revokeObjectURL(url);

		// Guardar también en localStorage como respaldo
		if (typeof window !== 'undefined' && localStorage) {
			localStorage.setItem('festum_ultimo_diseno', JSON.stringify(diseno));
		}

		this.mostrarMensaje(`Diseño descargado: ${nombreArchivo}`);
	}

	private guardarAutomaticamente() {
		const diseno = {
			plantillaId: this.plantillaSeleccionada?.id,
			elementos: this.elementosEnCanvas.filter(
				(e) =>
					!this.plantillaSeleccionada?.elementosFijos.find(
						(f) => f.id === e.id,
					),
			),
			fechaAutosave: new Date().toISOString(),
		};

		if (typeof window !== 'undefined' && localStorage) {
			localStorage.setItem('festum_autosave_diseno', JSON.stringify(diseno));
		}
	}

	private limpiarAutosave() {
		if (typeof window !== 'undefined' && localStorage) {
			localStorage.removeItem('festum_autosave_diseno');
		}
	}

	private generarIdUnico(): string {
		return (
			'elemento_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
		);
	}

	private mostrarMensaje(mensaje: string) {
		this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
	}

	private mostrarError(mensaje: string) {
		this.snackBar.open(mensaje, 'Cerrar', {
			duration: 5000,
			panelClass: ['snackbar-error'],
		});
	}

	/**
	 * Abre el selector de archivos para cargar un plano
	 */
	abrirSelectorArchivo() {
		if (this.fileInputRef) {
			this.fileInputRef.nativeElement.click();
		}
	}

	/**
	 * Procesa el archivo JSON seleccionado y carga el plano
	 */
	cargarPlanoDesdeArchivo(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) {
			return;
		}

		// Validar que sea un archivo JSON
		if (!file.name.toLowerCase().endsWith('.json')) {
			this.mostrarError('Por favor selecciona un archivo JSON válido');
			input.value = '';
			return;
		}

		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				const contenido = e.target?.result as string;
				const diseno = JSON.parse(contenido);

				// Validar estructura del JSON
				if (!this.validarEstructuraPlano(diseno)) {
					this.mostrarError(
						'El plano no contiene la estructura necesaria. Verifica que sea un archivo válido.',
					);
					return;
				}

				// Cargar el diseño
				this.aplicarDisenoImportado(diseno);
				this.mostrarMensaje(
					`Plano "${diseno.plantillaNombre || 'Sin nombre'}" cargado exitosamente`,
				);
			} catch (error) {
				console.error('Error al leer archivo:', error);
				this.mostrarError(
					'El archivo no es un JSON válido o está corrupto. Por favor verifica el archivo.',
				);
			} finally {
				// Limpiar input para permitir cargar el mismo archivo nuevamente
				input.value = '';
			}
		};

		reader.onerror = () => {
			this.mostrarError('No fue posible leer el archivo. Intenta nuevamente.');
			input.value = '';
		};

		reader.readAsText(file);
	}

	/**
	 * Valida que el JSON tenga la estructura mínima requerida
	 */
	private validarEstructuraPlano(diseno: unknown): diseno is DisenoGuardado {
		if (!diseno || typeof diseno !== 'object') {
			return false;
		}

		const obj = diseno as Record<string, unknown>;

		// Validar propiedades básicas
		if (!obj['plantillaId'] || !Array.isArray(obj['elementos'])) {
			return false;
		}

		// Validar estructura de elementos
		for (const elemento of obj['elementos']) {
			if (
				!elemento.id ||
				!elemento.tipo ||
				!elemento.posicion ||
				!elemento.tamano ||
				typeof elemento.posicion.x !== 'number' ||
				typeof elemento.posicion.y !== 'number' ||
				typeof elemento.tamano.ancho !== 'number' ||
				typeof elemento.tamano.alto !== 'number'
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Aplica el diseño importado al canvas
	 */
	private aplicarDisenoImportado(diseno: DisenoGuardado) {
		// Buscar la plantilla correspondiente
		const plantilla = this.plantillasDisponibles.find(
			(p) => p.id === diseno.plantillaId,
		);

		if (!plantilla) {
			this.mostrarError(
				`No se encontró la plantilla "${diseno.plantillaNombre || diseno.plantillaId}". Se usará la plantilla actual.`,
			);
			// Usar la plantilla actual pero cargar los elementos
			if (this.plantillaSeleccionada) {
				this.elementosEnCanvas = [
					...this.plantillaSeleccionada.elementosFijos,
					...diseno.elementos,
				];
			}
		} else {
			// Seleccionar la plantilla correcta
			this.plantillaSeleccionada = plantilla;
			// Combinar elementos fijos de la plantilla con los importados
			this.elementosEnCanvas = [
				...plantilla.elementosFijos,
				...diseno.elementos,
			];
		}

		// Deseleccionar elemento actual
		this.elementoSeleccionado = null;

		// Guardar en autosave
		this.guardarAutomaticamente();
	}

	trackByElementId(index: number, elemento: ElementoEnCanvas): string {
		return elemento.id || `elemento-${index}`;
	}

	getIconSize(elemento: ElementoEnCanvas): number {
		if (!elemento?.tamano) return 24;

		// Usar el tamaño más pequeño entre ancho y alto como referencia
		const minDimension = Math.min(elemento.tamano.ancho, elemento.tamano.alto);

		// El ícono será proporcional al 60% de la dimensión más pequeña
		const iconSize = minDimension * 0.6;

		// Límites para asegurar legibilidad
		const minSize = 24; // Tamaño mínimo aumentado para evitar cortes
		const maxSize = 80; // Tamaño máximo más grande para elementos grandes

		const result = Math.max(minSize, Math.min(maxSize, Math.round(iconSize)));
		return Number.isFinite(result) ? result : 24;
	}

	shouldShowLabel(elemento: ElementoEnCanvas): boolean {
		if (!elemento?.tamano) return false;

		// Ocultar etiqueta si el elemento es muy pequeño (menos de 70px de ancho o alto)
		const minDimension = Math.min(elemento.tamano.ancho, elemento.tamano.alto);
		return minDimension >= 70;
	}

	getLabelFontSize(elemento: ElementoEnCanvas): number {
		if (!elemento?.tamano) return 10;

		// Usar dimensión más pequeña como base para el tamaño de fuente
		const minDimension = Math.min(elemento.tamano.ancho, elemento.tamano.alto);
		const fontSize = minDimension * 0.12;

		// Límites para buena legibilidad
		const result = Math.max(9, Math.min(14, fontSize));
		return Number.isFinite(result) ? result : 10;
	}

	isElementoFijo(elemento: ElementoEnCanvas): boolean {
		return !!this.plantillaSeleccionada?.elementosFijos.find(
			(e) => e.id === elemento.id,
		);
	}

	getMiniElementoStyle(elemento: ElementoEnCanvas) {
		return {
			position: 'absolute',
			'left.px': elemento.posicion.x / 10,
			'top.px': elemento.posicion.y / 10,
			'width.px': elemento.tamano.ancho / 10,
			'height.px': elemento.tamano.alto / 10,
			'background-color': elemento.color,
		};
	}

	// Métodos de teclado
	onKeyDown(event: KeyboardEvent) {
		if (!this.elementoSeleccionado) return;

		switch (event.key) {
			case 'Delete':
			case 'Backspace':
				this.eliminarElemento(this.elementoSeleccionado);
				break;
			case 'ArrowUp':
				this.moverElemento(this.elementoSeleccionado, 'arriba');
				event.preventDefault();
				break;
			case 'ArrowDown':
				this.moverElemento(this.elementoSeleccionado, 'abajo');
				event.preventDefault();
				break;
			case 'ArrowLeft':
				this.moverElemento(this.elementoSeleccionado, 'izquierda');
				event.preventDefault();
				break;
			case 'ArrowRight':
				this.moverElemento(this.elementoSeleccionado, 'derecha');
				event.preventDefault();
				break;
			case '+':
			case '=':
				this.redimensionarElemento(this.elementoSeleccionado, 'mas');
				event.preventDefault();
				break;
			case '-':
				this.redimensionarElemento(this.elementoSeleccionado, 'menos');
				event.preventDefault();
				break;
			case 'r':
			case 'R':
				this.rotarElemento(this.elementoSeleccionado);
				event.preventDefault();
				break;
		}
	}

	moverElemento(
		elemento: ElementoEnCanvas,
		direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha',
	) {
		if (this.isElementoFijo(elemento)) {
			this.mostrarMensaje('No se puede mover elementos fijos de la plantilla');
			return;
		}

		const incremento = 5;
		const maxX =
			(this.plantillaSeleccionada?.dimensiones.ancho || 800) -
			elemento.tamano.ancho;
		const maxY =
			(this.plantillaSeleccionada?.dimensiones.alto || 600) -
			elemento.tamano.alto;

		switch (direccion) {
			case 'arriba':
				elemento.posicion.y = Math.max(0, elemento.posicion.y - incremento);
				break;
			case 'abajo':
				elemento.posicion.y = Math.min(maxY, elemento.posicion.y + incremento);
				break;
			case 'izquierda':
				elemento.posicion.x = Math.max(0, elemento.posicion.x - incremento);
				break;
			case 'derecha':
				elemento.posicion.x = Math.min(maxX, elemento.posicion.x + incremento);
				break;
		}
		this.guardarAutomaticamente();
	}

	toggleSidebar() {
		this.sidebarAbierto = !this.sidebarAbierto;
	}

	getCanvasStyle() {
		if (!this.plantillaSeleccionada) {
			return {
				'width.px': 800,
				'height.px': 600,
				'min-width.px': 800,
				'min-height.px': 600,
			};
		}

		const style = {
			'width.px': this.plantillaSeleccionada.dimensiones.ancho,
			'height.px': this.plantillaSeleccionada.dimensiones.alto,
			'min-width.px': this.plantillaSeleccionada.dimensiones.ancho,
			'min-height.px': this.plantillaSeleccionada.dimensiones.alto,
		};

		return style;
	}

	getElementoStyle(elemento: ElementoEnCanvas) {
		const style = {
			position: 'absolute',
			'left.px': elemento.posicion.x,
			'top.px': elemento.posicion.y,
			'width.px': elemento.tamano.ancho,
			'height.px': elemento.tamano.alto,
			'background-color': 'transparent',
			transform: elemento.rotacion ? `rotate(${elemento.rotacion}deg)` : 'none',
			'z-index': 1,
		};

		return style;
	}
}
