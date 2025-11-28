# Testing Quick Guide - Plano View v2.0

## Verificación de Estado Interno

### 1. Abrir DevTools Console

```javascript
// Seleccionar el componente plano-view en Elements
const planoView = ng.getComponent($0);

// Verificar arrays separados
console.log("Original (NO cambia):", planoView.elements);
console.log("Canvas (estado interno):", planoView.canvasElements);
console.log("Sidebar únicos:", planoView.elementosUnicos);
```

### 2. Test: Elementos Únicos

**Caso**: Recibir elementos duplicados en `elements`

```typescript
// En el componente padre
this.planoElements = [
  { id: '1', tipo: 'mesa', nombre: 'Mesa Redonda', ... },
  { id: '2', tipo: 'mesa', nombre: 'Mesa Redonda', ... }, // Duplicado
  { id: '3', tipo: 'silla', nombre: 'Silla Tiffany', ... }
];
```

**Resultado esperado**:

- `elements.length` = 3
- `canvasElements.length` = 3
- `elementosUnicos.length` = 2 (solo mesa y silla)
- Sidebar muestra solo 2 elementos

### 3. Test: Eliminar NO muta original

**Pasos**:

1. Click en elemento del canvas → seleccionarlo
2. Click en botón 🗑️ Eliminar (o presionar Delete)

**Verificar en consola**:

```javascript
console.log("Original:", planoView.elements.length); // Sin cambios
console.log("Canvas:", planoView.canvasElements.length); // -1
```

### 4. Test: Drag desde sidebar crea nueva instancia

**Pasos**:

1. Arrastrar "Mesa Redonda" desde sidebar al canvas
2. Arrastrar otra vez el mismo elemento

**Verificar**:

```javascript
console.log(planoView.canvasElements.map((e) => e.id));
// ['elemento-1234-abc', 'elemento-5678-def', ...]
// Cada uno tiene ID único
```

### 5. Test: Atajos de teclado

**Con elemento seleccionado**:

- Presionar `R` → rotación +45°
- Presionar `+` → tamaño ×1.2
- Presionar `-` → tamaño ×0.8
- Presionar `Delete` → eliminar

**Verificar**:

```javascript
const seleccionado = planoView.elementoSeleccionado;
console.log("Rotación:", seleccionado?.rotacion); // 45, 90, 135...
console.log("Tamaño:", seleccionado?.tamano);
```

## Casos de Uso

### Caso 1: Visualización simple (nuevo-evento)

```html
<!-- Sin sidebar, sin toolbar -->
<app-plano-view [elements]="planoElements"></app-plano-view>
```

✅ Muestra canvas con elementos
✅ No hay sidebar
✅ No hay toolbar
✅ Solo visualización

### Caso 2: Con información de plantilla

```html
<app-plano-view [elements]="planoElements" [plantillaNombre]="'Boda Clásica - Salón Principal'"> </app-plano-view>
```

✅ Toolbar visible
✅ Muestra "Boda Clásica" (sin " - Salón Principal")
✅ Muestra "800 x 600 px"
✅ Controles visibles al seleccionar elemento

### Caso 3: Editor completo

```html
<app-plano-view [elements]="planoElements" [showSidebar]="true" [plantillaNombre]="plantillaSeleccionada?.nombre"> </app-plano-view>
```

✅ Sidebar con elementos únicos
✅ Toolbar completa
✅ Botón toggle sidebar
✅ Drag & drop funcional
✅ Atajos de teclado activos

## Checklist de Funcionalidades

- [ ] Sidebar muestra elementos únicos (sin duplicados)
- [ ] Arrastrar desde sidebar crea nueva instancia
- [ ] Eliminar NO modifica `elements` original
- [ ] Rotar elemento con botón funciona
- [ ] Rotar con tecla `R` funciona
- [ ] Aumentar tamaño con `+` funciona
- [ ] Reducir tamaño con `-` funciona
- [ ] Eliminar con `Delete` funciona
- [ ] Toggle sidebar abre/cierra panel
- [ ] Toolbar muestra nombre de plantilla sin sufijo
- [ ] Toolbar muestra dimensiones correctas
- [ ] Seleccionar elemento muestra controles
- [ ] Deseleccionar muestra mensaje de ayuda

## Errores Comunes

### ❌ "El sidebar sigue mostrando duplicados"

**Solución**: Verificar que `generarElementosUnicos()` se ejecuta en `ngOnChanges`

### ❌ "Eliminar modifica el array original"

**Solución**: Verificar que `eliminarElemento()` opera sobre `canvasElements`, no `elements`

### ❌ "Atajos de teclado no funcionan"

**Solución**: Verificar que `@HostListener('window:keydown')` está presente y que hay un elemento seleccionado

### ❌ "No puedo arrastrar desde sidebar"

**Solución**: Verificar que `cdkDropListConnectedTo` conecta sidebar con canvas y que `onDrop()` maneja el evento

## Performance

### Esperado

- Generación de elementos únicos: < 10ms para 100 elementos
- Drag & drop: suave sin lag
- Selección de elementos: inmediata

### Si hay problemas

```typescript
// Verificar que trackBy funciona
trackByElementId(index: number, elemento: ElementItem): string {
  return elemento.id || `elemento-${index}`;
}
```

## Compatibilidad Verificada

- ✅ Angular 19.0+
- ✅ Material 18+
- ✅ CDK Drag & Drop 18+
- ✅ Chrome, Firefox, Edge, Safari

---

**Nota**: Este componente es de solo visualización/edición local. Para persistir cambios, el componente padre debe implementar lógica de guardado.
