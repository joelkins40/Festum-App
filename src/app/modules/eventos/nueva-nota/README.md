# Componente Nueva Nota / Venta

## 📋 Descripción

Componente completo para crear nuevas notas de venta de eventos con gestión de clientes, productos, servicios y cálculo automático de totales.

## 🗂️ Estructura de Archivos

```
nueva-nota/
├── models/
│   └── nota.model.ts          # Interfaces y tipos
├── nueva-nota.component.ts    # Lógica del componente
├── nueva-nota.component.html  # Template
├── nueva-nota.component.scss  # Estilos
└── nueva-nota.service.ts      # Servicio de negocio
```

## ✨ Características Implementadas

### 1. **Datos del Evento**

- ✅ Folio autogenerado (formato: NV-00001)
- ✅ Editable manualmente
- ✅ Nombre del evento
- ✅ Fecha de recepción del mobiliario
- ✅ Fecha de regreso
- ✅ Validación: fecha regreso > fecha recepción

### 2. **Cliente**

- ✅ Autocomplete para buscar clientes existentes
- ✅ Integración con `ClientesService`
- ✅ Botón "Nuevo Cliente" (preparado para dialog)
- ✅ Detección automática de cliente especial
- ✅ Aplicación de precios especiales
- ✅ Badge visual para clientes especiales

### 3. **Lugar del Evento**

- ✅ 3 opciones mediante radio buttons:
  - Usar dirección del cliente
  - Agregar nueva dirección (formulario completo)
  - Seleccionar salón del catálogo
- ✅ Validaciones dinámicas según opción seleccionada
- ✅ Formulario de dirección completo (calle, número, colonia, ciudad, estado, CP)

### 4. **Productos y Servicios**

- ✅ Tabla dinámica tipo nota de remisión
- ✅ Columnas: Producto/Servicio, Descripción, Cantidad, Precio Unitario, Subtotal, Acciones
- ✅ Iconos diferenciados para productos vs servicios
- ✅ Edición inline de cantidad y precio
- ✅ Recálculo automático de subtotales
- ✅ Botón eliminar por fila
- ✅ Precio especial automático para clientes especiales
- ✅ Cálculo automático de:
  - Subtotal
  - IVA (16%)
  - Total

### 5. **Resumen y Confirmación**

- ✅ Card de resumen visual con:
  - Folio
  - Evento
  - Cliente
  - Número de productos
  - Total (destacado)
- ✅ Validaciones antes de guardar:
  - Fechas válidas
  - Al menos un producto
  - Formulario completo
- ✅ Botones de acción:
  - Cancelar (con confirmación)
  - Guardar (con validación)

## 🎨 Diseño Visual

### Paleta de Colores

- **Primary**: Gradiente morado-azul (#667eea - #764ba2)
- **Accent**: Según configuración Material
- **Success**: Verde (#38a169)
- **Error**: Rojo (#e53e3e)
- **Warning**: Amarillo (#fbbf24)

### Componentes Material Utilizados

- ✅ MatCard (secciones organizadas)
- ✅ MatFormField (inputs con outline)
- ✅ MatDatepicker (fechas)
- ✅ MatAutocomplete (clientes)
- ✅ MatRadioButton (tipo de lugar)
- ✅ MatSelect (salones)
- ✅ MatTable (productos)
- ✅ MatIcon (iconografía consistente)
- ✅ MatTooltip (ayudas contextuales)
- ✅ MatSnackBar (notificaciones)

### Características de UI

- ✅ Header con gradiente y título descriptivo
- ✅ Cards con hover effects
- ✅ Campos agrupados lógicamente
- ✅ Iconos en todos los campos
- ✅ Badges para estados especiales
- ✅ Tabla responsive con scroll horizontal
- ✅ Sección de totales destacada
- ✅ Resumen visual con grid
- ✅ Botones con iconos y estados disabled
- ✅ **Completamente responsive**

## 🔧 Servicios Integrados

### Servicios Utilizados

1. **NuevaNotaService** - Gestión de notas
2. **ClientesService** - Búsqueda y selección de clientes
3. **ProductosServiciosService** - Catálogo de productos
4. **SalonesService** - Catálogo de salones (preparado)

### Métodos del Servicio

```typescript
// NuevaNotaService
generarFolio(): string
validarFechas(fechaRecepcion, fechaRegreso): boolean
calcularSubtotal(productos): number
calcularIva(subtotal): number
calcularTotal(subtotal, iva): number
createNota(dto): Observable<NotaResponse>
updateNota(dto): Observable<NotaResponse>
getNotas(): Observable<NotaResponse>
getNotaById(id): Observable<NotaResponse>
deleteNota(id): Observable<NotaResponse>
```

## 📝 Modelo de Datos

### Estructura JSON al Guardar

```json
{
  "folio": "NV-00001",
  "fechaRecepcion": "2025-01-15T00:00:00.000Z",
  "fechaRegreso": "2025-01-16T00:00:00.000Z",
  "nombreEvento": "Boda de Juan y María",
  "clienteId": 1,
  "lugar": {
    "tipo": "direccion_cliente",
    "direccionCliente": {
      "line1": "Calle Principal 123",
      "line2": "Colonia Centro",
      "line3": "Ciudad, Estado, CP"
    }
  },
  "productos": [
    {
      "id": "temp-123456",
      "productoServicioId": 5,
      "tipo": "Producto",
      "nombre": "Silla Tiffany",
      "descripcion": "Silla elegante color blanco",
      "cantidad": 50,
      "precioUnitario": 45.0,
      "subtotal": 2250.0
    }
  ],
  "subtotal": 2250.0,
  "iva": 360.0,
  "total": 2610.0,
  "observaciones": "Entrega a las 8:00 AM"
}
```

## 🔍 Validaciones Implementadas

1. ✅ Folio requerido
2. ✅ Nombre del evento requerido (mínimo 3 caracteres)
3. ✅ Fechas requeridas
4. ✅ Fecha de regreso > fecha de recepción
5. ✅ Cliente requerido
6. ✅ Lugar requerido (según tipo seleccionado)
7. ✅ Al menos un producto/servicio
8. ✅ Cantidad mínima: 1
9. ✅ Precio mínimo: 0

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 768px

  - Layout en grid
  - Campos en filas
  - Tabla con scroll horizontal

- **Mobile**: ≤ 768px
  - Layout apilado
  - Campos full width
  - Botones full width
  - Grid de resumen en columna única

## 🚀 Uso

### Importar en Rutas

```typescript
import { NuevaNotaComponent } from "./modules/eventos/nueva-nota/nueva-nota.component";

export const routes: Routes = [
  {
    path: "eventos/nueva-nota",
    component: NuevaNotaComponent,
  },
];
```

### Navegación

```typescript
this.router.navigate(["/eventos/nueva-nota"]);
```

## 🎯 Funcionalidades Pendientes (Opcionales)

- [ ] Implementar dialog de nuevo cliente
- [ ] Implementar dialog de selección de productos
- [ ] Integración con salones real (actualmente mock)
- [ ] Impresión de nota en PDF
- [ ] Envío de nota por email
- [ ] Historial de notas por cliente
- [ ] Duplicar nota existente
- [ ] Agregar descuentos
- [ ] Agregar múltiples métodos de pago

## ⚙️ Configuración

### Dependencias Requeridas

- Angular 19
- Angular Material
- RxJS

### Servicios Requeridos

Los siguientes servicios deben estar configurados:

- `ClientesService` con método `getClientes()`
- `ProductosServiciosService` con método `getProductosServicios()`

## 📚 Nomenclatura

- **Variables y funciones**: English (camelCase)
- **Comentarios**: Español
- **Archivos**: kebab-case
- **Clases**: PascalCase
- **Interfaces**: PascalCase

## ✅ Estado del Proyecto

**COMPLETADO** - Componente funcional y listo para usar.

Todos los requerimientos implementados:

- ✅ Formulario completo con validaciones
- ✅ Integración con servicios
- ✅ Diseño responsive
- ✅ Material Design
- ✅ Cálculos automáticos
- ✅ UX optimizada
