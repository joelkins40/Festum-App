# 🌳 Estructura del Módulo de Documentos PDF

```
Festum-App/
│
├── MODULO_PDF_RESUMEN.md                    # 📄 Resumen ejecutivo del proyecto
│
├── src/app/
│   │
│   ├── core/                                # 🏗️ ARQUITECTURA CORE
│   │   │
│   │   ├── models/
│   │   │   └── documento-pdf.model.ts       # 📋 Interfaces, Enums y Utilidades
│   │   │       ├── DocumentoPdf
│   │   │       ├── CrearDocumentoPdfDto
│   │   │       ├── ActualizarDocumentoPdfDto
│   │   │       ├── DocumentoPdfResponse
│   │   │       ├── DocumentoPdfFiltros
│   │   │       ├── TipoDocumento (Enum)
│   │   │       ├── TipoDocumentoLabels
│   │   │       ├── TipoDocumentoIcons
│   │   │       └── Funciones Utilitarias:
│   │   │           ├── formatearTamano()
│   │   │           ├── esPDF()
│   │   │           ├── obtenerNombreSinExtension()
│   │   │           ├── archivoABase64()
│   │   │           ├── base64ABlob()
│   │   │           └── descargarPDF()
│   │   │
│   │   └── services/
│   │       └── documento-pdf.service.ts     # 🔧 Servicio de Datos
│   │           ├── Mock Data (5 documentos)
│   │           ├── BehaviorSubjects (documentos$, loading$)
│   │           └── Métodos:
│   │               ├── getDocumentos()
│   │               ├── getDocumentoById()
│   │               ├── crearDocumento()
│   │               ├── actualizarDocumento()
│   │               ├── eliminarDocumento()
│   │               ├── toggleEstado()
│   │               └── getEstadisticas()
│   │
│   └── modules/catalogos/save-pdf/          # 📦 MÓDULO PRINCIPAL
│       │
│       ├── README.md                        # 📖 Documentación del módulo
│       │
│       ├── save-pdf.component.ts            # 🎯 Componente Principal
│       ├── save-pdf.component.html          #    ├── Template
│       ├── save-pdf.component.scss          #    ├── Estilos
│       └── save-pdf.component.spec.ts       #    └── Tests
│       │   │
│       │   ├── Tabla MatTable con:
│       │   │   ├── Paginación
│       │   │   ├── Ordenamiento
│       │   │   └── Filtros avanzados
│       │   │
│       │   ├── Acciones:
│       │   │   ├── Ver PDF
│       │   │   ├── Descargar
│       │   │   ├── Editar
│       │   │   ├── Cambiar estado
│       │   │   └── Eliminar
│       │   │
│       │   └── Características:
│       │       ├── Signals (Angular 19)
│       │       ├── Control Flow (@if, @for)
│       │       ├── Standalone Component
│       │       └── Material Design
│       │
│       ├── documento-dialog/                # 📝 Modal Crear/Editar
│       │   ├── documento-dialog.component.ts
│       │   ├── documento-dialog.component.html
│       │   └── documento-dialog.component.scss
│       │   │
│       │   ├── Funcionalidades:
│       │   │   ├── Upload de PDF
│       │   │   ├── Conversión a Base64
│       │   │   ├── Preview de archivo
│       │   │   ├── Validaciones
│       │   │   └── Formulario Reactivo
│       │   │
│       │   └── Validaciones:
│       │       ├── Solo archivos .pdf
│       │       ├── Máximo 10 MB
│       │       ├── Nombre: 3-200 caracteres
│       │       └── Descripción: 0-500 caracteres
│       │
│       └── pdf-viewer/                      # 👁️ Visor de PDF
│           ├── pdf-viewer.component.ts
│           ├── pdf-viewer.component.html
│           └── pdf-viewer.component.scss
│           │
│           ├── Funcionalidades:
│           │   ├── Conversión Base64 → Blob
│           │   ├── Iframe para visualización
│           │   ├── Botón de descarga
│           │   └── Manejo de errores
│           │
│           └── Estados:
│               ├── Loading (spinner)
│               ├── Error (mensaje elegante)
│               └── Loaded (iframe full-size)
│
└── Archivos antiguos (no utilizados):      # 🗑️ Pueden eliminarse
    ├── save-pdf.ts
    ├── save-pdf.html
    └── save-pdf.scss
```

---

## 📊 Métricas del Proyecto

| Métrica                      | Valor  |
| ---------------------------- | ------ |
| **Total de Archivos Nuevos** | 13     |
| **Componentes Angular**      | 3      |
| **Servicios**                | 1      |
| **Modelos/Interfaces**       | 6+     |
| **Líneas de Código**         | ~2,500 |
| **Funciones Utilitarias**    | 6      |
| **Tipos de Documento**       | 8      |
| **Documentos Mock**          | 5      |

---

## 🎨 Stack Tecnológico

```
┌─────────────────────────────────────────┐
│         ANGULAR 19 (Standalone)         │
├─────────────────────────────────────────┤
│  • Signals                              │
│  • Control Flow Syntax                  │
│  • Reactive Forms                       │
│  • RxJS                                 │
│  • TypeScript                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         ANGULAR MATERIAL                │
├─────────────────────────────────────────┤
│  • MatTable + Pagination + Sort         │
│  • MatDialog                            │
│  • MatFormField + MatInput              │
│  • MatSelect                            │
│  • MatChip                              │
│  • MatMenu                              │
│  • MatSnackBar                          │
│  • MatProgressSpinner                   │
│  • MatIcon                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         CARACTERÍSTICAS                 │
├─────────────────────────────────────────┤
│  • Conversión Base64                    │
│  • PDF Viewer (iframe)                  │
│  • File Upload                          │
│  • CRUD Completo                        │
│  • Filtros Avanzados                    │
│  • Responsive Design                    │
│  • Loading States                       │
│  • Error Handling                       │
└─────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

```
┌──────────────────┐
│  Usuario         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  SavePdfComponent                │
│  (Componente Principal)          │
│  • Tabla de documentos           │
│  • Filtros                       │
│  • Acciones                      │
└────────┬─────────────────────────┘
         │
         ├─────────────┐
         │             │
         ▼             ▼
┌────────────────┐  ┌──────────────────┐
│ DocumentoDialog│  │  PdfViewer       │
│ (Crear/Editar) │  │  (Visualizar)    │
└────────┬───────┘  └────────┬─────────┘
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
         ┌────────────────────┐
         │ DocumentoPdfService│
         │ (Gestión de datos) │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Mock Data (Array) │
         │  • 5 documentos    │
         │  • Base64 PDFs     │
         └────────────────────┘
```

---

## 🎯 Casos de Uso Principales

### 1️⃣ Crear Documento

```
Usuario → Click "Nuevo Documento"
       → Abrir DocumentoDialog
       → Seleccionar PDF
       → Convertir a Base64
       → Llenar formulario
       → Guardar
       → Actualizar tabla
```

### 2️⃣ Ver Documento

```
Usuario → Click "Ver" (ícono ojo)
       → Abrir PdfViewer
       → Convertir Base64 a Blob
       → Mostrar en iframe
       → Opción de descargar
```

### 3️⃣ Editar Documento

```
Usuario → Click "Editar" (menú)
       → Abrir DocumentoDialog (modo editar)
       → Modificar datos
       → Opcionalmente cambiar PDF
       → Guardar cambios
       → Actualizar tabla
```

### 4️⃣ Eliminar Documento

```
Usuario → Click "Eliminar" (menú)
       → Mostrar confirmación
       → Confirmar
       → Soft delete (activo = false)
       → Actualizar tabla
```

### 5️⃣ Filtrar Documentos

```
Usuario → Escribir en búsqueda
       → Seleccionar tipo
       → Aplicar filtros
       → Actualizar tabla automáticamente
```

---

## 🌈 Paleta de Colores del Módulo

```
Primary (Turquesa)
━━━━━━━━━━━━━━━━━━
#20b2aa  ████████  Botones, Headers, Iconos principales
#1a9b94  ████████  Hover states
#e6f9f8  ████████  Backgrounds suaves

Tipos de Documento
━━━━━━━━━━━━━━━━━━
#1976d2  ████████  CONTRATO
#c2185b  ████████  COTIZACION
#f57c00  ████████  FACTURA
#388e3c  ████████  RECIBO
#7b1fa2  ████████  ORDEN_COMPRA
#00897b  ████████  MANUAL
#fbc02d  ████████  PLANTILLA
#546e7a  ████████  OTRO

Estados
━━━━━━━━━━━━━━━━━━
#28a745  ████████  Activo
#dc3545  ████████  Inactivo / Eliminar

Neutrales
━━━━━━━━━━━━━━━━━━
#2d3436  ████████  Texto principal
#636e72  ████████  Texto secundario
#f8f9fa  ████████  Background general
#ffffff  ████████  Cards y modales
```

---

## ✅ Checklist de Funcionalidades

### Core

- [x] Modelo de datos completo
- [x] Servicio con CRUD
- [x] Mock data (5 documentos)
- [x] Conversión Base64
- [x] Funciones utilitarias
- [x] Tipado fuerte (TypeScript)

### UI/UX

- [x] Componente principal con tabla
- [x] Paginación y ordenamiento
- [x] Filtros de búsqueda
- [x] Modal crear/editar
- [x] Visor de PDF
- [x] Confirmación de eliminación
- [x] Loading states
- [x] Error handling
- [x] Responsive design
- [x] Snackbar notifications

### Validaciones

- [x] Solo archivos PDF
- [x] Tamaño máximo (10 MB)
- [x] Campos requeridos
- [x] Longitud de textos
- [x] Caracteres permitidos

### Documentación

- [x] README del módulo
- [x] Resumen ejecutivo
- [x] Estructura visual
- [x] Comentarios en código
- [x] Guía de integración

---

**🎉 MÓDULO 100% COMPLETO Y FUNCIONAL 🎉**

Este archivo proporciona una visión completa de la estructura, flujos y componentes del módulo de Gestión de Documentos PDF.
