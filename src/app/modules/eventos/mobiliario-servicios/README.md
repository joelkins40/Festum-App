# Componente de Mobiliario y Servicios

## 📍 Ubicación

`src/app/modules/eventos/mobiliario-servicios/`

## 📝 Descripción

Componente standalone de Angular 19 que gestiona el **mobiliario y servicios** asociados a un evento. Permite agregar, editar, eliminar y visualizar elementos con sus cantidades, precios y estados. Incluye cálculo automático de totales con IVA.

## ✨ Características Principales

### Gestión de Elementos

- **Tabla completa** con mat-table mostrando:
  - Tipo (Mobiliario / Servicio) con chips e iconos
  - Nombre del elemento
  - Descripción detallada
  - Cantidad (editable con botones +/-)
  - Precio unitario
  - Subtotal calculado automáticamente
  - Estado (Disponible / Reservado / Entregado)
  - Acciones (Editar / Eliminar)

### Filtros Avanzados

- **Búsqueda por texto**: Filtra por nombre o descripción
- **Filtro por tipo**: Mobiliario o Servicio
- **Filtro por estado**: Disponible, Reservado, Entregado
- **Botón limpiar filtros**: Resetea todos los filtros

### Control de Cantidad

- Botones **+/-** directamente en la tabla
- Validación mínima (no permite cantidad < 1)
- Recalcula subtotal automáticamente
- Feedback visual con snackbar

### Diálogo de Creación/Edición

- Formulario completo con validaciones:
  - **Tipo**: Selector con iconos (Mobiliario/Servicio)
  - **Estado**: Selector con iconos (Disponible/Reservado/Entregado)
  - **Nombre**: 3-100 caracteres, requerido
  - **Descripción**: 10-500 caracteres, requerida
  - **Cantidad**: Mínimo 1, máximo 10,000
  - **Precio unitario**: Mayor a 0
  - **Subtotal**: Calculado y mostrado en tiempo real
- Vista previa del cálculo: "10 × $50.00 = $500.00"

### Resumen de Totales

Card con cálculos financieros:

- **Subtotal**: Suma de todos los elementos
- **IVA (16%)**: Calculado automáticamente
- **Total General**: Subtotal + IVA
- Contador de elementos totales

### Feedback al Usuario

- **MatSnackBar** para confirmar acciones:
  - "Elemento agregado correctamente"
  - "Elemento actualizado correctamente"
  - "Elemento eliminado del evento"
  - Advertencias para cantidades inválidas

## 🎨 Diseño

### Colores por Estado

| Estado     | Color   | Icono          | Uso                      |
| ---------- | ------- | -------------- | ------------------------ |
| Disponible | primary | check_circle   | Elemento disponible      |
| Reservado  | accent  | schedule       | Reservado para el evento |
| Entregado  | default | local_shipping | Ya entregado             |

### Tipos de Elemento

| Tipo       | Icono        | Ejemplo                      |
| ---------- | ------------ | ---------------------------- |
| Mobiliario | chair        | Sillas, mesas, manteles      |
| Servicio   | room_service | Meseros, sonido, iluminación |

### Layout Responsive

- **Desktop** (>1024px): Tabla completa con todos los campos visibles
- **Tablet** (≤1024px): Filtros en 2 columnas, tabla con scroll horizontal
- **Móvil** (≤768px): Filtros apilados, tabla con scroll, controles adaptados

## 🔧 Uso

### Importar en Rutas

```typescript
{
  path: 'eventos/mobiliario-servicios',
  loadComponent: () => import('./modules/eventos/mobiliario-servicios/mobiliario-servicios.component')
    .then(m => m.MobiliarioServiciosComponent)
}
```

### Datos Mock

El componente incluye 6 elementos de ejemplo:

1. Silla Tiffany Blanca (120 unidades)
2. Mesa Redonda 10 personas (12 unidades)
3. Servicio de Meseros (8 personas)
4. Mantel Blanco Premium (15 unidades)
5. Iluminación LED Ambiental (1 sistema)
6. Equipo de Sonido Profesional (1 equipo)

### Interface Principal

```typescript
export interface MobiliarioServicio {
  id: number;
  tipo: "Mobiliario" | "Servicio";
  nombre: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  estado: "Disponible" | "Reservado" | "Entregado";
}
```

### Métodos Principales

- `openDialog(item?)`: Abre diálogo para crear o editar
- `addItem(item)`: Agrega nuevo elemento
- `updateItem(item)`: Actualiza elemento existente
- `deleteItem(id)`: Elimina elemento
- `updateQuantity(item, newQuantity)`: Actualiza cantidad y recalcula
- `clearFilters()`: Limpia todos los filtros
- `formatCurrency(value)`: Formatea números como moneda MXN

### Computed Signals

- `filteredItems()`: Items filtrados según búsqueda y selectores
- `subtotalGeneral()`: Suma de todos los subtotales
- `iva()`: 16% del subtotal general
- `totalGeneral()`: Subtotal + IVA

## 📦 Dependencias

- `@angular/common`: CommonModule
- `@angular/forms`: ReactiveFormsModule
- `@angular/material/table`: MatTableModule
- `@angular/material/icon`: MatIconModule
- `@angular/material/button`: MatButtonModule
- `@angular/material/form-field`: MatFormFieldModule
- `@angular/material/input`: MatInputModule
- `@angular/material/select`: MatSelectModule
- `@angular/material/chips`: MatChipsModule
- `@angular/material/tooltip`: MatTooltipModule
- `@angular/material/card`: MatCardModule
- `@angular/material/dialog`: MatDialogModule
- `@angular/material/snack-bar`: MatSnackBarModule

## 🎯 Características Técnicas

### Angular 19

- ✅ Standalone component
- ✅ Nueva sintaxis de control flow (@for, @if)
- ✅ Signals para estado reactivo
- ✅ Computed signals para cálculos derivados
- ✅ `inject()` para dependency injection
- ✅ Reactive Forms con validaciones completas

### Buenas Prácticas

- ✅ Nombres en inglés (funciones, variables)
- ✅ Comentarios en español solo para lógica compleja
- ✅ TypeScript estricto (sin `any`)
- ✅ TrackBy function para optimización de render
- ✅ Validaciones robustas en formularios
- ✅ Feedback inmediato con snackbars
- ✅ Empty state cuando no hay datos
- ✅ Tooltips informativos en acciones

### Optimizaciones

- **trackByItem**: Optimiza re-renders de la tabla
- **Computed signals**: Cálculos reactivos eficientes
- **FormControl valueChanges**: Actualización automática de subtotales
- **Lazy loading**: Componente cargado bajo demanda

## 🚀 Próximos Pasos (Backend)

Cuando se conecte con backend, modificar:

1. **Servicio HTTP**: CRUD con API REST
2. **Gestión de inventario**: Verificar disponibilidad real
3. **Validación de stock**: Evitar sobreventa de mobiliario
4. **Precios dinámicos**: Según temporada o paquetes
5. **Historial de cambios**: Auditoría de modificaciones
6. **Exportación**: PDF o Excel del listado
7. **Búsqueda avanzada**: Por categorías, proveedores, etc.

## 📸 Estructura Visual

```
┌─────────────────────────────────────────────────────┐
│  📦 Mobiliario y Servicios     [+ Agregar elemento] │
│  Gestión de mobiliario y servicios...              │
├─────────────────────────────────────────────────────┤
│  🔍 Buscar...  | Tipo ▼  | Estado ▼  | [Limpiar]  │
├─────────────────────────────────────────────────────┤
│ Tipo | Nombre | Descripción | Cant | Precio | ... │
├─────────────────────────────────────────────────────┤
│ 🪑   | Silla  | Elegante... | [-]10[+] | $45.00...│
│ 🪑   | Mesa   | Redonda...  | [-]12[+] | $350.00..│
│ 🛎️   | Mesero | Personal... | [-]8[+]  | $800.00..│
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  🧮 Resumen de Totales                              │
│  Subtotal:        $23,800.00                        │
│  IVA (16%):       $3,808.00                         │
│  ─────────────────────────────────                  │
│  Total General:   $27,608.00                        │
│  ℹ️ Total de elementos: 6                           │
└─────────────────────────────────────────────────────┘
```

## 🎨 Características de UX

- **Empty state atractivo**: Cuando no hay elementos
- **Chips con colores**: Visual rápida de tipos y estados
- **Moneda formateada**: $1,234.56 MXN
- **Tooltips informativos**: En botones de acción
- **Validación en tiempo real**: Feedback inmediato
- **Cálculo automático**: Sin necesidad de botón "calcular"
- **Confirmación visual**: Snackbars después de cada acción
- **Responsive completo**: Funciona en todos los dispositivos

## 💡 Ejemplo de Uso

```typescript
// El componente se auto-gestiona con signals
// Los cálculos son reactivos y automáticos

// Agregar elemento
openDialog(); // Abre modal vacío

// Editar elemento
openDialog(item); // Abre modal con datos

// Cambiar cantidad
updateQuantity(item, 15); // Actualiza y recalcula

// Los totales se actualizan automáticamente
console.log(subtotalGeneral()); // Suma de todos
console.log(iva()); // 16% del subtotal
console.log(totalGeneral()); // Subtotal + IVA
```

## ✅ Testing

Incluye tests unitarios completos para:

- Creación del componente
- Cálculos de totales (subtotal, IVA, total)
- CRUD de elementos (agregar, actualizar, eliminar)
- Filtros (búsqueda, tipo, estado)
- Validaciones del formulario
- Formateo de moneda
- Actualización de cantidad con recalculo
