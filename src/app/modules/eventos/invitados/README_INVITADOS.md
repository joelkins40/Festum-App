# InvitadosComponent - Módulo de Gestión de Invitados

## 📋 Descripción

Componente Angular 19 para la gestión completa de invitados de eventos. Incluye tabla interactiva, formulario CRUD, filtros de búsqueda y estadísticas en tiempo real.

## 📁 Estructura de Archivos

```
src/app/modules/eventos/invitados/
├── invitados.component.ts          (Componente principal - 240 líneas)
├── invitados.component.html        (Template - 230 líneas)
├── invitados.component.scss        (Estilos - 350 líneas)
├── invitado-dialog.component.ts    (Diálogo CRUD - 200 líneas)
├── invitado-dialog.component.html  (Template diálogo - 150 líneas)
├── invitado-dialog.component.scss  (Estilos diálogo - 180 líneas)
└── invitados-mock.service.ts       (Servicio mock - 240 líneas)
```

## 🎯 Características Implementadas

### ✅ Componente Principal (`InvitadosComponent`)

**Funcionalidades:**

- Tabla Material con 8 columnas:
  - `ID` - Badge con identificador único
  - `Nombre Completo` - Con ícono de persona
  - `Teléfono Principal` - Campo requerido
  - `Teléfono Secundario` - Campo opcional
  - `Email` - Campo opcional con validación
  - `Acompañantes` - Número de personas adicionales
  - `Confirmado` - Chip de estado (Confirmado/Pendiente)
  - `Acciones` - Botones Editar/Eliminar

**Características:**

- Búsqueda en tiempo real (filtra por nombre, teléfono, email, ID)
- Paginación (5, 10, 20, 50 registros)
- Ordenamiento por columnas
- Estadísticas en tarjetas:
  - Total de invitados
  - Invitados confirmados
  - Invitados pendientes
  - Total de personas (invitados + acompañantes)

### ✅ Servicio Mock (`InvitadosMockService`)

**Interface `Invitado`:**

```typescript
interface Invitado {
  id: number;
  fullName: string; // Requerido
  contactPhone: string; // Requerido
  secondaryContactPhone?: string; // Opcional
  email?: string; // Opcional
  numberOfCompanions: number; // Default: 0
  willAttend: boolean; // Default: false
}
```

**Operaciones CRUD:**

- `getInvitados()` - Obtiene todos los invitados
- `getInvitadoById(id)` - Obtiene un invitado específico
- `createInvitado(invitado)` - Crea nuevo invitado
- `updateInvitado(invitado)` - Actualiza invitado existente
- `deleteInvitado(id)` - Elimina invitado
- `searchInvitados(query)` - Búsqueda por texto
- `getStats()` - Obtiene estadísticas

**Datos Mock:**

- 8 invitados de ejemplo con datos realistas
- BehaviorSubject para reactividad
- Delays simulando latencia de red (200-300ms)

### ✅ Diálogo CRUD (`InvitadoDialogComponent`)

**Validaciones:**

- `fullName`: Requerido, mínimo 3 caracteres
- `contactPhone`: Al menos un teléfono es requerido
- `email`: Validación de formato email
- `numberOfCompanions`: Valor mínimo 0
- Validador personalizado: `atLeastOnePhoneValidator`

**Modos de Operación:**

- **Create**: Formulario vacío para nuevo invitado
- **Edit**: Formulario pre-llenado con datos existentes

## 🎨 Diseño UI/UX

### Paleta de Colores

- **Primary**: Gradiente púrpura (#667eea → #764ba2)
- **Confirmed**: Verde (#28a745)
- **Pending**: Amarillo (#ffc107)
- **Info**: Azul claro (#17a2b8)
- **Error**: Rojo (#dc3545)

### Componentes Material

- `mat-card` - Contenedores y tarjetas de estadísticas
- `mat-table` - Tabla de invitados
- `mat-paginator` - Paginación
- `mat-sort` - Ordenamiento
- `mat-form-field` - Campos de formulario
- `mat-dialog` - Modal para CRUD
- `mat-chip` - Chips de estado
- `mat-icon` - Iconos Material
- `mat-snackbar` - Notificaciones

### Responsive Design

- **Desktop** (>1200px): Vista completa con todas las columnas
- **Tablet** (768px-1200px): Estadísticas en 2 columnas
- **Mobile** (<768px): Layout apilado, estadísticas en 1 columna
- **Small Mobile** (<480px): Ajustes de tipografía y espaciado

## 🔧 Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **Angular Material 19**: Componentes UI
- **RxJS**: Programación reactiva (BehaviorSubject, Observables)
- **TypeScript**: Tipado estricto
- **SCSS**: Estilos con preprocesador
- **Reactive Forms**: Validaciones y manejo de formularios

## 📊 Flujo de Datos

```
Usuario
  ↓
InvitadosComponent
  ↓
InvitadosMockService (BehaviorSubject)
  ↓
MatTableDataSource
  ↓
Template (mat-table)
```

## 🚀 Uso

### Navegación

```
URL: /eventos/invitados
Ruta configurada en: app.routes.ts
```

### Operaciones Disponibles

1. **Ver Lista de Invitados**

   - Tabla paginada con todos los registros
   - Filtro de búsqueda en tiempo real

2. **Agregar Invitado**

   - Click en botón "Agregar Invitado"
   - Llenar formulario con datos requeridos
   - Guardar cambios

3. **Editar Invitado**

   - Click en botón de editar (ícono de lápiz)
   - Modificar campos necesarios
   - Guardar cambios

4. **Eliminar Invitado**

   - Click en botón de eliminar (ícono de papelera)
   - Confirmar acción
   - Registro eliminado

5. **Buscar Invitados**
   - Escribir en campo de búsqueda
   - Filtrado automático por nombre, teléfono, email o ID

## 📈 Mejoras Futuras

### Funcionalidades

- [ ] Importación masiva desde Excel/CSV
- [ ] Exportar lista a PDF o Excel
- [ ] Envío de invitaciones por email/WhatsApp
- [ ] QR codes para registro de asistencia
- [ ] Filtros avanzados (confirmados, pendientes, etc.)
- [ ] Ordenamiento por múltiples columnas
- [ ] Historial de cambios
- [ ] Notas adicionales por invitado
- [ ] Categorías de invitados (familia, amigos, trabajo)
- [ ] Selección múltiple para operaciones batch

### Integraciones

- [ ] Conexión con API backend real
- [ ] Sincronización con calendario
- [ ] Integración con sistema de pagos
- [ ] Notificaciones push
- [ ] Recordatorios automáticos

### UX

- [ ] Drag & drop para reordenar
- [ ] Vista de cards como alternativa a tabla
- [ ] Modo oscuro
- [ ] Atajos de teclado
- [ ] Animaciones más fluidas
- [ ] Tooltips informativos

## 🐛 Notas Técnicas

### Validaciones Personalizadas

El formulario incluye un validador personalizado `atLeastOnePhoneValidator` que asegura que el usuario ingrese al menos un número de teléfono (principal o secundario).

### Filtro Personalizado

La tabla usa un `filterPredicate` personalizado que permite buscar en múltiples campos simultáneamente:

```typescript
data.fullName.toLowerCase().includes(searchStr) || data.contactPhone.includes(searchStr) || data.secondaryContactPhone?.includes(searchStr) || data.email?.toLowerCase().includes(searchStr) || data.id.toString().includes(searchStr);
```

### Estadísticas Reactivas

Las estadísticas se actualizan automáticamente después de cada operación CRUD gracias al patrón BehaviorSubject del servicio.

## 📝 Código Limpio

- **Nombres en inglés** para variables y funciones
- **Comentarios en español** para lógica compleja
- **Tipado estricto** en TypeScript
- **Arquitectura modular** con separación de responsabilidades
- **Patrón de inyección** con `inject()`
- **Standalone components** (Angular 19)
- **Control flow syntax** con `@if` y `@for`

## 🎓 Patrones Implementados

1. **Service Pattern**: Separación de lógica de negocio
2. **Observer Pattern**: BehaviorSubject para estado reactivo
3. **Form Builder Pattern**: Construcción de formularios reactivos
4. **Dialog Pattern**: Modal reutilizable para CRUD
5. **Filter Predicate Pattern**: Búsqueda personalizada

---

**Desarrollado con Angular 19 y Angular Material** 🚀
