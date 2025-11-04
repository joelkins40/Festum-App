# Módulo: Lista de Eventos

Este documento describe la implementación completa del módulo "Lista de Eventos" para la aplicación Festum-App.

## 📋 Descripción General

El módulo Lista de Eventos permite visualizar, crear, editar y eliminar eventos (notas de venta) en una tabla interactiva con funcionalidades de búsqueda y paginación.

## 🏗️ Arquitectura

### Estructura de Archivos

```
src/app/modules/eventos/lista/
├── lista.component.ts          # Componente principal
├── lista.component.html        # Template con mat-table
├── lista.component.scss        # Estilos responsive
├── lista-eventos.service.ts    # Servicio con mock data
└── evento-lista-dialog/
    ├── evento-lista-dialog.component.ts    # Diálogo CRUD
    ├── evento-lista-dialog.component.html  # Template del diálogo
    └── evento-lista-dialog.component.scss  # Estilos del diálogo
```

## 📦 Componentes

### 1. ListaComponent (lista.component.ts)

**Responsabilidades:**

- Mostrar tabla de eventos con 8 columnas
- Filtrado en tiempo real por folio, nombre del evento, cliente y lugar
- Gestión de diálogos para crear/editar eventos
- Eliminación de eventos con confirmación
- Formateo de fechas, monedas y datos del lugar

**Propiedades Principales:**

```typescript
dataSource: MatTableDataSource<Evento>
displayedColumns: string[] // 8 columnas
@ViewChild(MatPaginator) paginator
@ViewChild(MatSort) sort
```

**Métodos Principales:**

- `loadEventos()` - Carga eventos desde el servicio
- `applyFilter(event)` - Aplica filtro de búsqueda personalizado
- `openCreateDialog()` - Abre diálogo para crear evento
- `openEditDialog(evento)` - Abre diálogo para editar evento
- `deleteEvento(evento)` - Elimina evento con confirmación
- `getLugarDisplay(lugar)` - Formatea display del lugar según tipo
- `formatCurrency(value)` - Formato de moneda en español (MXN)
- `formatDate(date)` - Formato de fecha en español

**Columnas de la Tabla:**

1. **Folio** - Badge con color distintivo
2. **Nombre del Evento** - Con icono de celebración
3. **Cliente** - Nombre con indicador de cliente especial (⭐)
4. **Lugar** - Muestra dirección o salón según tipo
5. **Fecha de Recepción** - Formato español
6. **Fecha de Regreso** - Formato español
7. **Total** - Formato de moneda MXN
8. **Acciones** - Botones Editar y Eliminar

**Filtro Personalizado:**
Busca en múltiples campos simultáneamente:

- Folio
- Nombre del evento
- Nombre del cliente
- Dirección del lugar

### 2. ListaEventosService (lista-eventos.service.ts)

**Interfaces:**

```typescript
interface Cliente {
  id: number;
  nombre: string;
  clienteEspecial?: boolean;
  direcciones?: Direccion[];
  activo?: boolean;
}

interface Direccion {
  id?: number;
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  lat?: number;
  lng?: number;
}

interface Lugar {
  tipo: "direccionCliente" | "nuevaDireccion" | "salonExistente";
  direccion?: Direccion;
  salonId?: number;
  nombreSalon?: string;
}

interface ProductoNota {
  id: number;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  esServicio?: boolean;
  precioEspecial?: number;
}

interface Evento {
  id?: number;
  folio: string;
  fechaRecepcion: Date;
  fechaRegreso: Date;
  nombreEvento: string;
  cliente: Cliente;
  lugar: Lugar;
  productos: ProductoNota[];
  total: number;
}
```

**Métodos CRUD:**

```typescript
// Obtener todos los eventos
getEventos(): Observable<Evento[]>

// Obtener un evento por ID
getEventoById(id: number): Observable<Evento | undefined>

// Crear un nuevo evento
createEvento(evento: Evento): Observable<EventoResponse>

// Actualizar un evento existente
updateEvento(evento: Evento): Observable<EventoResponse>

// Eliminar un evento
deleteEvento(id: number): Observable<EventoResponse>
```

**Mock Data:**
El servicio incluye 5 eventos de ejemplo:

1. Boda García-Martínez (Cliente especial)
2. XV Años María
3. Bautizo Familia Rodríguez (Cliente especial)
4. Aniversario Empresa TechCorp
5. Graduación Universidad Nacional

### 3. EventoListaDialogComponent

**Responsabilidades:**

- Formulario reactivo para crear/editar eventos
- Validación de campos
- Manejo dinámico de campos según tipo de lugar
- Construcción del objeto Evento desde el formulario

**Modos de Operación:**

- `create` - Crear nuevo evento
- `edit` - Editar evento existente

**Formulario (FormGroup):**

```typescript
eventoForm = {
  // Información básica
  folio: string (required)
  nombreEvento: string (required, min 3 chars)
  fechaRecepcion: Date (required)
  fechaRegreso: Date (required)

  // Cliente
  clienteNombre: string (required)
  clienteEspecial: boolean

  // Lugar (dinámico según tipo)
  lugarTipo: 'direccionCliente' | 'nuevaDireccion' | 'salonExistente'
  lugarNombreSalon: string (si tipo = salonExistente)
  lugarFullAddress: string (si tipo = dirección)
  lugarCity: string
  lugarState: string
  lugarCountry: string
  lugarPostalCode: string

  // Total
  total: number (required, min 0)
}
```

**Métodos Principales:**

- `createForm()` - Crea el FormGroup con validaciones
- `loadEventoData(evento)` - Carga datos en modo edición
- `buildEventoFromForm()` - Construye objeto Evento desde formulario
- `shouldShowDireccionFields()` - Determina si mostrar campos de dirección
- `shouldShowSalonFields()` - Determina si mostrar campos de salón
- `getErrorMessage(fieldName)` - Obtiene mensaje de error para campo
- `save()` - Valida y guarda el evento
- `cancel()` - Cierra el diálogo sin guardar

## 🎨 Diseño y Estilos

### Header Principal

- Gradient background (púrpura: #667eea → #764ba2)
- Icono de evento
- Título y subtítulo
- Botón "Nuevo Evento"

### Tabla

- Barra de búsqueda en la parte superior
- Columnas con iconos descriptivos
- Hover effects en filas
- Folio como badge con color
- Cliente especial indicado con ⭐
- Total destacado en verde
- Botones de acción con hover animations

### Responsive Design

- **Desktop (>1200px)**: Tabla completa visible
- **Tablet (768px-1200px)**: Ajustes de padding
- **Mobile (<768px)**:
  - Header en columna
  - Campos de búsqueda al 100%
  - Tabla con scroll horizontal
  - Botones apilados

### Diálogo

- Ancho mínimo: 600px (responsive en móvil)
- Altura máxima: 70vh con scroll
- Secciones organizadas con dividers
- Campos dinámicos según tipo de lugar
- Footer con botones Cancelar/Guardar

## 🔧 Tecnologías Utilizadas

### Angular 19 (Standalone Components)

- `inject()` para dependency injection
- `@if` y `@for` control flow syntax
- Signals-ready architecture
- ViewChild decorators

### Angular Material

- `MatTable` con sorting y paginación
- `MatDialog` para modales CRUD
- `MatFormField` con appearance="outline"
- `MatDatepicker` para fechas
- `MatRadioButton` para tipo de lugar
- `MatCheckbox` para cliente especial
- `MatSnackBar` para notificaciones
- `MatTooltip` para ayudas contextuales
- `MatIcon` para iconografía

### RxJS

- `BehaviorSubject` para estado reactivo
- `Observable` para operaciones asíncronas
- `delay` operator para simular llamadas API

### TypeScript

- Strict typing con interfaces
- Type guards para validaciones
- Optional chaining

## 📊 Flujo de Datos

```
1. Inicialización del Componente
   ↓
2. loadEventos() → ListaEventosService.getEventos()
   ↓
3. BehaviorSubject emite array de eventos
   ↓
4. MatTableDataSource actualiza tabla
   ↓
5. Usuario aplica filtros → applyFilter()
   ↓
6. Custom filterPredicate busca en múltiples campos
```

### Flujo de Creación/Edición

```
1. Usuario hace clic en "Nuevo Evento" o "Editar"
   ↓
2. openCreateDialog() / openEditDialog() abre diálogo
   ↓
3. EventoListaDialogComponent carga FormGroup
   ↓
4. Usuario completa formulario
   ↓
5. save() valida y construye objeto Evento
   ↓
6. DialogRef.close(evento) retorna datos
   ↓
7. Servicio actualiza BehaviorSubject
   ↓
8. Tabla se refresca automáticamente
   ↓
9. MatSnackBar muestra confirmación
```

### Flujo de Eliminación

```
1. Usuario hace clic en botón eliminar
   ↓
2. MatDialog abre confirmación
   ↓
3. Usuario confirma → deleteEvento(evento)
   ↓
4. Servicio elimina del array
   ↓
5. BehaviorSubject emite nuevo array
   ↓
6. Tabla se actualiza
   ↓
7. MatSnackBar confirma eliminación
```

## 🧪 Testing (Pendiente)

### Tests Recomendados

**lista.component.spec.ts:**

- ✅ Debe cargar eventos al inicializar
- ✅ Debe aplicar filtros correctamente
- ✅ Debe abrir diálogo de creación
- ✅ Debe abrir diálogo de edición con datos
- ✅ Debe eliminar evento con confirmación
- ✅ Debe formatear moneda correctamente
- ✅ Debe formatear fechas correctamente
- ✅ Debe mostrar display del lugar según tipo

**lista-eventos.service.spec.ts:**

- ✅ Debe retornar lista de eventos
- ✅ Debe retornar evento por ID
- ✅ Debe crear nuevo evento
- ✅ Debe actualizar evento existente
- ✅ Debe eliminar evento
- ✅ Debe emitir cambios en BehaviorSubject

**evento-lista-dialog.component.spec.ts:**

- ✅ Debe crear formulario con valores por defecto
- ✅ Debe cargar datos en modo edición
- ✅ Debe validar campos requeridos
- ✅ Debe mostrar campos según tipo de lugar
- ✅ Debe construir objeto Evento correctamente
- ✅ Debe cerrar sin guardar al cancelar

## 🚀 Uso del Módulo

### Navegación

```
http://localhost:4200/eventos/lista
```

### Acciones Disponibles

1. **Ver Lista de Eventos**

   - Tabla con todos los eventos
   - Información completa en 8 columnas
   - Ordenamiento por columnas (click en header)
   - Paginación (5, 10, 20, 50 items por página)

2. **Buscar Eventos**

   - Campo de búsqueda en tiempo real
   - Busca en: folio, nombre evento, cliente, lugar
   - Sin necesidad de botón "Buscar"

3. **Crear Nuevo Evento**

   - Click en botón "Nuevo Evento"
   - Completar formulario obligatorio
   - Seleccionar tipo de lugar
   - Guardar o cancelar

4. **Editar Evento**

   - Click en botón ✏️ (edit) en fila del evento
   - Formulario pre-cargado con datos
   - Modificar campos necesarios
   - Guardar cambios

5. **Eliminar Evento**
   - Click en botón 🗑️ (delete) en fila del evento
   - Confirmar eliminación en diálogo
   - Evento se elimina de la lista

## 🔄 Integración con API Real

Cuando se conecte a una API real, modificar el servicio:

```typescript
// lista-eventos.service.ts

constructor(private http: HttpClient) {
  this.loadEventosFromAPI();
}

private loadEventosFromAPI(): void {
  this.http.get<Evento[]>('/api/eventos')
    .subscribe(eventos => {
      this.eventosSubject.next(eventos);
    });
}

getEventos(): Observable<Evento[]> {
  return this.http.get<Evento[]>('/api/eventos');
}

createEvento(evento: Evento): Observable<EventoResponse> {
  return this.http.post<EventoResponse>('/api/eventos', evento);
}

updateEvento(evento: Evento): Observable<EventoResponse> {
  return this.http.put<EventoResponse>(`/api/eventos/${evento.id}`, evento);
}

deleteEvento(id: number): Observable<EventoResponse> {
  return this.http.delete<EventoResponse>(`/api/eventos/${id}`);
}
```

## 📝 Notas Adicionales

### Mejoras Futuras

1. **Exportación de Datos**

   - Exportar a Excel
   - Exportar a PDF
   - Imprimir lista

2. **Filtros Avanzados**

   - Rango de fechas
   - Filtro por cliente especial
   - Filtro por rango de total

3. **Vista Detallada**

   - Página de detalle del evento
   - Ver productos/servicios incluidos
   - Historial de cambios

4. **Drag & Drop**

   - Reordenar productos
   - Asignar eventos a salones

5. **Dashboard Analytics**
   - Total de ventas
   - Eventos por mes
   - Clientes más frecuentes

### Convenciones de Código

- ✅ Componentes standalone
- ✅ Uso de `inject()` en lugar de constructor DI
- ✅ Control flow syntax (@if, @for)
- ✅ Nombres en inglés, comentarios en español
- ✅ Interfaces exportadas desde el servicio
- ✅ FormGroups tipados
- ✅ Responsive design mobile-first

### Dependencias del Proyecto

Todas las dependencias de Angular Material ya están instaladas en el proyecto.

## 👥 Contacto

Para preguntas o soporte sobre este módulo:

- Desarrollador: GitHub Copilot
- Proyecto: Festum-App
- Fecha: Enero 2025

---

**¡Módulo Lista de Eventos completado y listo para usar! 🎉**
