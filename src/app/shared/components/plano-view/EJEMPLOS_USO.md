# Ejemplos de Uso - Plano View Component

## 1. Sin sidebar (uso actual en nuevo-evento)

```html
<!-- nuevo-evento.component.html -->
<app-plano-view [elements]="planoElements" [selectedProduct]="selectedProductForPlano"> </app-plano-view>
```

```typescript
// nuevo-evento.component.ts
export class NuevoEventoComponent {
  planoElements: ElementItem[] = [];
  selectedProductForPlano?: Product;

  // Los elementos se actualizan cuando se aplica una plantilla
  private aplicarPlantilla(plantilla: PlantillaEvento): void {
    // ... lógica existente ...
    this.planoElements = plantilla.diseno.elementos.map((elem) => ({
      ...elem,
      rotacion: elem.rotacion || 0,
    }));
  }
}
```

## 2. Con sidebar visible y controles completos

```html
<!-- ejemplo: editor-plano.component.html -->
<app-plano-view 
  [elements]="planoElements" 
  [showSidebar]="true"
  [plantillaNombre]="plantillaActual">
</app-plano-view>
```

```typescript
// ejemplo: editor-plano.component.ts
export class EditorPlanoComponent {
  plantillaActual = "Boda Clásica Elegante - Salón Principal";
  
  planoElements: ElementItem[] = [
    {
      id: "mesa-1",
      tipo: "mesa-redonda",
      nombre: "Mesa Redonda 10 personas",
      posicion: { x: 100, y: 100 },
      tamano: { ancho: 120, alto: 120 },
      color: "#20b2aa",
      icono: "table_restaurant",
      rotacion: 0,
      productoServicioId: 4,
    },
    {
      id: "silla-1",
      tipo: "silla",
      nombre: "Silla Tiffany Blanca",
      posicion: { x: 250, y: 100 },
      tamano: { ancho: 60, alto: 60 },
      color: "#20b2aa",
      icono: "event_seat",
      rotacion: 0,
      productoServicioId: 5,
    },
  ];

  agregarElemento(producto: Product): void {
    const nuevoElemento: ElementItem = {
      id: `producto_${Date.now()}`,
      tipo: producto.tipo.toLowerCase(),
      nombre: producto.nombre,
      posicion: { x: 150, y: 150 },
      tamano: { ancho: 120, alto: 120 },
      color: "#20b2aa",
      icono: producto.icono || "inventory_2",
      rotacion: 0,
      productoServicioId: producto.id,
    };

    // El sidebar se actualiza automáticamente cuando cambia el array
    this.planoElements = [...this.planoElements, nuevoElemento];
  }
}
```

## 3. Sidebar condicional (toggle)

```html
<!-- ejemplo: vista-flexible.component.html -->
<div class="toolbar">
  <button mat-raised-button (click)="toggleSidebar()">
    <mat-icon>{{ mostrarSidebar ? 'visibility_off' : 'visibility' }}</mat-icon>
    {{ mostrarSidebar ? 'Ocultar' : 'Mostrar' }} Elementos
  </button>
</div>

<app-plano-view [elements]="planoElements" [showSidebar]="mostrarSidebar"> </app-plano-view>
```

```typescript
// ejemplo: vista-flexible.component.ts
export class VistaFlexibleComponent {
  planoElements: ElementItem[] = [];
  mostrarSidebar = false;

  toggleSidebar(): void {
    this.mostrarSidebar = !this.mostrarSidebar;
  }
}
```

## 4. Cargar desde plantilla guardada

```html
<!-- ejemplo: cargar-plantilla.component.html -->
<app-plano-view [diseno]="plantillaSeleccionada?.diseno" [showSidebar]="true"> </app-plano-view>
```

```typescript
// ejemplo: cargar-plantilla.component.ts
export class CargarPlantillaComponent implements OnInit {
  plantillaSeleccionada: PlantillaEvento | null = null;

  constructor(private plantillasService: PlantillasService) {}

  ngOnInit(): void {
    this.plantillasService.getPlantillas().subscribe((plantillas) => {
      this.plantillaSeleccionada = plantillas[0]; // Cargar primera plantilla
    });
  }
}
```

## 5. Actualización reactiva de elementos

```typescript
// El sidebar se actualiza automáticamente en estos casos:

// Caso 1: Agregar elemento
agregarMesa(): void {
  const mesa = this.crearMesa();
  this.planoElements = [...this.planoElements, mesa]; // ✅ Sidebar actualizado
}

// Caso 2: Eliminar elemento
eliminarElemento(id: string): void {
  this.planoElements = this.planoElements.filter(el => el.id !== id); // ✅ Sidebar actualizado
}

// Caso 3: Aplicar plantilla completa
aplicarPlantilla(plantilla: PlantillaEvento): void {
  this.planoElements = plantilla.diseno.elementos; // ✅ Sidebar actualizado
}

// Caso 4: Limpiar todo
limpiarPlano(): void {
  this.planoElements = []; // ✅ Sidebar actualizado (vacío)
}
```

## 6. Uso de controles interactivos

Los controles de elementos están integrados automáticamente en la toolbar:

```html
<app-plano-view 
  [elements]="planoElements" 
  [showSidebar]="true"
  [plantillaNombre]="'Mi Evento - Salón A'">
</app-plano-view>
```

**Flujo de interacción del usuario:**

1. **Sin elemento seleccionado**: 
   - La toolbar muestra: "Arrastra elementos desde el panel lateral o selecciona uno para editarlo"

2. **Con elemento seleccionado** (click en elemento del canvas):
   - La toolbar muestra el nombre del elemento
   - Aparecen 4 botones:
     - 🔄 **Rotar**: Gira 45° cada vez (cicla en 360°)
     - ➕ **Aumentar**: Escala x1.2 (máximo 500px)
     - ➖ **Reducir**: Escala x0.8 (mínimo 40px)
     - 🗑️ **Eliminar**: Remueve del canvas y actualiza sidebar

3. **Botón de sidebar** (solo si `showSidebar = true`):
   - Click para abrir/cerrar el panel lateral
   - Icono cambia según estado: `chevron_left` ⟵ abierto, `chevron_right` ⟶ cerrado

**Atajos de teclado** (implementados en componentes consumidores):
- `Delete`: Eliminar elemento seleccionado
- `R`: Rotar elemento seleccionado
- `+`: Aumentar tamaño
- `-`: Reducir tamaño

## 7. Dimensiones del canvas

Las dimensiones se muestran automáticamente si `plantillaNombre` está definido:

```typescript
// En plano-view.component.ts
canvasDimensions = { ancho: 800, alto: 600 }; // Default

// La toolbar muestra: "800 x 600 px"
```

Para cambiar las dimensiones (futuro):
```typescript
@Input() canvasDimensions?: { ancho: number; alto: number };
```

## Notas importantes

1. **Default**: Por defecto `showSidebar = false`, el componente solo muestra el canvas
2. **Actualización automática**: El sidebar se actualiza reactivamente cuando cambia `elements` (gracias a `ngOnChanges`)
3. **Drag & drop**: Los elementos del sidebar pueden arrastrarse al canvas usando CDK Drag & Drop
4. **Performance**: Usa `trackBy` para optimizar el renderizado de listas grandes
5. **Compatibilidad**: Funciona con `ElementItem[]` o `DisenoGuardado.elementos[]`

## TODO: Migrar tipos a shared

```typescript
// Actualmente los tipos están en plano-view/types.ts
// Migrar a: src/app/shared/types/plano.types.ts

export interface ElementItem {
  id: string;
  tipo: string;
  nombre: string;
  posicion: { x: number; y: number };
  tamano: { ancho: number; alto: number };
  color: string;
  rotacion?: number;
  icono: string;
  productoServicioId?: number;
}

export type ElementoEnCanvas = ElementItem;
```
