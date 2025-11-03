# Componente de Observaciones del Evento

## 📍 Ubicación

`src/app/modules/eventos/observaciones/`

## 📝 Descripción

Componente standalone de Angular 19 que muestra un **timeline vertical** con observaciones, notas y comentarios relacionados con un evento. Incluye funcionalidad CRUD completa con datos mock.

## ✨ Características

### Timeline Vertical

- Diseño tipo feed de actividad
- Línea vertical conectando todas las observaciones
- Puntos de estado con iconos (pendiente, en progreso, resuelto, información)
- Alternancia sutil de fondo para mejor legibilidad
- Hover effects y transiciones suaves

### Observaciones

Cada observación muestra:

- **Autor**: Nombre del usuario que creó la observación
- **Fecha y hora**: Con formato relativo ("Hace 2 horas", "Hace 3 días")
- **Texto**: Contenido completo de la observación
- **Estado**: Chip con color según estado (Pendiente, En Progreso, Resuelto, Información)
- **Etiquetas**: Tags opcionales para categorización (Catering, Decoración, etc.)
- **Acciones**: Botones para editar y eliminar

### Diálogo de Creación/Edición

- Formulario con validaciones completas
- Campos:
  - **Autor** (requerido, mínimo 3 caracteres)
  - **Estado** (requerido, selector con iconos)
  - **Observación** (requerida, 10-1000 caracteres)
  - **Etiquetas** (opcional, máximo 10 tags)
- Contador de caracteres en tiempo real
- Input de chips para agregar etiquetas (presionando Enter o coma)

### FAB (Floating Action Button)

- Botón flotante (+) en esquina inferior derecha
- Efecto de rotación al hover
- Abre diálogo para crear nueva observación

## 🎨 Diseño

### Colores

- **Primary**: Turquesa (#20b2aa) - Observaciones resueltas
- **Accent**: Color acento - Observaciones en progreso
- **Warn**: Color advertencia - Observaciones pendientes
- **Gray**: Información general

### Estados de Observación

| Estado      | Color   | Icono        | Descripción        |
| ----------- | ------- | ------------ | ------------------ |
| Pendiente   | warn    | schedule     | Requiere atención  |
| En Progreso | accent  | autorenew    | Se está trabajando |
| Resuelto    | primary | check_circle | Completado         |
| Información | gray    | info         | Solo informativo   |

### Responsive

- **Desktop**: Timeline con separación estándar
- **Tablet** (≤768px): Timeline más compacta, acciones reorganizadas
- **Móvil** (≤480px): Layout vertical, avatares más pequeños

## 🔧 Uso

### Importar en Rutas

```typescript
{
  path: 'eventos/observaciones',
  loadComponent: () => import('./modules/eventos/observaciones/observaciones.component')
    .then(m => m.ObservacionesComponent)
}
```

### Datos Mock

El componente incluye 6 observaciones de ejemplo con diferentes estados, autores y etiquetas.

### Métodos Principales

- `openDialog(observation?)`: Abre diálogo para crear o editar
- `addObservation(observation)`: Agrega nueva observación
- `updateObservation(observation)`: Actualiza observación existente
- `deleteObservation(id)`: Elimina observación
- `formatDateTime(date)`: Formato relativo de fecha/hora
- `getStatusColor(status)`: Obtiene color según estado
- `getStatusIcon(status)`: Obtiene ícono según estado

## 📦 Dependencias

- `@angular/common`: CommonModule
- `@angular/material/card`: MatCardModule
- `@angular/material/icon`: MatIconModule
- `@angular/material/button`: MatButtonModule
- `@angular/material/chips`: MatChipsModule
- `@angular/material/divider`: MatDividerModule
- `@angular/material/tooltip`: MatTooltipModule
- `@angular/material/dialog`: MatDialogModule
- `@angular/forms`: ReactiveFormsModule
- `@angular/cdk/keycodes`: COMMA, ENTER

## 🎯 Características Técnicas

### Angular 19

- ✅ Standalone component
- ✅ Nueva sintaxis de control flow (@for, @if)
- ✅ Signals para estado reactivo
- ✅ `inject()` para dependency injection
- ✅ Reactive Forms con validaciones

### Buenas Prácticas

- ✅ Nombres en inglés (funciones, variables)
- ✅ Comentarios en español solo para lógica compleja
- ✅ TypeScript estricto (sin `any`)
- ✅ Código limpio y mantenible
- ✅ TrackBy functions para optimización
- ✅ Validaciones robustas en formularios

## 🚀 Próximos Pasos (Backend)

Cuando se conecte con backend, modificar:

1. Servicio de observaciones con HTTP client
2. Métodos CRUD consumiendo API REST
3. Manejo de errores con mensajes toast
4. Actualización en tiempo real con WebSockets (opcional)
5. Paginación si hay muchas observaciones
6. Filtros por fecha, autor, estado

## 📸 Estructura Visual

```
┌─────────────────────────────────────┐
│  🗨️ Observaciones del Evento        │
│  Registro cronológico...            │
├─────────────────────────────────────┤
│                                     │
│  ●───┐  [Ana García]                │
│  │   │  Hace 2 días                 │
│  │   └─ El cliente solicita...      │
│  │      ✓ Resuelto [Decoración]     │
│  │                                  │
│  ●───┐  [Carlos Mendoza]            │
│  │   │  Hace 1 día                  │
│  │   └─ Recordatorio...             │
│  │      ⏰ Pendiente [Catering]      │
│  │                                  │
│  ●      [Laura Martínez]            │
│         Hace 12 horas               │
│       └─ Se confirmó...             │
│          ✓ Resuelto [Música]        │
│                                     │
└─────────────────────────────────────┘
                                  [+]
```

## 🎨 Animaciones

- Fade in up en timeline items
- Scale en timeline dots al hover
- Rotación del FAB al hover
- Transiciones suaves en cards
