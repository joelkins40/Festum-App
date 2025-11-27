# Integración de plano-view con nuevo-evento

## Actualización sugerida para nuevo-evento.component.html

### Opción 1: Solo visualización (sin controles)

```html
<!-- Mantener implementación actual -->
<app-plano-view [elements]="planoElements" [selectedProduct]="selectedProductForPlano"> </app-plano-view>
```

**Resultado**: Canvas simple sin toolbar ni sidebar (comportamiento actual).

### Opción 2: Con toolbar y nombre de plantilla

```html
<app-plano-view [elements]="planoElements" [selectedProduct]="selectedProductForPlano" [plantillaNombre]="plantillaSeleccionada?.nombre"> </app-plano-view>
```

**Resultado**:

- Muestra toolbar con información de la plantilla
- Muestra dimensiones del canvas (800 x 600 px)
- Controles de elementos al seleccionar
- Sin sidebar lateral

### Opción 3: Editor completo con sidebar

```html
<app-plano-view [elements]="planoElements" [selectedProduct]="selectedProductForPlano" [showSidebar]="true" [plantillaNombre]="plantillaSeleccionada?.nombre"> </app-plano-view>
```

**Resultado**:

- Sidebar lateral con elementos arrastrables
- Toolbar con botón de toggle del sidebar
- Información de plantilla y dimensiones
- Controles completos de elementos (rotar, escalar, eliminar)

## Cambios necesarios en nuevo-evento.component.ts

Ninguno. Las propiedades ya existen:

- ✅ `planoElements: ElementItem[]`
- ✅ `plantillaSeleccionada: PlantillaEvento | null`

El componente `plano-view` maneja internamente:

- Selección de elementos
- Rotación
- Redimensionamiento
- Eliminación
- Toggle del sidebar

## Eventos futuros (opcional)

Si se requiere sincronización bidireccional:

```typescript
// plano-view.component.ts
@Output() elementsChange = new EventEmitter<ElementItem[]>();
@Output() elementoSeleccionadoChange = new EventEmitter<ElementItem | null>();

// Emitir cuando cambian elementos
eliminarElemento(): void {
  if (this.elementoSeleccionado) {
    const index = this.elements.indexOf(this.elementoSeleccionado);
    if (index > -1) {
      this.elements.splice(index, 1);
      this.elementoSeleccionado = null;
      this.elementsChange.emit(this.elements); // 🔥 Emitir cambio
    }
  }
}
```

```html
<!-- nuevo-evento.component.html -->
<app-plano-view [elements]="planoElements" (elementsChange)="onPlanoElementsChange($event)" [showSidebar]="true" [plantillaNombre]="plantillaSeleccionada?.nombre"> </app-plano-view>
```

```typescript
// nuevo-evento.component.ts
onPlanoElementsChange(elements: ElementItem[]): void {
  this.planoElements = elements;
  // Sincronizar con productosEnNota si es necesario
  this.actualizarProductosSeleccionados();
}
```

## Comparación de configuraciones

| Configuración       | Toolbar | Sidebar | Controles | Dimensiones | Nombre Plantilla |
| ------------------- | ------- | ------- | --------- | ----------- | ---------------- |
| Básico (actual)     | ❌      | ❌      | ❌        | ❌          | ❌               |
| Con plantillaNombre | ✅      | ❌      | ✅        | ✅          | ✅               |
| Editor completo     | ✅      | ✅      | ✅        | ✅          | ✅               |

## Recomendación

Para `nuevo-evento`:

- **Usar Opción 2** (con plantillaNombre): Permite a los usuarios ver información contextual y editar elementos sin saturar la UI con el sidebar.

Para un futuro componente de editor de planos:

- **Usar Opción 3** (editor completo): Interfaz completa para diseño de planos con sidebar y todas las herramientas.

## Testing rápido

Cambiar temporalmente la línea 375 de `nuevo-evento.component.html`:

```html
<!-- Antes -->
<app-plano-view [elements]="planoElements" [selectedProduct]="selectedProductForPlano"> </app-plano-view>

<!-- Después (testing) -->
<app-plano-view [elements]="planoElements" [selectedProduct]="selectedProductForPlano" [showSidebar]="true" [plantillaNombre]="plantillaSeleccionada?.nombre"> </app-plano-view>
```

**Pasos de prueba:**

1. Ir a "Nuevo Evento"
2. Agregar productos
3. Seleccionar plantilla del dropdown
4. Click en "Aplicar Plantilla"
5. Verificar:
   - ✅ Sidebar lateral con elementos
   - ✅ Botón de toggle funciona
   - ✅ Toolbar muestra nombre de plantilla y dimensiones
   - ✅ Click en elemento muestra controles
   - ✅ Botones de rotar/escalar/eliminar funcionan
   - ✅ Mensaje de ayuda cuando no hay selección

## Límites y restricciones

- **Redimensionamiento**: Mínimo 40px, máximo 500px
- **Rotación**: Incrementos de 45° (8 posiciones)
- **Canvas**: Dimensiones fijas 800x600px (configurable en futuro)
- **Persistencia**: Los cambios solo afectan `elements` en memoria, no se guardan automáticamente
