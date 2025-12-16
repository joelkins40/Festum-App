# Plan de Unificación del Módulo de Clientes

## 📋 Objetivo
Unificar el módulo de clientes similar a como se hizo con eventos, creando una vista principal de lista de clientes y vistas detalladas dinámicas con tabs para cada cliente.

## 🎯 Estado Actual

### Estructura actual:
```
src/app/modules/clientes/
├── lista-clientes/           # Lista principal de clientes
├── direcciones/              # Vista independiente de direcciones
├── contactos-frecuentes/     # Vista independiente de contactos
└── historial-eventos/        # Vista independiente de historial
```

### Rutas actuales:
```typescript
/clientes/lista-clientes        // Lista principal
/clientes/direcciones           // Todas las direcciones
/clientes/contactos-frecuentes  // Todos los contactos
/clientes/historial-eventos     // Todos los historiales
```

## 🎨 Estado Objetivo (Inspirado en Eventos)

### Estructura propuesta:
```
src/app/modules/clientes/
├── lista-clientes/           # Lista principal (similar a lista-tabla en eventos)
├── cliente-page/             # 🆕 Página detalle del cliente (similar a evento-page)
│   ├── cliente-page.component.ts
│   ├── cliente-page.component.html
│   ├── cliente-page.component.scss
│   ├── direcciones-section.component.ts      # Tab de direcciones
│   ├── contactos-section.component.ts        # Tab de contactos
│   └── historial-section.component.ts        # Tab de historial
├── direcciones/              # Mantener si se necesita vista global
├── contactos-frecuentes/     # Mantener si se necesita vista global
└── historial-eventos/        # Mantener si se necesita vista global
```

### Rutas propuestas:
```typescript
/clientes                           // Lista principal de clientes
/clientes/:id                       // Vista detalle de un cliente específico
/clientes/:id/direcciones          // Tab de direcciones del cliente
/clientes/:id/contactos            // Tab de contactos del cliente
/clientes/:id/historial            // Tab de historial del cliente

// Opcionales (si se requiere acceso global):
/clientes/todas-direcciones        // Vista global de direcciones
/clientes/todos-contactos          // Vista global de contactos
/clientes/todos-historiales        // Vista global de historiales
```

## 🚀 Pasos de Implementación

### 1. Crear `cliente-page` component (contenedor principal)

**Archivo:** `src/app/modules/clientes/cliente-page/cliente-page.component.ts`

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClientesService } from '../../../core/services/clientes.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cliente-page.component.html',
  styleUrl: './cliente-page.component.scss',
})
export class ClientePageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientesService = inject(ClientesService);

  // Signals
  currentClienteId = signal(this.route.snapshot.paramMap.get('id'));
  currentCliente = signal<Cliente | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.loadCliente();
  }

  private loadCliente(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.hasError.set(true);
      this.isLoading.set(false);
      return;
    }

    this.clientesService.getClienteById(Number(id)).subscribe({
      next: (cliente) => {
        this.currentCliente.set(cliente);
        this.hasError.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar cliente:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/clientes']);
  }

  editCliente(): void {
    // Lógica para editar cliente
  }
}
```

**Archivo:** `src/app/modules/clientes/cliente-page/cliente-page.component.html`

```html
<div class="cliente-detalle-container">

  <!-- Loading State -->
  @if (isLoading()) {
  <div class="loading-state">
    <mat-spinner diameter="60"></mat-spinner>
    <p>Cargando información del cliente...</p>
  </div>
  }

  <!-- Error State -->
  @if (hasError() && !isLoading()) {
  <div class="error-state">
    <mat-icon>error_outline</mat-icon>
    <h2>Error al cargar el cliente</h2>
    <p>No se pudo encontrar el cliente solicitado.</p>
    <button mat-raised-button color="primary" (click)="goBack()">
      <mat-icon>arrow_back</mat-icon>
      Volver a la lista
    </button>
  </div>
  }

  <!-- Content -->
  @if (currentCliente() && !isLoading()) {

  <!-- Header -->
  <div class="page-header">
    <div class="header-left">
      <button mat-icon-button (click)="goBack()" matTooltip="Volver a la lista">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <mat-icon class="page-icon">person</mat-icon>
      <div class="header-text">
        <h1>{{ currentCliente()!.nombre }}</h1>
        <p class="subtitle">Cliente ID: {{ currentCliente()!.id }}</p>
      </div>
    </div>

    <div class="header-actions">
      <button mat-raised-button color="primary" (click)="editCliente()">
        <mat-icon>edit</mat-icon>
        Editar
      </button>
    </div>
  </div>

  <!-- Información Básica -->
  <div class="info-card">
    <div class="info-grid">
      <div class="info-item">
        <label>Email:</label>
        <span>{{ currentCliente()!.email }}</span>
      </div>
      <div class="info-item">
        <label>Teléfono:</label>
        <span>{{ currentCliente()!.telefono }}</span>
      </div>
      <div class="info-item">
        <label>RFC:</label>
        <span>{{ currentCliente()!.rfc || 'N/A' }}</span>
      </div>
      <div class="info-item">
        <label>Estado:</label>
        <mat-chip [class]="currentCliente()!.active ? 'status-active' : 'status-inactive'">
          {{ currentCliente()!.active ? 'Activo' : 'Inactivo' }}
        </mat-chip>
      </div>
    </div>
  </div>

  <!-- Tabs de Información Detallada -->
  <mat-tab-group animationDuration="300ms">

    <!-- Tab: Direcciones -->
    <mat-tab label="Direcciones">
      <ng-template matTabContent>
        <app-direcciones-section [clienteId]="currentCliente()!.id" />
      </ng-template>
    </mat-tab>

    <!-- Tab: Contactos Frecuentes -->
    <mat-tab label="Contactos">
      <ng-template matTabContent>
        <app-contactos-section [clienteId]="currentCliente()!.id" />
      </ng-template>
    </mat-tab>

    <!-- Tab: Historial de Eventos -->
    <mat-tab label="Historial">
      <ng-template matTabContent>
        <app-historial-section [clienteId]="currentCliente()!.id" />
      </ng-template>
    </mat-tab>

  </mat-tab-group>

  }
</div>
```

### 2. Crear componentes de sección (tabs)

#### `direcciones-section.component.ts`
```typescript
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DireccionesService } from '../../../core/services/direcciones.service';

@Component({
  selector: 'app-direcciones-section',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="section-content">
      <div class="section-header">
        <h3>Direcciones del Cliente</h3>
        <button mat-raised-button color="primary" (click)="agregarDireccion()">
          <mat-icon>add</mat-icon>
          Agregar Dirección
        </button>
      </div>

      <!-- Aquí va la tabla de direcciones filtrada por clienteId -->
      <div class="direcciones-list">
        <!-- Reutilizar lógica de direcciones.component pero filtrada -->
      </div>
    </div>
  `,
})
export class DireccionesSectionComponent implements OnInit {
  @Input({ required: true }) clienteId!: number;

  private direccionesService = inject(DireccionesService);

  ngOnInit(): void {
    // Cargar solo las direcciones de este cliente
    this.loadDirecciones();
  }

  private loadDirecciones(): void {
    // Implementar carga de direcciones filtradas por clienteId
  }

  agregarDireccion(): void {
    // Abrir dialog para agregar dirección
  }
}
```

#### `contactos-section.component.ts` (Similar)
```typescript
@Component({
  selector: 'app-contactos-section',
  standalone: true,
  imports: [...],
  template: `...`,
})
export class ContactosSectionComponent implements OnInit {
  @Input({ required: true }) clienteId!: number;
  // ... similar a direcciones-section
}
```

#### `historial-section.component.ts` (Similar)
```typescript
@Component({
  selector: 'app-historial-section',
  standalone: true,
  imports: [...],
  template: `...`,
})
export class HistorialSectionComponent implements OnInit {
  @Input({ required: true }) clienteId!: number;
  // ... similar a direcciones-section
}
```

### 3. Actualizar rutas en `app.routes.ts`

```typescript
// Clientes
{
  path: 'clientes',
  loadComponent: () =>
    import('./modules/clientes/lista-clientes/lista-clientes.component').then(
      (m) => m.ListaComponent,
    ),
},
// Ruta dinámica para detalle de cliente
{
  path: 'clientes/:id',
  loadComponent: () =>
    import('./modules/clientes/cliente-page/cliente-page.component').then(
      (m) => m.ClientePageComponent,
    ),
},

// Opcionales: mantener vistas globales si se requieren
{
  path: 'clientes/todas-direcciones',
  loadComponent: () =>
    import('./modules/clientes/direcciones/direcciones.component').then(
      (m) => m.DireccionesComponent,
    ),
},
{
  path: 'clientes/todos-contactos',
  loadComponent: () =>
    import('./modules/clientes/contactos-frecuentes/contactos-frecuentes.component').then(
      (m) => m.ContactosFrecuentesComponent,
    ),
},
{
  path: 'clientes/todos-historiales',
  loadComponent: () =>
    import('./modules/clientes/historial-eventos/historial-eventos.component').then(
      (m) => m.HistorialEventosComponent,
    ),
},
```

### 4. Actualizar sidebar

```html
<div class="sub-menu" *ngIf="clientesExpanded">
  <!-- Lista principal -->
  <a class="nav-sub-item" routerLink="/clientes" (click)="onMenuClick()">
    <mat-icon class="nav-sub-icon clients">people</mat-icon>
    <span class="nav-sub-label">Lista de clientes</span>
  </a>

  <!-- Opcionales: vistas globales -->
  <div class="nav-sub-group">
    <span class="nav-sub-group-title">
      <mat-icon class="group-icon">folder_open</mat-icon>
      Vistas Globales
    </span>
    <a class="nav-sub-item nested" routerLink="/clientes/todas-direcciones" (click)="onMenuClick()">
      <mat-icon class="nav-sub-icon addresses">place</mat-icon>
      <span class="nav-sub-label">Todas las direcciones</span>
    </a>
    <a class="nav-sub-item nested" routerLink="/clientes/todos-contactos" (click)="onMenuClick()">
      <mat-icon class="nav-sub-icon contacts">contacts</mat-icon>
      <span class="nav-sub-label">Todos los contactos</span>
    </a>
    <a class="nav-sub-item nested" routerLink="/clientes/todos-historiales" (click)="onMenuClick()">
      <mat-icon class="nav-sub-icon history">history</mat-icon>
      <span class="nav-sub-label">Todos los historiales</span>
    </a>
  </div>
</div>
```

### 5. Modificar `lista-clientes.component.html` para navegar a detalle

En la tabla de acciones, cambiar:

```html
<!-- Antes -->
<ui-button-icon
  icon="edit"
  color="primary"
  tooltip="Editar cliente"
  (pressed)="openEditDialog(cliente)"
/>

<!-- Después: agregar botón para ver detalle -->
<ui-button-icon
  icon="visibility"
  color="primary"
  tooltip="Ver detalle"
  [routerLink]="['/clientes', cliente.id]"
/>
<ui-button-icon
  icon="edit"
  color="secondary"
  tooltip="Editar cliente"
  (pressed)="openEditDialog(cliente)"
/>
```

## 📊 Ventajas de esta Unificación

### ✅ Ventajas:
1. **Navegación contextual**: Todo relacionado a un cliente en un solo lugar
2. **Mejor UX**: Similar a como funcionan las apps modernas (ej: CRM)
3. **Consistencia**: Misma experiencia que módulo de eventos
4. **Reducción de clics**: No saltar entre vistas independientes
5. **Datos contextuales**: Toda la info del cliente siempre visible

### ⚠️ Consideraciones:
1. **Vistas globales**: Decidir si mantener o eliminar las vistas de todas las direcciones/contactos/historiales
2. **Rendimiento**: Lazy loading de tabs con `matTabContent`
3. **Permisos**: Considerar roles de usuario para ver/editar diferentes secciones
4. **Mobile**: Asegurar que tabs funcionen bien en móvil

## 🔄 Comparación: Antes vs Después

### Antes (Vistas Independientes):
```
Usuario quiere ver direcciones del cliente "Juan Pérez":
1. /clientes/lista-clientes → buscar cliente
2. Copiar/memorizar ID o nombre
3. /clientes/direcciones → buscar por cliente
4. Para ver historial: /clientes/historial-eventos → buscar de nuevo
Total: 3+ navegaciones
```

### Después (Vista Unificada):
```
Usuario quiere ver direcciones del cliente "Juan Pérez":
1. /clientes → buscar cliente → click en "Ver detalle"
2. /clientes/123 → automáticamente ve todo:
   - Info básica arriba
   - Tabs: Direcciones | Contactos | Historial
Total: 1 navegación + cambio de tab
```

## 📝 Orden de Implementación Recomendado

1. ✅ **Crear `cliente-page` component** (estructura base)
2. ✅ **Crear `direcciones-section` component** (primer tab)
3. ✅ **Probar integración** con un cliente
4. ✅ **Crear `contactos-section` component**
5. ✅ **Crear `historial-section` component**
6. ✅ **Actualizar rutas** en `app.routes.ts`
7. ✅ **Actualizar sidebar** (decidir sobre vistas globales)
8. ✅ **Actualizar `lista-clientes`** (agregar botón ver detalle)
9. ✅ **Probar flujo completo**
10. ✅ **Decidir**: ¿Mantener o eliminar vistas globales independientes?

## 🎨 Diseño Visual Sugerido

```
┌─────────────────────────────────────────────────────────┐
│ ← [Volver] 👤 Juan Pérez (ID: 123)         [Editar]    │
├─────────────────────────────────────────────────────────┤
│ 📧 juan@email.com   📱 5551234567   📄 RFC123          │
│ 🟢 Activo                                               │
├─────────────────────────────────────────────────────────┤
│ [Direcciones] [Contactos] [Historial]                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📍 Direcciones Registradas           [+ Agregar]      │
│  ┌──────────────────────────────────────────────┐      │
│  │ Calle Principal 123, Col. Centro             │      │
│  │ Ciudad, Estado, CP 12345              [📝] [🗑]│      │
│  └──────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────┐      │
│  │ Av. Secundaria 456, Col. Norte               │      │
│  │ Ciudad, Estado, CP 67890              [📝] [🗑]│      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🚨 Decisión Importante

**¿Qué hacer con las vistas globales independientes?**

### Opción A: Eliminarlas
- Pros: Más limpio, consistente
- Contras: Si un usuario quiere ver TODAS las direcciones de TODOS los clientes, no puede

### Opción B: Mantenerlas (Recomendado)
- Pros: Flexibilidad para vistas globales si se necesitan
- Contras: Más rutas que mantener

**Recomendación**: Mantenerlas pero renombrarlas en sidebar como "Vistas Globales" para que quede claro que son diferentes a la vista por cliente.

---

**Siguiente paso**: ¿Quieres que empiece a implementar el `cliente-page` component?
