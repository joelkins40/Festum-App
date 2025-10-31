import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
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
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './plano.component.html',
  styleUrl: './plano.component.scss'
})
export class PlanoComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLDivElement>;

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

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
      tamano: { ancho: 80, alto: 80 }
    },
    {
      id: 'mesa-rectangular',
      tipo: 'mesa-rectangular',
      nombre: 'Mesa Rectangular',
      icono: 'table_bar',
      color: '#8b4513',
      tamano: { ancho: 120, alto: 60 }
    },
    {
      id: 'silla',
      tipo: 'silla',
      nombre: 'Silla',
      icono: 'event_seat',
      color: '#654321',
      tamano: { ancho: 30, alto: 30 }
    },
    {
      id: 'escenario',
      tipo: 'escenario',
      nombre: 'Escenario',
      icono: 'theater_comedy',
      color: '#9c27b0',
      tamano: { ancho: 200, alto: 100 }
    },
    {
      id: 'barra',
      tipo: 'barra',
      nombre: 'Barra',
      icono: 'local_bar',
      color: '#20b2aa',
      tamano: { ancho: 150, alto: 50 }
    },
    {
      id: 'cabina-dj',
      tipo: 'cabina-dj',
      nombre: 'Cabina DJ/Sonido',
      icono: 'library_music',
      color: '#4a4a4a',
      tamano: { ancho: 100, alto: 80 }
    },
    {
      id: 'zona-comida',
      tipo: 'zona-comida',
      nombre: 'Zona de Comida',
      icono: 'restaurant_menu',
      color: '#ff6b35',
      tamano: { ancho: 180, alto: 120 }
    },
    {
      id: 'entrada',
      tipo: 'entrada',
      nombre: 'Entrada',
      icono: 'meeting_room',
      color: '#607d8b',
      tamano: { ancho: 60, alto: 100 }
    },
    {
      id: 'baños',
      tipo: 'baños',
      nombre: 'Baños',
      icono: 'wc',
      color: '#795548',
      tamano: { ancho: 80, alto: 80 }
    },
    {
      id: 'planta',
      tipo: 'planta',
      nombre: 'Planta/Decoración',
      icono: 'local_florist',
      color: '#4caf50',
      tamano: { ancho: 40, alto: 40 }
    },
    {
      id: 'mesa-regalos',
      tipo: 'mesa-regalos',
      nombre: 'Mesa de Regalos',
      icono: 'card_giftcard',
      color: '#e91e63',
      tamano: { ancho: 100, alto: 60 }
    }
  ];

  // Control de UI
  sidebarAbierto = true;
  elementoSeleccionado: ElementoEnCanvas | null = null;

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
            icono: 'stage'
          }
        ]
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
            icono: 'stage'
          }
        ]
      }
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
      elementosFijos: []
    };

    this.plantillasDisponibles = [plantillaPorDefecto];
    this.seleccionarPlantilla(plantillaPorDefecto);
  }

  seleccionarPlantilla(plantilla: PlantillaSalon) {
    this.plantillaSeleccionada = plantilla;
    this.elementosEnCanvas = [...plantilla.elementosFijos];
    this.mostrarMensaje(`Plantilla "${plantilla.nombre}" cargada`);
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      // Elemento arrastrado desde sidebar al canvas
      const elementoArrastrable = event.item.data as ElementoArrastrable;

      if (elementoArrastrable && this.plantillaSeleccionada) {
        // Calcular posición basada en donde se soltó el elemento
        const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
        const dropPoint = event.dropPoint;

        const nuevoElemento: ElementoEnCanvas = {
          id: this.generarIdUnico(),
          tipo: elementoArrastrable.tipo,
          nombre: elementoArrastrable.nombre,
          posicion: {
            x: Math.max(0, Math.min(dropPoint.x - canvasRect.left - elementoArrastrable.tamano.ancho / 2,
                this.plantillaSeleccionada.dimensiones.ancho - elementoArrastrable.tamano.ancho)),
            y: Math.max(0, Math.min(dropPoint.y - canvasRect.top - elementoArrastrable.tamano.alto / 2,
                this.plantillaSeleccionada.dimensiones.alto - elementoArrastrable.tamano.alto))
          },
          tamano: { ...elementoArrastrable.tamano },
          color: elementoArrastrable.color,
          icono: elementoArrastrable.icono,
          rotacion: 0
        };

        this.elementosEnCanvas.push(nuevoElemento);
        this.guardarAutomaticamente();
        this.mostrarMensaje(`${elementoArrastrable.nombre} agregado`);
      }
    }
  }

  private dragStartPosition: { x: number, y: number } | null = null;

  onElementDragStart(event: any, elemento: ElementoEnCanvas) {
    // Guardar la posición inicial para referencia
    this.dragStartPosition = {
      x: elemento.posicion.x,
      y: elemento.posicion.y
    };
  }

  onElementDragEnd(event: any, elemento: ElementoEnCanvas) {
    if (!this.dragStartPosition) return;

    // Obtener el desplazamiento total del drag
    const transform = event.source.getFreeDragPosition();
    
    // Calcular la nueva posición basada en la posición inicial + desplazamiento
    const nuevaX = Math.max(0, Math.min(
      this.dragStartPosition.x + transform.x,
      (this.plantillaSeleccionada?.dimensiones.ancho || 800) - elemento.tamano.ancho
    ));
    
    const nuevaY = Math.max(0, Math.min(
      this.dragStartPosition.y + transform.y,
      (this.plantillaSeleccionada?.dimensiones.alto || 600) - elemento.tamano.alto
    ));

    // Actualizar la posición del elemento
    elemento.posicion.x = Math.round(nuevaX);
    elemento.posicion.y = Math.round(nuevaY);

    // Limpiar la posición de inicio
    this.dragStartPosition = null;

    // Resetear el transform del drag
    event.source.reset();

    this.guardarAutomaticamente();
  }

  seleccionarElemento(elemento: ElementoEnCanvas, event: Event) {
    event.stopPropagation();
    this.elementoSeleccionado = elemento;
  }

  eliminarElemento(elemento: ElementoEnCanvas) {
    // Solo permitir eliminar elementos que no sean fijos de la plantilla
    if (!this.plantillaSeleccionada?.elementosFijos.find(e => e.id === elemento.id)) {
      const index = this.elementosEnCanvas.indexOf(elemento);
      if (index > -1) {
        this.elementosEnCanvas.splice(index, 1);
        this.elementoSeleccionado = null;
        this.guardarAutomaticamente();
        this.mostrarMensaje('Elemento eliminado');
      }
    } else {
      this.mostrarMensaje('No se pueden eliminar elementos fijos de la plantilla');
    }
  }

  rotarElemento(elemento: ElementoEnCanvas) {
    elemento.rotacion = (elemento.rotacion || 0) + 45;
    if (elemento.rotacion >= 360) {
      elemento.rotacion = 0;
    }
    this.guardarAutomaticamente();
  }

  redimensionarElemento(elemento: ElementoEnCanvas, direccion: 'mas' | 'menos') {
    if (this.isElementoFijo(elemento)) {
      this.mostrarMensaje('No se puede redimensionar elementos fijos de la plantilla');
      return;
    }

    const factor = direccion === 'mas' ? 1.2 : 0.8;
    const nuevoAncho = Math.max(25, Math.min(300, elemento.tamano.ancho * factor));
    const nuevoAlto = Math.max(25, Math.min(300, elemento.tamano.alto * factor));

    elemento.tamano.ancho = nuevoAncho;
    elemento.tamano.alto = nuevoAlto;
    this.guardarAutomaticamente();
    this.mostrarMensaje(`Elemento ${direccion === 'mas' ? 'ampliado' : 'reducido'}`);
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
      elementos: this.elementosEnCanvas.filter(e =>
        !this.plantillaSeleccionada?.elementosFijos.find(f => f.id === e.id)
      ),
      fechaGuardado: new Date().toISOString(),
      version: '1.0'
    };

    console.log('Diseño exportado:', JSON.stringify(diseno, null, 2));

    // Simular envío a API
    setTimeout(() => {
      this.mostrarMensaje('Diseño guardado exitosamente');
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('festum_ultimo_diseno', JSON.stringify(diseno));
      }
    }, 500);
  }

  private guardarAutomaticamente() {
    const diseno = {
      plantillaId: this.plantillaSeleccionada?.id,
      elementos: this.elementosEnCanvas.filter(e =>
        !this.plantillaSeleccionada?.elementosFijos.find(f => f.id === e.id)
      ),
      fechaAutosave: new Date().toISOString()
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
          const diseno = JSON.parse(autosave);
          // El diseño se cargará cuando se seleccione la plantilla correspondiente
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

  private generarIdUnico(): string {
    return 'elemento_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      return event.touches[0].clientX;
    }
    return 0;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      return event.touches[0].clientY;
    }
    return 0;
  }

  trackByElementId(index: number, elemento: ElementoEnCanvas): string {
    return elemento.id;
  }

  getIconSize(elemento: ElementoEnCanvas): number {
    // Calcular el tamaño basado en el área del elemento para mejor proporción
    const area = elemento.tamano.ancho * elemento.tamano.alto;
    const baseSize = Math.sqrt(area) * 0.35;

    // Usar límites más amplios para elementos grandes
    const minSize = 18;
    const maxSize = 72;

    return Math.max(minSize, Math.min(maxSize, Math.round(baseSize)));
  }

  shouldShowLabel(elemento: ElementoEnCanvas): boolean {
    return elemento.tamano.ancho > 80 && elemento.tamano.alto > 50;
  }

  getLabelFontSize(elemento: ElementoEnCanvas): number {
    const baseSize = Math.min(elemento.tamano.ancho, elemento.tamano.alto);
    return Math.max(8, Math.min(12, baseSize * 0.15));
  }

  private getCanvasScale(): number {
    if (!this.canvasRef?.nativeElement || !this.plantillaSeleccionada) {
      return 1;
    }

    const canvasElement = this.canvasRef.nativeElement;
    const canvasRect = canvasElement.getBoundingClientRect();
    const scaleX = canvasRect.width / this.plantillaSeleccionada.dimensiones.ancho;
    const scaleY = canvasRect.height / this.plantillaSeleccionada.dimensiones.alto;

    return Math.min(scaleX, scaleY);
  }

  isElementoFijo(elemento: ElementoEnCanvas): boolean {
    return !!this.plantillaSeleccionada?.elementosFijos.find(e => e.id === elemento.id);
  }

  getMiniElementoStyle(elemento: ElementoEnCanvas) {
    return {
      'position': 'absolute',
      'left.px': elemento.posicion.x / 10,
      'top.px': elemento.posicion.y / 10,
      'width.px': elemento.tamano.ancho / 10,
      'height.px': elemento.tamano.alto / 10,
      'background-color': elemento.color
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
    }
  }

  moverElemento(elemento: ElementoEnCanvas, direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha') {
    if (this.isElementoFijo(elemento)) {
      this.mostrarMensaje('No se puede mover elementos fijos de la plantilla');
      return;
    }

    const incremento = 5;
    const maxX = (this.plantillaSeleccionada?.dimensiones.ancho || 800) - elemento.tamano.ancho;
    const maxY = (this.plantillaSeleccionada?.dimensiones.alto || 600) - elemento.tamano.alto;

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
        'min-height.px': 600
      };
    }

    return {
      'width.px': this.plantillaSeleccionada.dimensiones.ancho,
      'height.px': this.plantillaSeleccionada.dimensiones.alto,
      'min-width.px': this.plantillaSeleccionada.dimensiones.ancho,
      'min-height.px': this.plantillaSeleccionada.dimensiones.alto
    };
  }

  getElementoStyle(elemento: ElementoEnCanvas) {
    return {
      'position': 'absolute',
      'left.px': elemento.posicion.x,
      'top.px': elemento.posicion.y,
      'width.px': elemento.tamano.ancho,
      'height.px': elemento.tamano.alto,
      'background-color': 'transparent',
      'transform': elemento.rotacion ? `rotate(${elemento.rotacion}deg)` : 'none'
    };
  }
}
