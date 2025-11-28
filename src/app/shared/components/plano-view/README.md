# Plano View Component

Componente reutilizable de Angular 19 para visualizar y manipular planos de eventos con drag & drop, controles interactivos y sidebar opcional.

---

## Inputs

### `elements: ElementItem[]`

Elementos iniciales a mostrar. El componente crea una copia interna para el canvas y **nunca modifica este array**.

```typescript
interface ElementItem {
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
```

### `showSidebar?: boolean` (default: `false`)

Controla la visibilidad del sidebar con elementos arrastrables únicos.

### `plantillaNombre?: string`

Nombre de la plantilla a mostrar en la toolbar. Se procesa para mostrar solo la parte antes de `" - "`.

### `selectedProduct?: Product`

Producto seleccionado (uso futuro para agregar al canvas automáticamente).

### `diseno: { elementos: ElementoEnCanvas[] } | null`

Setter alternativo para cargar elementos desde un diseño guardado.

---

## Estado Interno

### Sin mutaciones al padre

- `canvasElements`: Copia interna de `elements` donde ocurren todas las modificaciones
- `elementosUnicos`: Lista derivada para el sidebar (solo un elemento por tipo+nombre)
- `elementoSeleccionado`: Elemento actualmente seleccionado en el canvas

**Garantía**: Las acciones (eliminar, rotar, redimensionar) solo afectan `canvasElements`, no el array original `elements`.

---

## Sidebar de Elementos Únicos

El sidebar muestra **solo un elemento por cada combinación única de tipo+nombre**, sin importar cuántas instancias existan en `elements`.

**Ejemplo**:

```typescript
// Input: elements
[
  { tipo: 'mesa', nombre: 'Mesa Redonda', ... },
  { tipo: 'mesa', nombre: 'Mesa Redonda', ... }, // duplicado
  { tipo: 'silla', nombre: 'Silla Tiffany', ... }
]

// Sidebar muestra solo:
[
  { tipo: 'mesa', nombre: 'Mesa Redonda', ... },
  { tipo: 'silla', nombre: 'Silla Tiffany', ... }
]
```

Cada elemento único puede arrastrarse infinitas veces al canvas.

---

## Drag & Drop

### Desde sidebar → canvas

1. Usuario arrastra elemento del sidebar
2. Se crea **nueva instancia** con ID único en `canvasElements`
3. Posición calculada según punto de drop
4. El elemento original del sidebar permanece disponible

### Dentro del canvas

- Movimiento restringido a los límites del canvas (800x600px)
- Posición se actualiza en `canvasElements`
- Escalado automático si el canvas está redimensionado visualmente

---

## Controles de Elementos

### Toolbar Interactiva

Aparece automáticamente en la parte superior del canvas:

**Con elemento seleccionado**:

- 🔄 **Rotar** (R): +45° por iteración
- ➕ **Aumentar** (+): ×1.2 (máx 500px)
- ➖ **Reducir** (-): ×0.8 (mín 40px)
- 🗑️ **Eliminar** (Delete): Remueve del canvas

**Sin elemento seleccionado**:

- Mensaje: "Arrastra elementos desde el panel lateral o selecciona uno para editarlo"

**Botón de sidebar** (solo si `showSidebar = true`):

- Toggle para abrir/cerrar el panel lateral
- Icono: `chevron_left` (abierto) / `chevron_right` (cerrado)

---

## Mapeo de Teclado

Atajos idénticos al componente `plano` original:

| Tecla                  | Acción              | Requisito             |
| ---------------------- | ------------------- | --------------------- |
| `R` / `r`              | Rotar elemento 45°  | Elemento seleccionado |
| `+` / `=`              | Aumentar tamaño     | Elemento seleccionado |
| `-`                    | Reducir tamaño      | Elemento seleccionado |
| `Delete` / `Backspace` | Eliminar del canvas | Elemento seleccionado |

**Nota**: Las teclas operan sobre `canvasElements`, no sobre `elements` original.

---

## Uso

### Básico (solo visualización)

```html
<app-plano-view [elements]="planoElements"></app-plano-view>
```

### Con toolbar y plantilla

```html
<app-plano-view [elements]="planoElements" [plantillaNombre]="'Boda Clásica - Salón A'"> </app-plano-view>
```

Muestra: "Boda Clásica" + dimensiones (800 x 600 px)

### Editor completo con sidebar

```html
<app-plano-view [elements]="planoElements" [showSidebar]="true" [plantillaNombre]="plantillaSeleccionada?.nombre"> </app-plano-view>
```

### Desde diseño guardado

```html
<app-plano-view [diseno]="plantilla.diseno"></app-plano-view>
```

---

## Limitaciones y Buenas Prácticas

### ✅ Lo que hace

- Mantiene estado interno independiente del padre
- Genera elementos únicos para el sidebar automáticamente
- Soporta drag & drop ilimitado desde sidebar
- Controles interactivos (rotar, escalar, eliminar)
- Atajos de teclado completos

### ❌ Lo que NO hace

- No modifica el array `elements` recibido como Input
- No emite eventos al padre (unidireccional)
- No persiste cambios automáticamente
- No valida límites de plantillas (elementos fijos)
- No implementa undo/redo

### Sincronización con el padre

Si necesitas actualizar el padre cuando cambia el canvas:

```typescript
// TODO: Agregar @Output() para comunicación bidireccional
@Output() canvasElementsChange = new EventEmitter<ElementItem[]>();
```

---

## Estilos Clave

### Canvas

- Dimensiones fijas: 800×600px (configurable vía `canvasDimensions`)
- Borde punteado: `#dee2e6`
- Background: blanco
- Drag activo: borde turquesa `#20b2aa`

### Toolbar

- Background: `#f8f9fa`
- Altura mínima: 56px
- Controles con background turquesa cuando hay selección

### Sidebar

- Ancho: 300px
- Header turquesa con sombra
- Grid responsive para elementos (90px mínimo por celda)

---

## Estructura de Archivos

```
plano-view/
├── plano-view.component.ts    # Lógica del componente
├── plano-view.component.html  # Template
├── plano-view.component.scss  # Estilos
├── types.ts                   # Interfaces (ElementItem, ElementoEnCanvas)
└── README.md                  # Este archivo
```

---

## TODO / Mejoras Futuras

### Comunicación

- [ ] `@Output() canvasElementsChange` para sincronización bidireccional
- [ ] `@Output() elementoSeleccionadoChange` para notificar cambios de selección

### Funcionalidad

- [ ] Undo/Redo de acciones
- [ ] Snap-to-grid para alineación
- [ ] Zoom in/out del canvas
- [ ] Validación de elementos fijos (como en plano.component)
- [ ] Guardado automático con debounce

### Tipos

- [ ] Mover `ElementItem` y `ElementoEnCanvas` a `src/app/shared/types/`
- [ ] Crear barrel exports (`index.ts`)

### Accesibilidad

- [ ] ARIA labels para controles
- [ ] Soporte de teclado completo (flechas para mover)
- [ ] Focus visible en elementos seleccionados

---

## Testing

### Pruebas recomendadas

1. Arrastrar elemento del sidebar → verificar nueva instancia en canvas
2. Eliminar elemento → verificar que `elements` original no cambia
3. Rotar/escalar → verificar límites (40-500px, 0-360°)
4. Atajos de teclado → R, +, -, Delete
5. Sidebar únicos → duplicados en `elements` muestran solo 1 en sidebar

### Debug en consola

```javascript
// Acceder al componente en DevTools
const planoView = ng.getComponent($0);
console.log("Original:", planoView.elements);
console.log("Canvas:", planoView.canvasElements);
console.log("Únicos:", planoView.elementosUnicos);
```

---

## Compatibilidad

- **Angular**: 19+
- **Sintaxis**: `@if`, `@for`, `@else`, standalone components
- **Material**: 18+
- **CDK Drag & Drop**: 18+

---

**Última actualización**: 27 de noviembre de 2025
**Versión**: 2.0.0 (refactor con estado interno)
