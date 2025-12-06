# 🎨 FESTUM APP - Sistema de Diseño

> **Referencia visual:** `src/app/modules/catalogos/categorias`
> **Metodología:** BEM (Block Element Modifier)
> **Framework:** Angular 19 + Angular Material + SCSS

---

## 📋 Tabla de Contenidos

1. [Variables CSS](#variables-css)
2. [Clases Reutilizables](#clases-reutilizables)
3. [Componentes](#componentes)
4. [Responsive Design](#responsive-design)
5. [Angular Material Customizations](#angular-material-customizations)
6. [Guía de Uso](#guía-de-uso)

---

## 🎨 Variables CSS

Todas las variables están definidas en `:root` y siguen una convención clara:

### Colores Primarios
```scss
--color-primary: #20b2aa;           // Turquesa (color principal)
--color-primary-hover: #1a9b94;     // Hover state
--color-primary-alpha-10: rgba(32, 178, 170, 0.1);
--color-primary-alpha-15: rgba(32, 178, 170, 0.15);
--color-primary-alpha-20: rgba(32, 178, 170, 0.2);
--color-primary-alpha-30: rgba(32, 178, 170, 0.3);
```

### Colores Semánticos
```scss
--color-success: #28a745;
--color-error: #f44336;
--color-warning: #ffc107;
--color-info: #2196f3;
--color-secondary: #636e72;
```

### Textos y Backgrounds
```scss
--text-primary: #2d3436;
--text-secondary: #636e72;
--text-muted: #9ca3af;
--bg-page: #f8f9fa;
--bg-surface: #ffffff;
--bg-hover: #f1f3f4;
```

### Espaciado
```scss
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
```

### Border Radius
```scss
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-pill: 16px;
--radius-circle: 50%;
```

### Shadows
```scss
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.16);
--shadow-button: 0 2px 8px rgba(32, 178, 170, 0.3);
```

---

## 🧩 Clases Reutilizables

### 1. Layout de Página

#### Contenedor Principal
```html
<div class="page-container">
  <!-- Contenido -->
</div>
```

#### Header de Página
```html
<div class="page-header">
  <div class="page-header__content">
    <div class="page-title">
      <mat-icon class="page-title__icon">category</mat-icon>
      <h1 class="page-title__text">Título</h1>
    </div>
    <p class="page-description">Descripción</p>
  </div>

  <div class="page-header__actions">
    <button mat-raised-button class="btn-primary">
      Acción
    </button>
  </div>
</div>
```

### 2. Botones

#### Botón Primario
```html
<button mat-raised-button class="btn-primary btn-with-icon">
  <mat-icon>add_circle</mat-icon>
  Nueva Categoría
</button>
```

#### Botón Secundario
```html
<button mat-raised-button class="btn-secondary btn-with-icon">
  <mat-icon>download</mat-icon>
  Exportar
</button>
```

#### Botones de Acción (Iconos)
```html
<!-- Editar -->
<button mat-icon-button class="btn-icon-edit">
  <mat-icon>edit</mat-icon>
</button>

<!-- Eliminar -->
<button mat-icon-button class="btn-icon-delete">
  <mat-icon>delete</mat-icon>
</button>
```

### 3. Cards

```html
<mat-card class="card">
  <!-- Contenido -->
</mat-card>

<!-- Con elevación adicional -->
<div class="card card--elevated">
  <!-- Contenido -->
</div>

<!-- Con borde -->
<div class="card card--bordered">
  <!-- Contenido -->
</div>
```

### 4. Tablas

#### Toolbar de Tabla
```html
<div class="table-toolbar">
  <div class="table-toolbar__search">
    <mat-form-field appearance="outline" class="w-100">
      <mat-label>Buscar</mat-label>
      <input matInput placeholder="Buscar...">
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>
  </div>

  <div class="table-toolbar__actions">
    <button mat-raised-button class="btn-primary">
      Acción
    </button>
  </div>
</div>
```

#### Tabla con Angular Material
```html
<div class="table-container">
  <table mat-table [dataSource]="dataSource" class="data-table">

    <!-- Columna ID -->
    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef class="table-cell--id">ID</th>
      <td mat-cell *matCellDef="let item" class="table-cell--id">
        <span class="badge-id">{{ item.id }}</span>
      </td>
    </ng-container>

    <!-- Columna con icono y texto -->
    <ng-container matColumnDef="nombre">
      <th mat-header-cell *matHeaderCellDef>Nombre</th>
      <td mat-cell *matCellDef="let item">
        <div class="icon-text">
          <mat-icon class="icon-text__icon icon-text__icon--primary">
            person
          </mat-icon>
          <span class="icon-text__text">{{ item.nombre }}</span>
        </div>
      </td>
    </ng-container>

    <!-- Columna de estado -->
    <ng-container matColumnDef="activo">
      <th mat-header-cell *matHeaderCellDef class="table-cell--status">Estado</th>
      <td mat-cell *matCellDef="let item" class="table-cell--status">
        <span class="chip-status"
              [ngClass]="item.activo ? 'chip-status--active' : 'chip-status--inactive'">
          <mat-icon>{{ item.activo ? 'check_circle' : 'cancel' }}</mat-icon>
          {{ item.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </td>
    </ng-container>

    <!-- Columna de acciones -->
    <ng-container matColumnDef="acciones">
      <th mat-header-cell *matHeaderCellDef class="table-cell--actions">Acciones</th>
      <td mat-cell *matCellDef="let item" class="table-cell--actions">
        <button mat-icon-button class="btn-icon-edit">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button class="btn-icon-delete">
          <mat-icon>delete</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="columns"></tr>
    <tr mat-row *matRowDef="let row; columns: columns"></tr>

    <!-- Sin datos -->
    <tr class="mat-row" *matNoDataRow>
      <td class="mat-cell" [attr.colspan]="columns.length">
        <div class="empty-state">
          <mat-icon class="empty-state__icon">inbox</mat-icon>
          <span class="empty-state__title">No hay datos</span>
          <p class="empty-state__subtitle">Intenta crear un nuevo registro</p>
        </div>
      </td>
    </tr>
  </table>
</div>
```

### 5. Chips y Badges

#### Badge de ID
```html
<span class="badge-id">{{ id }}</span>
```

#### Chips de Estado
```html
<!-- Activo -->
<span class="chip-status chip-status--active">
  <mat-icon>check_circle</mat-icon>
  Activo
</span>

<!-- Inactivo -->
<span class="chip-status chip-status--inactive">
  <mat-icon>cancel</mat-icon>
  Inactivo
</span>

<!-- Success -->
<span class="chip-status chip-status--success">
  Completado
</span>

<!-- Warning -->
<span class="chip-status chip-status--warning">
  Pendiente
</span>
```

### 6. Loading States

#### Loading Overlay (Fixed)
```html
<div class="loading-overlay" *ngIf="loading">
  <div class="loading-overlay__content">
    <mat-progress-spinner diameter="60" mode="indeterminate" color="primary">
    </mat-progress-spinner>
    <p class="loading-overlay__text">Cargando...</p>
  </div>
</div>
```

#### Loading Overlay (Absolute)
```html
<div class="loading-overlay loading-overlay--absolute" *ngIf="loading">
  <mat-progress-spinner diameter="60" mode="indeterminate" color="primary">
  </mat-progress-spinner>
  <p class="loading-overlay__text">Cargando datos...</p>
</div>
```

### 7. Empty States

```html
<div class="empty-state">
  <mat-icon class="empty-state__icon">inbox</mat-icon>
  <span class="empty-state__title">No hay resultados</span>
  <p class="empty-state__subtitle">Intenta ajustar tus filtros</p>
</div>
```

### 8. Formularios

#### Sección de Formulario
```html
<div class="form-section">
  <div class="form-section__header">
    <mat-icon class="form-section__icon">info</mat-icon>
    <h3 class="form-section__title">Información Básica</h3>
  </div>

  <div class="form-row">
    <mat-form-field class="w-100">
      <mat-label>Nombre</mat-label>
      <input matInput>
    </mat-form-field>
  </div>
</div>
```

#### Acciones de Formulario
```html
<div class="form-actions">
  <button mat-stroked-button class="btn-outlined">
    Cancelar
  </button>
  <button mat-raised-button class="btn-primary">
    Guardar
  </button>
</div>
```

### 9. Iconos con Texto

```html
<!-- Horizontal -->
<div class="icon-text">
  <mat-icon class="icon-text__icon icon-text__icon--primary icon-text__icon--md">
    category
  </mat-icon>
  <span class="icon-text__text">Categoría</span>
</div>

<!-- Con icono secundario y pequeño -->
<div class="icon-text">
  <mat-icon class="icon-text__icon icon-text__icon--secondary icon-text__icon--sm">
    schedule
  </mat-icon>
  <span>12/12/2024</span>
</div>
```

---

## 📱 Responsive Design

El sistema usa un enfoque **mobile-first** con breakpoints:

- **Mobile**: < 480px
- **Tablet**: < 768px
- **Desktop**: ≥ 768px

### Clases Responsivas Automáticas

Los siguientes componentes ya tienen comportamiento responsivo:

- `.page-header` - Se apila verticalmente en mobile
- `.table-toolbar` - Los controles se apilan en mobile
- `.form-actions` - Botones ocupan todo el ancho
- `.data-table` - Columnas menos importantes se ocultan

### Ocultar Columnas en Mobile

```html
<ng-container matColumnDef="fecha">
  <th mat-header-cell *matHeaderCellDef class="table-cell--date">Fecha</th>
  <td mat-cell *matCellDef="let item" class="table-cell--date">
    {{ item.fecha }}
  </td>
</ng-container>
```

Automáticamente se oculta en mobile con `.table-cell--date`.

---

## 🎨 Angular Material Customizations

### Snackbars con Color

```typescript
this.snackBar.open('Éxito', 'Cerrar', {
  duration: 3000,
  panelClass: ['snackbar-success']  // o 'snackbar-error', 'snackbar-warning', 'snackbar-info'
});
```

### Form Fields Focused

Los campos se resaltan automáticamente con `--color-primary` cuando están focused.

---

## 📚 Guía de Uso

### ✅ Hacer

1. **Usar variables CSS** en lugar de valores hardcodeados
2. **Usar clases BEM** del sistema de diseño
3. **Mantener estilos específicos** en los archivos `.component.scss`
4. **Usar Flexbox/Grid** para layouts
5. **Priorizar mobile-first**
6. **Reducir especificidad** de selectores

### ❌ No Hacer

1. **NO** usar colores hex directamente
2. **NO** usar `px` directamente (usar variables de spacing)
3. **NO** usar `float` para layouts
4. **NO** usar `!important` (excepto en overrides de Material)
5. **NO** crear nuevos estilos si existe una clase reutilizable
6. **NO** usar inline styles en HTML

---

## 🔄 Migración de Componentes Existentes

### Paso 1: Identificar Patrones

Busca en tu componente:
- Colores hardcodeados → Reemplazar por variables
- Layouts repetidos → Usar clases BEM
- Botones custom → Usar `.btn-primary`, `.btn-secondary`, etc.

### Paso 2: Actualizar HTML

**Antes:**
```html
<div class="categorias-container">
  <div class="page-header">
    <div class="header-content">
```

**Después:**
```html
<div class="page-container">
  <div class="page-header">
    <div class="page-header__content">
```

### Paso 3: Simplificar SCSS

**Antes:**
```scss
.create-button {
  background-color: #20b2aa;
  color: white;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 8px;
}
```

**Después:**
```html
<button class="btn-primary">Crear</button>
```

### Paso 4: Eliminar Duplicados

Si un estilo ya existe en `styles.scss`, elimínalo del componente.

---

## 🎯 Ejemplo Completo

Ver `src/app/modules/catalogos/categorias` como referencia completa de implementación.

---

## 📞 Soporte

Para dudas o mejoras del sistema de diseño, consulta este documento o revisa el componente de referencia en `categorias`.
