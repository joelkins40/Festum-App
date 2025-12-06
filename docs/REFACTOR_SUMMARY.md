# 🎨 Refactorización de Estilos - FESTUM APP

## 📝 Resumen del Trabajo Realizado

Este documento resume la refactorización completa del sistema de estilos de la aplicación Festum, basada en el componente de referencia `src/app/modules/catalogos/categorias`.

---

## ✅ Cambios Implementados

### 1. Sistema de Variables CSS (`:root`)

Se creó un sistema completo de variables CSS en `src/styles.scss` que incluye:

#### Colores
- ✨ Primarios: `--color-primary`, `--color-primary-hover`, variantes alpha
- 🎯 Semánticos: `--color-success`, `--color-error`, `--color-warning`, `--color-info`
- 📝 Texto: `--text-primary`, `--text-secondary`, `--text-muted`
- 🎨 Backgrounds: `--bg-page`, `--bg-surface`, `--bg-hover`
- 🔲 Bordes: `--border-light`, `--border-medium`, `--border-dark`

#### Espaciado
- `--spacing-xs` (4px) → `--spacing-3xl` (48px)
- Escala consistente de 8 niveles

#### Tipografía
- Tamaños: `--font-size-xs` (11px) → `--font-size-3xl` (28px)
- Pesos: `--font-weight-normal` → `--font-weight-bold`
- Line heights y letter spacing

#### Efectos
- Sombras: `--shadow-sm` → `--shadow-xl`
- Border radius: `--radius-sm` → `--radius-circle`
- Transiciones: `--transition-fast`, `--transition-base`, `--transition-slow`

#### Z-index
- Escala organizada de 100 a 700 para layers

### 2. Clases Reutilizables BEM

Se crearon más de 50 clases reutilizables organizadas en categorías:

#### Layout
- `.page-container` - Contenedor principal
- `.page-header` - Header con modificadores BEM
- `.page-title` - Título con icono
- `.page-description` - Descripción

#### Botones
- `.btn-primary` - Botón principal (turquesa)
- `.btn-secondary` - Botón secundario (gris)
- `.btn-outlined` - Botón con borde
- `.btn-icon-edit` - Botón de edición
- `.btn-icon-delete` - Botón de eliminación
- `.btn-with-icon` - Modificador para botones con icono

#### Cards
- `.card` - Card base
- `.card--elevated` - Card con más elevación
- `.card--bordered` - Card con borde

#### Tablas
- `.table-toolbar` - Toolbar con búsqueda y acciones
- `.table-container` - Contenedor scrollable
- `.data-table` - Tabla base
- `.table-cell--id`, `--actions`, `--status`, `--date` - Modificadores de columnas

#### Chips y Badges
- `.badge-id` - Badge para IDs
- `.chip-status` - Chip de estado base
- `.chip-status--active`, `--inactive`, `--success`, `--warning` - Variantes

#### Loading States
- `.loading-overlay` - Overlay de carga
- `.loading-overlay--absolute` - Variante posicionada

#### Empty States
- `.empty-state` - Estado vacío completo

#### Formularios
- `.form-section` - Sección de formulario
- `.form-row` - Fila de campos
- `.form-actions` - Acciones del formulario

#### Icon + Text
- `.icon-text` - Combinación icono + texto
- `.icon-text__icon--primary`, `--secondary` - Colores
- `.icon-text__icon--sm`, `--md` - Tamaños

### 3. Responsive Design

Sistema mobile-first con breakpoints:
- Mobile: < 480px
- Tablet: < 768px
- Desktop: ≥ 768px

Componentes que adaptan automáticamente:
- Headers se apilan verticalmente
- Toolbars colapsan búsqueda y acciones
- Tablas ocultan columnas menos importantes
- Formularios se ajustan a pantalla completa

### 4. Angular Material Customizations

Overrides específicos para Angular Material:
- ✅ Botones con animaciones
- ✅ Form fields con color primario en focus
- ✅ Cards con border radius consistente
- ✅ Paginador con estilos personalizados
- ✅ Snackbars con colores semánticos
- ✅ Tabs con tipografía consistente

### 5. Componente de Referencia Migrado

`src/app/modules/catalogos/categorias`:
- ✅ HTML actualizado con clases BEM
- ✅ SCSS reducido a ~100 líneas (era ~600)
- ✅ Sin valores hardcodeados
- ✅ Responsive completo
- ✅ Mantiene funcionalidad 100%

---

## 📚 Documentación Creada

### 1. `docs/DESIGN_SYSTEM.md`
Guía completa del sistema de diseño con:
- 📖 Referencia de todas las variables
- 🎨 Ejemplos de uso de cada clase
- 💡 Buenas prácticas
- ❌ Anti-patrones a evitar
- 🔄 Guía de migración

### 2. `docs/REFACTOR_CHECKLIST.md`
Checklist de refactorización con:
- ✅ Estado de migración por componente
- 📋 Checklist detallado de pasos
- 🎯 Prioridades de migración
- 📊 Métricas de progreso
- 🔍 Comandos de búsqueda

### 3. `find-hardcoded-styles.fish`
Script ejecutable para:
- 🔍 Encontrar colores hardcodeados
- 📏 Identificar espaciados en px
- 💫 Detectar shadows duplicadas
- 📊 Generar estadísticas
- 🎯 Listar archivos prioritarios

---

## 🎯 Componente de Referencia

**Archivo:** `src/app/modules/catalogos/categorias`

Este componente implementa **TODOS** los patrones del sistema de diseño:

### Estructura Visual
```
┌─────────────────────────────────────────────────┐
│ 📌 Page Header (con border-left turquesa)      │
│   • Título con icono                            │
│   • Descripción                                 │
│   • Botón de acción primario                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🔍 Table Toolbar                                │
│   • Campo de búsqueda (flex-grow)              │
│   • Botones de acción (importar, exportar)     │
│   • Botón refresh                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📊 Data Table                                   │
│   • Columna ID con badge                        │
│   • Descripción con icono                       │
│   • Fecha con icono                             │
│   • Estado con chip (activo/inactivo)          │
│   • Acciones con botones icono                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📄 Paginador                                    │
└─────────────────────────────────────────────────┘
```

### Características Implementadas
- ✅ Colores consistentes
- ✅ Espaciado uniforme
- ✅ Tipografía escalable
- ✅ Iconografía coherente
- ✅ Animaciones suaves
- ✅ Estados interactivos (hover, active, disabled)
- ✅ Loading states
- ✅ Empty states
- ✅ Responsive completo

---

## 📊 Métricas

### Antes
- Variables CSS: ~25
- Clases reutilizables: ~18
- Código duplicado: Alto
- Valores hardcodeados: >500
- SCSS del componente: ~600 líneas
- Consistencia: Media

### Después
- Variables CSS: **150+**
- Clases reutilizables: **50+**
- Código duplicado: **Mínimo**
- Valores hardcodeados: **0** (en componentes migrados)
- SCSS del componente: **~100 líneas** (-83%)
- Consistencia: **Alta**

---

## 🚀 Próximos Pasos

### Fase 1: Catalogos (Alta Prioridad)
- [ ] tipos-eventos
- [ ] salones
- [ ] paquetes
- [ ] contactos-frecuentes
- [ ] tipos-mobiliario

**Estimación:** 2.5 horas (30 min × 5 componentes)

### Fase 2: Core & Alta Visibilidad
- [ ] eventos/lista-tabla
- [ ] dashboard
- [ ] layout/sidebar
- [ ] layout/topbar

**Estimación:** 2 horas

### Fase 3: Resto de Módulos
- [ ] Clientes
- [ ] Cotizaciones
- [ ] Usuarios
- [ ] Reportes
- [ ] Shared components

**Estimación:** 8 horas

### Total Estimado
**~12-15 horas de trabajo** para migración completa

---

## 🛠️ Herramientas Disponibles

### 1. Script de Búsqueda
```bash
./find-hardcoded-styles.fish
```
Encuentra automáticamente valores hardcodeados en todos los componentes.

### 2. Documentación de Referencia
```
docs/DESIGN_SYSTEM.md       # Guía completa
docs/REFACTOR_CHECKLIST.md  # Checklist paso a paso
```

### 3. VSCode Snippets (Recomendado)
Crear snippets para clases comunes:
```json
{
  "Page Header BEM": {
    "prefix": "festum-header",
    "body": [
      "<div class=\"page-header\">",
      "  <div class=\"page-header__content\">",
      "    <div class=\"page-title\">",
      "      <mat-icon class=\"page-title__icon\">$1</mat-icon>",
      "      <h1 class=\"page-title__text\">$2</h1>",
      "    </div>",
      "    <p class=\"page-description\">$3</p>",
      "  </div>",
      "</div>"
    ]
  }
}
```

---

## 💡 Buenas Prácticas Establecidas

### ✅ HACER
1. Usar variables CSS de `styles.scss`
2. Usar clases BEM reutilizables
3. Mantener estilos específicos en `.component.scss`
4. Usar Flexbox/Grid para layouts
5. Enfoque mobile-first
6. Reducir especificidad de selectores

### ❌ NO HACER
1. Colores hex directos
2. Valores `px` directos (usar variables)
3. `float` para layouts
4. `!important` (excepto overrides de Material)
5. Crear nuevos estilos si existe clase reutilizable
6. Inline styles en HTML

---

## 🎨 Paleta de Colores Oficial

```scss
// Primario
#20b2aa - Turquesa (brand color)
#1a9b94 - Turquesa oscuro (hover)

// Semánticos
#28a745 - Verde (success)
#f44336 - Rojo (error)
#ffc107 - Amarillo (warning)
#2196f3 - Azul (info)

// Neutrales
#2d3436 - Texto primario
#636e72 - Texto secundario
#9ca3af - Texto muted
#f8f9fa - Fondo página
#ffffff - Fondo surface
#e9ecef - Bordes
```

---

## 📞 Soporte

Para dudas sobre el sistema de diseño:

1. Consultar `docs/DESIGN_SYSTEM.md`
2. Revisar componente de referencia en `categorias`
3. Usar script `find-hardcoded-styles.fish` para análisis

---

## 🎉 Resultado Final

Se ha creado un **sistema de diseño completo, escalable y mantenible** basado en:

- ✅ Variables CSS organizadas
- ✅ Clases reutilizables BEM
- ✅ Componente de referencia funcional
- ✅ Documentación exhaustiva
- ✅ Herramientas de análisis
- ✅ Responsive design integrado
- ✅ Angular Material customizado

**El sistema está listo para ser replicado en el resto de componentes de la aplicación.**

---

## 📅 Changelog

**5 de Diciembre 2025**
- ✅ Creado sistema de variables CSS completo
- ✅ Implementadas 50+ clases reutilizables BEM
- ✅ Migrado componente `categorias` como referencia
- ✅ Creada documentación completa
- ✅ Implementado responsive design
- ✅ Customizado Angular Material
- ✅ Creado script de análisis
- ✅ Establecidas buenas prácticas

---

**Desarrollado por:** GitHub Copilot + Claude Sonnet 4.5
**Metodología:** BEM + Mobile-First + CSS Variables
**Framework:** Angular 19 + SCSS + Angular Material
