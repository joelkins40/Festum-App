# 📋 Checklist de Refactorización de Estilos

## todo, eliminar este archivo una vez que terminemos con css y mejorar a docs/DESIGN_SYSTEM.md para meores promts de copilot

## ✅ Estado de Migración de Componentes

### ✨ Completado
- [x] **src/app/modules/catalogos/categorias** - Componente de referencia
- [x] **src/styles.scss** - Sistema de diseño base

---

## 🔄 Pendientes de Migración

### Módulo: Catalogos
- [ ] **tipos-eventos** - Tabla CRUD similar a categorías
- [ ] **salones** - Tabla CRUD similar a categorías
- [ ] **paquetes** - Tabla CRUD similar a categorías
- [ ] **contactos-frecuentes** - Tabla CRUD similar a categorías
- [ ] **tipos-mobiliario** - Tabla CRUD similar a categorías

### Módulo: Eventos
- [ ] **lista-tabla** - Tabla de eventos
- [ ] **informacion-general** - Formulario de evento
- [ ] **plano** - Interfaz de arrastrar y soltar
- [ ] **invitados** - Gestión de invitados
- [ ] **notas** - Sistema de notas

### Módulo: Clientes
- [ ] **lista-clientes** - Tabla de clientes
- [ ] **detalle-cliente** - Vista de detalle

### Módulo: Cotizaciones
- [ ] **lista-cotizaciones** - Tabla de cotizaciones
- [ ] **crear-cotizacion** - Formulario de cotización

### Módulo: Usuarios
- [ ] **lista-usuarios** - Tabla de usuarios
- [ ] **perfil-usuario** - Vista de perfil

### Módulo: Dashboard
- [ ] **dashboard** - Tarjetas y estadísticas

### Módulo: Reportes
- [ ] **reportes** - Vistas de reportes

### Core Components
- [ ] **layout/sidebar** - Menú lateral
- [ ] **layout/topbar** - Barra superior

### Shared Components
- [ ] **confirm-dialog** - Diálogo de confirmación
- [ ] **dynamic-form-dialog** - Formulario dinámico

---

## 📝 Checklist por Componente

Para cada componente, seguir estos pasos:

### 1. Análisis (5 min)
- [ ] Identificar colores hardcodeados (#hex)
- [ ] Identificar espaciados directos (px)
- [ ] Identificar patrones repetidos
- [ ] Identificar clases CSS custom que pueden reemplazarse

### 2. Actualización de HTML (10 min)
- [ ] Reemplazar clases de contenedor:
  - `.xxx-container` → `.page-container`
- [ ] Reemplazar clases de header:
  - `.page-header` → Usar estructura BEM
  - `.header-content` → `.page-header__content`
  - `.header-actions` → `.page-header__actions`
- [ ] Reemplazar clases de tabla:
  - `.table-toolbar` → Usar estructura BEM
  - `.xxx-table` → `.data-table`
- [ ] Reemplazar clases de botones:
  - Botones de crear → `.btn-primary`
  - Botones de cancelar → `.btn-outlined`
  - Botones secundarios → `.btn-secondary`
  - Botones de editar → `.btn-icon-edit`
  - Botones de eliminar → `.btn-icon-delete`
- [ ] Reemplazar clases de chips:
  - `.estado-chip.activo` → `.chip-status.chip-status--active`
  - `.estado-chip.inactivo` → `.chip-status.chip-status--inactive`
- [ ] Reemplazar clases de loading:
  - `.loading-overlay` → Verificar si es fixed o absolute
- [ ] Reemplazar clases de empty state:
  - `.no-data-message` → `.empty-state`
- [ ] Reemplazar clases de badges:
  - `.id-badge` → `.badge-id`

### 3. Actualización de SCSS (15 min)
- [ ] Reemplazar colores hex por variables:
  ```scss
  // Antes
  color: #20b2aa;
  // Después
  color: var(--color-primary);
  ```
- [ ] Reemplazar espaciados px por variables:
  ```scss
  // Antes
  padding: 24px;
  // Después
  padding: var(--spacing-xl);
  ```
- [ ] Reemplazar border-radius por variables:
  ```scss
  // Antes
  border-radius: 12px;
  // Después
  border-radius: var(--radius-lg);
  ```
- [ ] Reemplazar shadows por variables:
  ```scss
  // Antes
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  // Después
  box-shadow: var(--shadow-md);
  ```
- [ ] Eliminar estilos que ya existen en global
- [ ] Mantener solo estilos específicos del componente

### 4. Testing (5 min)
- [ ] Verificar visualmente que no hay cambios
- [ ] Verificar responsive en mobile (< 768px)
- [ ] Verificar interacciones (hover, active, disabled)
- [ ] Verificar que no hay errores en consola

### 5. Documentación (2 min)
- [ ] Marcar componente como completado en este checklist
- [ ] Agregar comentario en SCSS indicando uso del design system

---

## 🎯 Prioridades de Migración

### Alta Prioridad (Componentes más usados)
1. **eventos/lista-tabla** - Vista principal de eventos
2. **dashboard** - Primera pantalla que ven los usuarios
3. **clientes/lista-clientes** - Gestión de clientes
4. **layout/sidebar** - Visible en toda la app

### Media Prioridad
5. Resto de módulo de catalogos
6. Módulo de cotizaciones
7. Módulo de usuarios

### Baja Prioridad
8. Reportes
9. Componentes auxiliares

---

## 🔍 Búsqueda de Hardcoded Values

### Colores a Reemplazar
```bash
# Buscar hex colors
grep -r "#20b2aa\|#f44336\|#636e72\|#2d3436\|#f8f9fa" src/app --include="*.scss"
```

### Espaciados a Revisar
```bash
# Buscar padding/margin con px
grep -r "padding: [0-9].*px\|margin: [0-9].*px" src/app --include="*.scss"
```

---

## 📊 Progreso

**Componentes migrados:** 1/30 (3%)

**Estimación de tiempo:**
- Por componente: ~30 min
- Total restante: ~15 horas
- Con paralelización: ~2-3 días de trabajo

---

## 🎨 Variables Más Usadas

### Top 10 para tener a mano:

```scss
// Colores
var(--color-primary)          // #20b2aa - Turquesa
var(--color-error)            // #f44336 - Rojo
var(--text-primary)           // #2d3436 - Texto oscuro
var(--text-secondary)         // #636e72 - Texto gris
var(--bg-page)                // #f8f9fa - Fondo de página

// Espaciado
var(--spacing-sm)             // 8px
var(--spacing-md)             // 12px
var(--spacing-lg)             // 16px
var(--spacing-xl)             // 24px

// Efectos
var(--shadow-md)              // Sombra media
var(--radius-lg)              // 12px - Border radius grande
```

---

## ✨ Tips

1. **Usar Find & Replace** en VSCode para reemplazos masivos
2. **Comparar antes/después** con Git diff
3. **Testear cada componente** antes de continuar
4. **Migrar módulos completos** en lugar de componentes sueltos
5. **Commitear frecuentemente** con mensajes descriptivos

---

## 📌 Notas Importantes

- ❗ NO modificar `@angular/material/prebuilt-themes/indigo-pink.css`
- ❗ NO usar `!important` excepto en overrides de Material
- ❗ Mantener compatibilidad con Angular Material
- ❗ Testear en Chrome, Firefox y Safari
- ❗ Verificar contraste de colores (WCAG AA)
