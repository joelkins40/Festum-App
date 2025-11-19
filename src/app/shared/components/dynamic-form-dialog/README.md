# DynamicFormDialogComponent

Un componente Angular 19 reutilizable para crear formularios dinámicos dentro de un `MatDialog` basado en configuración JSON.

## 📋 Características

- ✅ **Completamente tipado** con TypeScript
- ✅ **Standalone Component** (Angular 19)
- ✅ **Material Design** integrado
- ✅ **Validaciones automáticas** (required, min, max, minLength, maxLength, email)
- ✅ **Tamaño dinámico** según número de campos
- ✅ **Responsive** por defecto
- ✅ **Accesible** con labels y aria-labels
- ✅ **Fácil de usar** - configuración JSON simple
- ✅ **Totalmente documentado**

---

## 🚀 Instalación

El componente ya está creado en tu proyecto en:

```
src/app/shared/components/dynamic-form-dialog/
```

### Archivos incluidos:

```
dynamic-form-dialog/
├── dynamic-form-dialog.component.ts      # Lógica del componente
├── dynamic-form-dialog.component.html    # Template
├── dynamic-form-dialog.component.scss    # Estilos
├── dynamic-form-dialog.types.ts          # Interfaces y tipos
├── USAGE_EXAMPLES.ts                     # 7 ejemplos de uso
└── README.md                             # Esta documentación
```

---

## 📖 Uso Básico

### 1. Importar en tu componente

```typescript
import { Component, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { DynamicFormDialogComponent } from "@shared/components/dynamic-form-dialog/dynamic-form-dialog.component";
import { DynamicFormConfig, DynamicFormResult, calculateDialogWidth } from "@shared/components/dynamic-form-dialog/dynamic-form-dialog.types";

@Component({
  selector: "app-mi-componente",
  // ...
})
export class MiComponente {
  private dialog = inject(MatDialog);

  abrirFormulario(): void {
    // Ver paso 2
  }
}
```

### 2. Crear la configuración

```typescript
const config: DynamicFormConfig = {
  title: "Crear Cliente",
  subtitle: "Complete los datos del nuevo cliente",
  fields: [
    {
      type: "text",
      key: "nombre",
      label: "Nombre completo",
      required: true,
    },
    {
      type: "email",
      key: "email",
      label: "Correo electrónico",
      required: true,
    },
    {
      type: "select",
      key: "ciudad",
      label: "Ciudad",
      options: ["CDMX", "Guadalajara", "Monterrey"],
    },
  ],
};
```

### 3. Abrir el diálogo

```typescript
const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
  data: config,
  width: calculateDialogWidth(config.fields.length),
});

dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
  if (result?.confirmed) {
    console.log("Datos del formulario:", result.data);
    // result.data = { nombre: '...', email: '...', ciudad: '...' }
  }
});
```

---

## 🎨 Tipos de Campos Soportados

### Text

```typescript
{
  type: 'text',
  key: 'nombre',
  label: 'Nombre',
  placeholder: 'Ingrese su nombre',
  required: true,
  minLength: 3,
  maxLength: 50
}
```

### Email

```typescript
{
  type: 'email',
  key: 'email',
  label: 'Email',
  required: true
}
```

### Number

```typescript
{
  type: 'number',
  key: 'edad',
  label: 'Edad',
  min: 18,
  max: 100
}
```

### Date

```typescript
{
  type: 'date',
  key: 'fecha',
  label: 'Fecha del evento',
  required: true
}
```

### Select (opciones simples)

```typescript
{
  type: 'select',
  key: 'ciudad',
  label: 'Ciudad',
  options: ['CDMX', 'Puebla', 'Monterrey']
}
```

### Select (opciones complejas)

```typescript
{
  type: 'select',
  key: 'tipoEvento',
  label: 'Tipo de Evento',
  options: [
    { label: 'Boda', value: 'boda' },
    { label: 'XV Años', value: 'xv_anios' },
    { label: 'Corporativo', value: 'corporativo' }
  ]
}
```

### Textarea

```typescript
{
  type: 'textarea',
  key: 'observaciones',
  label: 'Observaciones',
  rows: 4,
  maxLength: 500
}
```

---

## ⚙️ Configuración Completa

### DynamicFormConfig

```typescript
interface DynamicFormConfig {
  title: string; // Título del diálogo
  subtitle?: string; // Subtítulo opcional
  fields: DynamicFormField[]; // Array de campos
  confirmButtonText?: string; // Texto del botón confirmar (default: "Confirmar")
  cancelButtonText?: string; // Texto del botón cancelar (default: "Cancelar")
  width?: string; // Ancho personalizado (default: automático)
  maxHeight?: string; // Altura máxima (default: auto)
}
```

### DynamicFormField

```typescript
interface DynamicFormField {
  type: "text" | "email" | "number" | "date" | "select" | "textarea";
  key: string; // Clave única (se usará en el resultado)
  label: string; // Label visible
  value?: unknown; // Valor inicial (para edición)
  placeholder?: string; // Placeholder
  required?: boolean; // Si es requerido
  disabled?: boolean; // Si está deshabilitado

  // Para text/textarea
  minLength?: number;
  maxLength?: number;

  // Para number
  min?: number;
  max?: number;

  // Para select
  options?: string[] | { label: string; value: string | number }[];

  // Para textarea
  rows?: number; // Número de filas (default: 4)
}
```

### DynamicFormResult

```typescript
interface DynamicFormResult<T = Record<string, unknown>> {
  confirmed: boolean; // true = confirmado, false = cancelado
  data?: T; // Datos del formulario (si fue confirmado)
}
```

---

## 📐 Tamaños del Diálogo

### Automático (Recomendado)

```typescript
import { calculateDialogWidth } from "./dynamic-form-dialog.types";

width: calculateDialogWidth(config.fields.length);
```

**Reglas automáticas:**

- 1 campo → `400px` (Small)
- 2-4 campos → `600px` (Medium)
- 5-8 campos → `800px` (Large)
- 9+ campos → `1000px` (Extra Large)

### Manual

```typescript
width: '650px',
maxHeight: '80vh'
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear Registro Simple

```typescript
openCreateDialog(): void {
  const config: DynamicFormConfig = {
    title: 'Nueva Categoría',
    fields: [
      { type: 'text', key: 'nombre', label: 'Nombre', required: true }
    ]
  };

  this.dialog.open(DynamicFormDialogComponent, {
    data: config,
    width: '400px'
  }).afterClosed().subscribe(result => {
    if (result?.confirmed) {
      this.categoriasService.create(result.data).subscribe();
    }
  });
}
```

### Ejemplo 2: Editar Registro Existente

```typescript
editClient(cliente: Cliente): void {
  const config: DynamicFormConfig = {
    title: 'Editar Cliente',
    fields: [
      {
        type: 'text',
        key: 'nombre',
        label: 'Nombre',
        value: cliente.nombre,  // ← Valor inicial
        required: true
      },
      {
        type: 'email',
        key: 'email',
        label: 'Email',
        value: cliente.email,
        required: true
      }
    ]
  };

  this.dialog.open(DynamicFormDialogComponent, {
    data: config,
    width: '500px'
  }).afterClosed().subscribe(result => {
    if (result?.confirmed) {
      this.clientesService.update(cliente.id, result.data).subscribe();
    }
  });
}
```

### Ejemplo 3: Formulario con Tipado Estricto

```typescript
interface EventoForm {
  nombre: string;
  fecha: string;
  invitados: number;
}

openEventDialog(): void {
  const config: DynamicFormConfig = {
    title: 'Nuevo Evento',
    fields: [
      { type: 'text', key: 'nombre', label: 'Nombre', required: true },
      { type: 'date', key: 'fecha', label: 'Fecha', required: true },
      { type: 'number', key: 'invitados', label: 'Invitados', min: 1 }
    ]
  };

  this.dialog.open(DynamicFormDialogComponent, {
    data: config,
    width: '600px'
  }).afterClosed().subscribe((result: DynamicFormResult<EventoForm>) => {
    if (result?.confirmed && result.data) {
      // TypeScript conoce la estructura de result.data
      const evento: EventoForm = result.data;
      console.log(`Evento: ${evento.nombre}, Fecha: ${evento.fecha}`);
    }
  });
}
```

---

## ✅ Validaciones

### Validaciones Automáticas

El componente valida automáticamente:

| Propiedad   | Validación                      |
| ----------- | ------------------------------- |
| `required`  | Campo obligatorio               |
| `minLength` | Longitud mínima (text/textarea) |
| `maxLength` | Longitud máxima (text/textarea) |
| `min`       | Valor mínimo (number)           |
| `max`       | Valor máximo (number)           |
| `email`     | Formato de email válido         |

### Mensajes de Error Personalizados

Los mensajes se generan automáticamente basados en la validación:

- "Nombre es requerido"
- "Mínimo 5 caracteres"
- "Máximo 100 caracteres"
- "Ingrese un email válido"
- "El valor mínimo es 18"

---

## 🎨 Personalización de Estilos

### Colores Principales

El componente usa la paleta de colores de Festum App:

- **Primario:** `#20b2aa` (Turquesa)
- **Borde inferior del título:** `#e9ecef`
- **Fondo de acciones:** `#f8f9fa`

### Modificar Estilos

Edita `dynamic-form-dialog.component.scss` para personalizar:

```scss
.dialog-title {
  .title-icon {
    color: #tu-color; // Cambiar color del icono
  }
}
```

---

## 📱 Responsive

El componente es completamente responsive:

- **Desktop:** Layout horizontal con espaciado amplio
- **Mobile:** Campos apilados verticalmente, botones 100% width

---

## ♿ Accesibilidad

- ✅ Todos los campos tienen `<label>` asociado
- ✅ Mensajes de error descriptivos
- ✅ Navegación por teclado completa
- ✅ Indicadores visuales de campos requeridos
- ✅ Estados focus bien definidos

---

## 🔧 Tips y Mejores Prácticas

### 1. Reutilización

Crea funciones helper para configuraciones comunes:

```typescript
export class DialogHelpers {
  static clienteConfig(titulo: string, cliente?: Cliente): DynamicFormConfig {
    return {
      title: titulo,
      fields: [
        { type: "text", key: "nombre", label: "Nombre", value: cliente?.nombre, required: true },
        { type: "email", key: "email", label: "Email", value: cliente?.email, required: true },
      ],
    };
  }
}

// Uso:
this.dialog.open(DynamicFormDialogComponent, {
  data: DialogHelpers.clienteConfig("Editar Cliente", this.cliente),
});
```

### 2. Constantes para Opciones

```typescript
const CIUDADES = ["CDMX", "Guadalajara", "Monterrey", "Puebla"];
const TIPOS_EVENTO = [
  { label: "Boda", value: "boda" },
  { label: "XV Años", value: "xv_anios" },
];
```

### 3. Validación Adicional

Para validaciones más complejas, procesa los datos después de recibir el resultado:

```typescript
dialogRef.afterClosed().subscribe((result) => {
  if (result?.confirmed) {
    if (!this.validateBusinessRules(result.data)) {
      // Mostrar error
      return;
    }
    // Guardar
  }
});
```

---

## 🐛 Troubleshooting

### El diálogo no se abre

- Verifica que `MatDialogModule` esté importado en tu módulo/componente
- Confirma que inyectaste `MatDialog` correctamente

### Los estilos no se ven bien

- Asegúrate de tener Angular Material correctamente instalado
- Verifica que el tema de Material esté configurado

### El formulario no valida

- Revisa que los campos tengan `required: true`
- Verifica que las propiedades de validación estén bien escritas

---

## 📚 Recursos Adicionales

- **Ejemplos completos:** Ver `USAGE_EXAMPLES.ts`
- **Tipos:** Ver `dynamic-form-dialog.types.ts`
- **Angular Material Dialog:** [Documentación oficial](https://material.angular.io/components/dialog)

---

## 📝 Licencia

Este componente es parte del proyecto Festum App.

---

**Creado para Festum App - Sistema de Gestión de Eventos**
**Angular 19 | Material Design | TypeScript**
