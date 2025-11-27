# Plano View Component

## Responsabilidades

El componente `plano-view` es un **componente reutilizable** para visualizar y manipular elementos de un plano de evento. Se encarga de:

1. **Renderizar elementos visuales** (mesas, sillas, decoración) en un canvas
2. **Drag & drop** de elementos dentro del canvas con restricciones de área
3. **Selección visual** de elementos con feedback interactivo
4. **Mostrar iconos Material** correspondientes a cada tipo de elemento
5. **Calcular estilos dinámicos** (tamaño, posición, rotación) de elementos

## Firma Esperada

### Input: `elements`

```typescript
@Input() elements: ElementItem[]

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

### Input: `selectedProduct` (opcional)

```typescript
@Input() selectedProduct?: Product
```

### Input: `diseno` (opcional)

```typescript
@Input() set diseno(value: { elementos: ElementoEnCanvas[] } | null)
```

### Input: `showSidebar` (opcional, default: `false`)

```typescript
@Input() showSidebar?: boolean = false;
```

**Propósito**: Controla la visibilidad del sidebar lateral con elementos arrastrables.

**Comportamiento**:

- Por defecto, el componente **no muestra el sidebar** (`showSidebar = false`)
- Cuando `showSidebar = true`, se renderiza un panel lateral con:
  - Header con icono "Elementos"
  - Lista de elementos arrastrables basada en `elements`
  - Drag & drop integrado hacia el canvas
  - Actualización reactiva cuando cambia `elements`

**Nota importante**: El sidebar se actualiza automáticamente cada vez que el `@Input() elements` cambia, sin necesidad de refresh manual.

## Compatibilidad con `DisenoGuardado`

El componente acepta la estructura `DisenoGuardado` de `plano.component.ts`:

```typescript
interface DisenoGuardado {
  plantillaId: string;
  plantillaNombre: string;
  elementos: ElementoEnCanvas[];
  fechaGuardado: string;
  version: string;
}
```

Pasar solo la propiedad `elementos` al input `[elements]` o usar el setter `[diseno]` para pasar el objeto completo.

## Uso

### Básico (sin sidebar)

```html
<app-plano-view [elements]="planoElements"></app-plano-view>
```

### Con sidebar visible

```html
<app-plano-view [elements]="planoElements" [showSidebar]="true"></app-plano-view>
```

```typescript
// En el componente padre
export class MiComponente {
  planoElements: ElementItem[] = [
    {
      id: "mesa-1",
      tipo: "mesa-redonda",
      nombre: "Mesa Redonda",
      posicion: { x: 100, y: 100 },
      tamano: { ancho: 120, alto: 120 },
      color: "#20b2aa",
      icono: "table_restaurant",
      rotacion: 0,
      productoServicioId: 4,
    },
  ];
}
```

**Importante**: Cuando `elements` cambia (por ejemplo, al aplicar una plantilla o agregar/eliminar elementos), el sidebar se actualiza automáticamente sin necesidad de acciones adicionales.

### Con producto seleccionado

```html
<app-plano-view [elements]="planoElements" [selectedProduct]="currentProduct"> </app-plano-view>
```

### Con diseño completo

```html
<app-plano-view [diseno]="plantilla.diseno"></app-plano-view>
```

## Render y Performance

- **Change Detection**: OnPush recomendado para optimización
- **TrackBy**: Usa `trackByElementId` para evitar re-renders innecesarios
- **CSS Transform**: Animaciones con `transform` para mejor performance
- **Lazy Loading**: Los iconos Material se cargan bajo demanda

## TODOs

### Tipos Compartidos

- [ ] Mover `ElementItem` y `ElementoEnCanvas` a `src/app/shared/types/`
- [ ] Centralizar interfaces entre `plano.component.ts` y `plano-view`
- [ ] Crear barrel exports para tipos compartidos

### Persistencia

- [ ] Las plantillas deben obtenerse desde el backend (API REST)
- [ ] Implementar guardado de diseños personalizados en servidor
- [ ] Versionar esquema de `DisenoGuardado` para migraciones

### Funcionalidad

- [ ] Agregar zoom in/out en el canvas
- [ ] Implementar rotación manual de elementos
- [ ] Snap-to-grid para alineación precisa
- [ ] Undo/Redo de movimientos

### Testing

- [ ] Tests unitarios para cálculos de posición
- [ ] Tests de integración con drag & drop
- [ ] Visual regression tests para elementos

## Testing Local (DevTools)

Para probar plantillas desde la consola del navegador:

```javascript
// Seedear plantilla de prueba
window.mockTemplate = {
  plantillaId: "test",
  plantillaNombre: "Test Template",
  elementos: [
    {
      id: "test-1",
      tipo: "mesa-redonda",
      nombre: "Mesa Test",
      posicion: { x: 200, y: 200 },
      tamano: { ancho: 120, alto: 120 },
      color: "#20b2aa",
      icono: "table_restaurant",
      productoServicioId: 4,
    },
  ],
  fechaGuardado: new Date().toISOString(),
  version: "1.0",
};

// Aplicar en componente (desde consola Angular DevTools)
ng.getComponent($0).aplicarPlantilla({
  id: "test",
  nombre: "Test",
  descripcion: "Test",
  tipo: "Test",
  productosIds: [4],
  diseno: window.mockTemplate,
});
```

## Notas de Desarrollo

- Los elementos con `productoServicioId` se mapean automáticamente a productos del catálogo
- Solo productos (no servicios) se visualizan en el plano
- El canvas tiene dimensiones fijas de 800x600px (configurables)
- Los colores e iconos se obtienen del catálogo de productos cuando está disponible
