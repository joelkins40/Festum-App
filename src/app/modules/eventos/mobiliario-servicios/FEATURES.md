# Mobiliario y Servicios - Guía de Características

## 🎯 Funcionalidades Implementadas

### ✅ Tabla Interactiva

- [x] Columnas: Tipo, Nombre, Descripción, Cantidad, Precio Unit., Subtotal, Estado, Acciones
- [x] Chips visuales para Tipo (Mobiliario/Servicio)
- [x] Chips de estado con colores (Disponible/Reservado/Entregado)
- [x] Control de cantidad con botones +/- directos en tabla
- [x] Botones de acción (Editar/Eliminar) con tooltips
- [x] Hover effects en filas
- [x] TrackBy para optimización de renders

### ✅ Sistema de Filtros

- [x] Búsqueda por texto (nombre/descripción)
- [x] Filtro por tipo (Mobiliario/Servicio)
- [x] Filtro por estado (Disponible/Reservado/Entregado)
- [x] Botón para limpiar todos los filtros
- [x] Filtrado reactivo con computed signals
- [x] Iconos en cada campo de filtro

### ✅ CRUD Completo

- [x] Agregar nuevo elemento (botón header + empty state)
- [x] Editar elemento existente
- [x] Eliminar elemento
- [x] Actualizar cantidad con recalculo automático
- [x] Validación de cantidad mínima (>0)
- [x] Feedback con MatSnackBar para cada acción

### ✅ Diálogo de Creación/Edición

- [x] Formulario reactivo con validaciones
- [x] Campos: Tipo, Estado, Nombre, Descripción, Cantidad, Precio
- [x] Selectores con iconos visuales
- [x] Subtotal calculado en tiempo real
- [x] Vista previa del cálculo (cantidad × precio = subtotal)
- [x] Validaciones completas:
  - Nombre: 3-100 caracteres
  - Descripción: 10-500 caracteres
  - Cantidad: 1-10,000
  - Precio: > 0
- [x] Contador de caracteres en inputs
- [x] Header dinámico (Agregar/Editar)

### ✅ Cálculos Financieros

- [x] Subtotal por elemento (cantidad × precio)
- [x] Subtotal general (suma de todos)
- [x] IVA calculado (16%)
- [x] Total general (subtotal + IVA)
- [x] Formato de moneda MXN ($1,234.56)
- [x] Actualización reactiva con computed signals
- [x] Card de resumen con diseño destacado

### ✅ UX/UI

- [x] Empty state cuando no hay elementos
- [x] Empty state cuando filtros no coinciden
- [x] Tooltips informativos en acciones
- [x] Iconos representativos para cada elemento
- [x] Colores coherentes (mat-primary, mat-accent)
- [x] Diseño limpio y minimalista
- [x] Espaciado consistente con módulo /eventos
- [x] Transiciones suaves en hover
- [x] Feedback visual inmediato

### ✅ Responsive Design

- [x] Desktop (>1024px): Layout completo
- [x] Tablet (≤1024px): Filtros reorganizados, tabla adaptada
- [x] Móvil (≤768px): Tabla con scroll horizontal
- [x] Móvil pequeño (≤480px): Layout vertical completo

### ✅ Código y Testing

- [x] TypeScript estricto (sin any)
- [x] Nombres en inglés
- [x] Comentarios en español solo para lógica compleja
- [x] Tests unitarios completos
- [x] Componente standalone Angular 19
- [x] Nueva sintaxis (@for, @if)
- [x] Signals y computed signals
- [x] inject() para DI

## 📊 Datos Mock

```typescript
[
  {
    id: 1,
    tipo: "Mobiliario",
    nombre: "Silla Tiffany Blanca",
    descripcion: "Silla elegante estilo Tiffany en color blanco",
    cantidad: 120,
    precioUnitario: 45.0,
    subtotal: 5400.0,
    estado: "Reservado",
  },
  // ... 5 elementos más
];
```

**Total en datos mock**: $23,800.00 + IVA = $27,608.00

## 🎨 Paleta de Colores

| Elemento | Color    | Uso                                 |
| -------- | -------- | ----------------------------------- |
| Primary  | #20b2aa  | Botones principales, totales        |
| Accent   | Variable | Estados "Reservado"                 |
| Warn     | Variable | Estados "Pendiente", botón eliminar |
| Gray     | #636e72  | Textos secundarios                  |
| Success  | Variable | Estados "Disponible", "Entregado"   |

## 🔧 Configuración de Columnas

```typescript
displayedColumns = [
  "tipo", // Chip con icono
  "nombre", // Texto bold
  "descripcion", // Texto secundario
  "cantidad", // Control +/-
  "precioUnitario", // Formato moneda
  "subtotal", // Formato moneda bold
  "estado", // Chip con color
  "acciones", // Botones editar/eliminar
];
```

## 📱 Breakpoints Responsive

```scss
@media (max-width: 1200px) {
  /* Ajustes de tabla */
}
@media (max-width: 1024px) {
  /* Header vertical, filtros 2 col */
}
@media (max-width: 768px) {
  /* Filtros 1 col, tabla scroll */
}
@media (max-width: 480px) {
  /* Layout móvil completo */
}
```

## 🚀 Performance

- **TrackBy function**: Evita re-renders innecesarios
- **Computed signals**: Cálculos solo cuando cambian dependencias
- **Lazy loading**: Componente cargado bajo demanda
- **Reactive forms**: Validación eficiente
- **Virtual scroll**: (Pendiente si hay muchos items)

## ✨ Diferenciadores

1. **Control de cantidad directo en tabla** (sin abrir modal)
2. **Subtotal calculado en tiempo real** en el diálogo
3. **Vista previa del cálculo** (10 × $50.00 = $500.00)
4. **Empty state dual** (sin datos / sin resultados de filtro)
5. **Card de totales destacada** con diseño especial
6. **Feedback inmediato** con snackbars
7. **Tooltips en todas las acciones**
8. **Chips visuales** para estados y tipos

## 🎓 Casos de Uso

### Usuario agrega elemento nuevo

1. Click en "Agregar elemento" (header o empty state)
2. Completa formulario con validaciones en vivo
3. Ve subtotal calcularse automáticamente
4. Guarda y recibe confirmación con snackbar
5. Ve el elemento en la tabla
6. Ve los totales actualizados

### Usuario filtra elementos

1. Escribe en búsqueda: "Silla"
2. Filtra por tipo: "Mobiliario"
3. Filtra por estado: "Reservado"
4. Ve solo resultados que coinciden
5. Click en "Limpiar" para resetear

### Usuario ajusta cantidad

1. Click en [+] o [-] directamente en tabla
2. Ve subtotal del elemento actualizarse
3. Ve totales generales recalcularse
4. Recibe confirmación con snackbar

### Usuario elimina elemento

1. Click en botón eliminar (icono rojo)
2. Elemento desaparece de tabla
3. Totales se recalculan automáticamente
4. Recibe confirmación con nombre del elemento

## 📝 Notas de Implementación

- **IVA fijo en 16%**: Puede cambiar según país/región
- **Moneda MXN**: Formato español de México
- **Límite de cantidad**: 10,000 unidades máximo
- **Sin paginación**: Útil para menos de 100 elementos
- **Sin backend**: Mock data por ahora, listo para conectar

## 🔮 Mejoras Futuras

- [ ] Paginación para grandes conjuntos de datos
- [ ] Ordenamiento por columnas (sort)
- [ ] Exportar a PDF/Excel
- [ ] Búsqueda avanzada por categorías
- [ ] Historial de cambios (audit log)
- [ ] Descuentos y promociones
- [ ] Integración con inventario real
- [ ] Notificaciones de bajo stock
- [ ] Sugerencias de elementos relacionados
- [ ] Cálculo de impuestos por región
