# UI Chip Component

Componente reutilizable para mostrar chips/badges informativos con diferentes variantes, tamaños e iconos.

## Importación

```typescript
import { ChipComponent } from "@shared/components/chip";
```

## Uso Básico

```html
<!-- Chip simple -->
<ui-chip>Default Chip</ui-chip>

<!-- Chip con variante -->
<ui-chip variant="primary">Primary Chip</ui-chip>

<!-- Chip con icono -->
<ui-chip variant="success" icon="check_circle">Activo</ui-chip>

<!-- Chip con tamaño -->
<ui-chip size="sm" variant="error" icon="cancel">Pequeño</ui-chip>
```

## Propiedades

### `variant` (opcional)

Tipo: `ChipVariant`  
Default: `'default'`  
Opciones: `'default' | 'primary' | 'accent' | 'success' | 'error' | 'warning' | 'info' | 'secondary'`

Define el estilo visual del chip según su propósito semántico.

```html
<ui-chip variant="default">Default</ui-chip>
<ui-chip variant="primary">Primary</ui-chip>
<ui-chip variant="accent">Accent</ui-chip>
<ui-chip variant="success">Success</ui-chip>
<ui-chip variant="error">Error</ui-chip>
<ui-chip variant="warning">Warning</ui-chip>
<ui-chip variant="info">Info</ui-chip>
<ui-chip variant="secondary">Secondary</ui-chip>
```

### `size` (opcional)

Tipo: `ChipSize`  
Default: `'md'`  
Opciones: `'sm' | 'md' | 'lg'`

Controla el tamaño del chip.

```html
<ui-chip size="sm">Pequeño (20px)</ui-chip>
<ui-chip size="md">Mediano (28px)</ui-chip>
<ui-chip size="lg">Grande (36px)</ui-chip>
```

### `icon` (opcional)

Tipo: `string`  
Default: `undefined`

Nombre del icono de Material Icons a mostrar. Si se proporciona, el icono aparece antes del texto.

```html
<ui-chip icon="star">Con icono</ui-chip>
<ui-chip icon="check_circle" variant="success">Completado</ui-chip>
<ui-chip icon="error" variant="error">Error</ui-chip>
```

### `disabled` (opcional)

Tipo: `boolean`  
Default: `false`

Deshabilita el chip aplicando opacidad reducida.

```html
<ui-chip [disabled]="true">Deshabilitado</ui-chip>
```

## Ejemplos de Uso Común

### Estados de Activación

```html
<ui-chip [variant]="item.activo ? 'success' : 'error'" [icon]="item.activo ? 'check_circle' : 'cancel'"> {{ item.activo ? 'Activo' : 'Inactivo' }} </ui-chip>
```

### Estado de Proceso

```html
<ui-chip variant="warning" icon="schedule">Pendiente</ui-chip>
<ui-chip variant="info" icon="sync">En Proceso</ui-chip>
<ui-chip variant="success" icon="check_circle">Completado</ui-chip>
```

### Categorías o Tags

```html
<ui-chip variant="primary" size="sm">VIP</ui-chip>
<ui-chip variant="accent" size="sm">Premium</ui-chip>
<ui-chip variant="secondary" size="sm">Básico</ui-chip>
```

### Con Condicional

```html
<ui-chip [variant]="getStatusVariant(status)" [icon]="getStatusIcon(status)" size="md"> {{ status }} </ui-chip>
```

## Colores y Estilos

El componente utiliza los tokens de diseño globales de `_variables.scss`:

- **Primary**: `--color-primary` (#20b2aa)
- **Success**: `--color-success` (#28a745)
- **Error**: `--color-error` (#f44336)
- **Warning**: `--color-warning` (#ffc107)
- **Info**: `--color-info` (#2196f3)
- **Accent**: `--color-accent` (#17a2b8)
- **Secondary**: `--color-secondary` (#636e72)

Cada variante incluye:

- Fondo semitransparente (alpha-15)
- Borde con color de la variante (alpha-30)
- Efecto hover para interactividad visual

## Accesibilidad

- Usa contraste adecuado en todos los variants
- Los iconos son decorativos y refuerzan el mensaje textual
- Estado disabled claramente visible con opacidad reducida

## Migración desde mat-chip

**Antes:**

```html
<mat-chip class="estado-chip" [ngClass]="item.activo ? 'activo' : 'inactivo'">
  <mat-icon class="estado-icon"> {{ item.activo ? 'check_circle' : 'cancel' }} </mat-icon>
  {{ item.activo ? 'Activo' : 'Inactivo' }}
</mat-chip>
```

**Después:**

```html
<ui-chip [variant]="item.activo ? 'success' : 'error'" [icon]="item.activo ? 'check_circle' : 'cancel'"> {{ item.activo ? 'Activo' : 'Inactivo' }} </ui-chip>
```

## Notas de Implementación

1. El componente usa BEM para nomenclatura de clases CSS
2. Todas las transiciones son suaves usando `var(--transition-fast)`
3. El padding se ajusta automáticamente cuando hay icono
4. Los iconos se escalan proporcionalmente según el tamaño
5. No requiere estilos adicionales en el componente padre
