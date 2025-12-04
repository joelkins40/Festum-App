import {
	Component,
	OnInit,
	inject,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { HttpClientModule } from '@angular/common/http';
import { PlanoViewComponent } from '../../../shared/components/plano-view/plano-view.component';

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
	selector: 'app-plano',
	standalone: true,
	imports: [
		CommonModule,
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
		PlanoViewComponent,
	],
	templateUrl: './plano.component.html',
	styleUrl: './plano.component.scss',
})
export class PlanoComponent implements OnInit {
	@ViewChild('canvas', { static: false })
	canvasRef!: ElementRef<HTMLDivElement>;
	@ViewChild('fileInput', { static: false })
	fileInputRef!: ElementRef<HTMLInputElement>;
	@ViewChild(PlanoViewComponent) planoView!: PlanoViewComponent;

	private snackBar = inject(MatSnackBar);

	// Datos del plano
	plantillasDisponibles: PlantillaSalon[] = [];
	plantillaSeleccionada: PlantillaSalon | null = null;
	elementosEnCanvas: ElementoEnCanvas[] = [];

	// Control de UI
	// sidebarAbierto y elementoSeleccionado ahora son manejados por PlanoViewComponent

	ngOnInit() {
		this.cargarPlantillas();
		this.cargarDisenoGuardado();
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

	nuevoDiseno() {
		if (this.plantillaSeleccionada) {
			this.elementosEnCanvas = [...this.plantillaSeleccionada.elementosFijos];
			// this.elementoSeleccionado = null; // Ya no se usa
			this.limpiarAutosave();
			this.mostrarMensaje('Nuevo diseño iniciado');
		}
	}

	guardarDiseno() {
		// Obtener elementos actuales del componente hijo si está disponible
		const elementosActuales = this.planoView
			? this.planoView.canvasElements
			: this.elementosEnCanvas;

		const diseno: DisenoGuardado = {
			plantillaId: this.plantillaSeleccionada?.id || '',
			plantillaNombre: this.plantillaSeleccionada?.nombre || '',
			elementos: elementosActuales.filter(
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
		// Obtener elementos actuales del componente hijo si está disponible
		const elementosActuales = this.planoView
			? this.planoView.canvasElements
			: this.elementosEnCanvas;

		const diseno = {
			plantillaId: this.plantillaSeleccionada?.id,
			elementos: elementosActuales.filter(
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

	private cargarDisenoGuardado() {
		if (typeof window !== 'undefined' && localStorage) {
			const autosave = localStorage.getItem('festum_autosave_diseno');
			if (autosave) {
				try {
					// El diseño se cargará cuando se seleccione la plantilla correspondiente
					JSON.parse(autosave);
				} catch (error) {
					console.error('Error cargando autosave:', error);
				}
			}
		}
	}

	private limpiarAutosave() {
		if (typeof window !== 'undefined' && localStorage) {
			localStorage.removeItem('festum_autosave_diseno');
		}
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

		// Guardar en autosave
		this.guardarAutomaticamente();
	}
}
