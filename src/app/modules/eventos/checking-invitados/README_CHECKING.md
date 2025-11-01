# CheckingInvitadosComponent - Módulo de Checking de Invitados

## 📋 Descripción

Componente Angular 19 para realizar el registro de asistencia (checking) de invitados en eventos. Permite seleccionar un evento, visualizar todos los invitados confirmados y marcar su asistencia en tiempo real.

## 📁 Estructura de Archivos

```
src/app/modules/eventos/checking-invitados/
├── checking-invitados.component.ts       (Componente principal - 305 líneas)
├── checking-invitados.component.html     (Template - 280 líneas)
├── checking-invitados.component.scss     (Estilos - 480 líneas)
├── checking-invitados.service.ts         (Servicio mock - 330 líneas)
└── models/
    └── invitado.model.ts                 (Interfaces - 35 líneas)
```

## 🎯 Características Implementadas

### ✅ Selector de Evento

- `mat-select` con lista de eventos disponibles
- Muestra: Nombre del evento, Folio, Fecha
- Botón "Actualizar" para recargar datos
- Estado vacío cuando no hay evento seleccionado

### ✅ Tarjetas de Estadísticas

Cuatro tarjetas con información en tiempo real:

1. **Total Invitados**: Cantidad total de invitados del evento
2. **Registrados**: Invitados que ya hicieron check-in + porcentaje
3. **Pendientes**: Invitados que aún no llegan
4. **Total Personas**: Suma de invitados + acompañantes registrados

### ✅ Tabla de Invitados

**Columnas:**

- `Código Reservación`: Badge con código único (ej: NV001-001)
- `Nombre Completo`: Nombre del invitado
- `Teléfono`: Teléfono principal y secundario (si existe)
- `Acompañantes`: Número de personas adicionales
- `Estado`: Chip de estado (Registrado/Pendiente) + hora de registro
- `Acciones`: Botón "Registrar" o botón "Deshacer" si ya está registrado

**Características:**

- Búsqueda en tiempo real por nombre, código o teléfono
- Paginación (10, 25, 50, 100 registros)
- Ordenamiento por columnas
- Filas resaltadas para invitados registrados
- Spinner de carga durante peticiones

### ✅ Funcionalidades

1. **Check-In de Invitado**

   - Click en botón "Registrar"
   - Actualiza estado a "Registrado"
   - Guarda hora exacta del check-in
   - Actualiza estadísticas automáticamente
   - Muestra notificación de éxito

2. **Deshacer Check-In**

   - Útil para correcciones de errores
   - Requiere confirmación
   - Restaura estado a "Pendiente"
   - Actualiza estadísticas

3. **Búsqueda Inteligente**

   - Filtra por: nombre, código de reservación, teléfono
   - Búsqueda en tiempo real mientras se escribe
   - Botón para limpiar filtro

4. **Actualización de Datos**
   - Botón "Actualizar" recarga todos los datos
   - Útil para sincronizar con otros dispositivos

## 🧩 Modelos de Datos

### Interface `Invitado`

```typescript
interface Invitado {
  id: number;
  fullName: string;
  contactPhone: string;
  secondaryPhone?: string;
  email?: string;
  companions: number;
  willAttend: boolean;
  checkedIn: boolean;
  reservationCode: string;
  checkInTime?: string;
}
```

### Interface `Evento`

```typescript
interface Evento {
  id: number;
  name: string;
  date: string;
  folio: string;
  totalGuests: number;
}
```

### Interface `CheckingStats`

```typescript
interface CheckingStats {
  totalGuests: number;
  checkedIn: number;
  pending: number;
  totalPeople: number;
}
```

## 🧰 Servicio (CheckingInvitadosService)

### Datos Mock

- **4 eventos** con diferentes tipos de celebraciones
- **Evento 1 (Boda)**: 8 invitados, 2 ya registrados
- **Evento 2 (XV Años)**: 3 invitados, ninguno registrado
- **Evento 3 (Bautizo)**: 2 invitados, ninguno registrado

### Métodos Disponibles

```typescript
// Obtiene lista de eventos
getEventos(): Observable<Evento[]>

// Obtiene invitados de un evento específico
getInvitadosByEvento(eventId: number): Observable<Invitado[]>

// Registra check-in de un invitado
checkInInvitado(eventId: number, invitadoId: number): Observable<boolean>

// Deshace check-in (para correcciones)
undoCheckIn(eventId: number, invitadoId: number): Observable<boolean>

// Busca invitados por término
searchInvitado(eventId: number, term: string): Observable<Invitado[]>

// Obtiene estadísticas del evento
getStats(eventId: number): Observable<CheckingStats>

// Busca por código de reservación (útil para QR)
findByReservationCode(eventId: number, code: string): Observable<Invitado | null>
```

### Características del Servicio

- **BehaviorSubject** para cada evento (reactividad)
- **Map** para almacenar invitados por evento
- **Delays simulados** (100-300ms) para simular latencia
- **Actualización reactiva** de todos los suscriptores

## 🎨 Diseño UI/UX

### Paleta de Colores

- **Header**: Gradiente púrpura (#667eea → #764ba2)
- **Total**: Azul (#667eea)
- **Registrados**: Verde (#28a745)
- **Pendientes**: Amarillo (#ffc107)
- **Total Personas**: Azul claro (#17a2b8)

### Componentes Material Utilizados

- `mat-card` - Contenedores y tarjetas
- `mat-select` - Selector de eventos
- `mat-table` - Tabla de invitados
- `mat-paginator` - Paginación
- `mat-sort` - Ordenamiento
- `mat-form-field` - Campos de búsqueda
- `mat-chip` - Chips de estado
- `mat-icon` - Iconos Material
- `mat-spinner` - Indicador de carga
- `mat-snackbar` - Notificaciones

### Estados Visuales

1. **Estado Inicial**: Muestra mensaje "Seleccione un evento"
2. **Estado Cargando**: Spinner mientras carga datos
3. **Estado Con Datos**: Tabla completa con estadísticas
4. **Estado Sin Resultados**: Mensaje cuando la búsqueda no encuentra resultados
5. **Fila Registrada**: Background verde claro para invitados con check-in

### Responsive Design

- **Desktop** (>1200px): Grid 4 columnas para estadísticas
- **Tablet** (768px-1200px): Grid 2 columnas
- **Mobile** (<768px): Layout apilado, estadísticas en 1 columna
- **Small Mobile** (<480px): Ajustes de tipografía y espaciado

## 🔧 Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **Angular Material 19**: Componentes UI
- **RxJS**: Programación reactiva (BehaviorSubject, Observables)
- **TypeScript**: Tipado estricto
- **SCSS**: Estilos con preprocesador
- **FormsModule**: ngModel para búsqueda

## 📊 Flujo de Datos

```
Usuario selecciona evento
  ↓
CheckingInvitadosComponent
  ↓
CheckingInvitadosService
  ↓
BehaviorSubject por evento
  ↓
Observable → MatTableDataSource
  ↓
Template (mat-table)
```

## 🚀 Uso

### Navegación

```
URL: /eventos/checking-invitados
Ruta configurada en: app.routes.ts
```

### Flujo de Trabajo

1. **Seleccionar Evento**

   - Abrir el selector de eventos
   - Elegir el evento deseado
   - Los datos se cargan automáticamente

2. **Buscar Invitado (Opcional)**

   - Escribir en la barra de búsqueda
   - Nombre, código o teléfono
   - Resultados en tiempo real

3. **Registrar Asistencia**

   - Localizar al invitado en la tabla
   - Click en botón "Registrar"
   - Confirmación visual instantánea

4. **Corregir Error (Opcional)**

   - Click en botón "Deshacer" (ícono undo)
   - Confirmar acción
   - Estado restaurado

5. **Actualizar Datos**
   - Click en botón "Actualizar"
   - Recarga datos del servidor

## 📈 Mejoras Futuras

### Funcionalidades

- [ ] **Lector QR**: Integrar @zxing/ngx-scanner para escanear códigos
- [ ] **Filtros Avanzados**: Por estado (registrado/pendiente)
- [ ] **Exportar Lista**: PDF o Excel con estado actual
- [ ] **Modo Offline**: PWA con sincronización posterior
- [ ] **Historial**: Ver todos los check-ins del día
- [ ] **Múltiples Dispositivos**: Sincronización en tiempo real
- [ ] **Búsqueda por Voz**: Para eventos con mucha gente
- [ ] **Foto del Invitado**: Verificación visual
- [ ] **Notas Adicionales**: Comentarios por invitado
- [ ] **Alertas**: Notificación cuando llega un invitado VIP

### Integraciones

- [ ] **API Backend Real**: Reemplazar mock service
- [ ] **WebSocket**: Sincronización en tiempo real entre dispositivos
- [ ] **Notificaciones Push**: Avisar a organizadores
- [ ] **Impresora Térmica**: Imprimir pulseras o etiquetas
- [ ] **Pantalla de Bienvenida**: Display con nombre del invitado

### UX/UI

- [ ] **Vista Tablet Optimizada**: Layout especial para iPads
- [ ] **Modo Kiosko**: Pantalla completa para recepción
- [ ] **Temas Personalizados**: Colores por tipo de evento
- [ ] **Animaciones**: Transiciones al registrar
- [ ] **Sonidos**: Feedback auditivo al check-in
- [ ] **Accesibilidad**: ARIA labels completos

### Reportes

- [ ] **Dashboard en Vivo**: Gráficas de asistencia
- [ ] **Estadísticas Avanzadas**: Por hora, demográficos
- [ ] **Comparativas**: Contra eventos anteriores
- [ ] **Alertas**: Capacidad máxima, retrasos

## 🐛 Notas Técnicas

### Filtro Personalizado

```typescript
this.dataSource.filterPredicate = (data: Invitado, filter: string) => {
  const searchStr = filter.toLowerCase();
  return data.fullName.toLowerCase().includes(searchStr) || data.reservationCode.toLowerCase().includes(searchStr) || data.contactPhone.includes(searchStr);
};
```

### Actualización Reactiva

El servicio usa `BehaviorSubject` para cada evento, lo que permite que múltiples componentes se suscriban y reciban actualizaciones automáticas cuando hay cambios.

### Manejo de Estados

- **isLoading**: Controla el spinner de carga
- **selectedEventId**: Almacena el evento actual
- **searchTerm**: Mantiene el valor de búsqueda
- **stats**: Objeto con estadísticas actualizadas

### Formato de Fecha

```typescript
formatCheckInTime(time?: string): string {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
```

## 📝 Código Limpio

- **Nombres en inglés** para variables y funciones
- **Comentarios en español** para lógica compleja
- **Tipado estricto** en TypeScript
- **Arquitectura modular** con separación de responsabilidades
- **Patrón de inyección** con `inject()`
- **Standalone components** (Angular 19)
- **Control flow syntax** con `@if` y `@for`
- **FormsModule** para two-way binding

## 🎓 Patrones Implementados

1. **Service Pattern**: Separación de lógica de negocio
2. **Observer Pattern**: BehaviorSubject para estado reactivo
3. **Strategy Pattern**: Filtros intercambiables
4. **State Pattern**: Manejo de estados del componente
5. **Repository Pattern**: Abstracción de acceso a datos

## 🔐 Consideraciones de Producción

### Seguridad

- Validar permisos de usuario antes de check-in
- Registrar quién realizó cada check-in
- Prevenir check-ins duplicados
- Logs de auditoría

### Performance

- Paginación desde backend
- Lazy loading de eventos
- Caché de datos frecuentes
- Debounce en búsqueda

### Escalabilidad

- Soporte para eventos con miles de invitados
- Múltiples dispositivos simultáneos
- Backend distribuido
- CDN para assets

---

**Desarrollado con Angular 19 y Angular Material** 🚀
