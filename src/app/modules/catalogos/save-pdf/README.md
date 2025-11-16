# 📄 Módulo de Gestión de Documentos PDF

## Descripción General

Módulo completo de CRUD para gestionar documentos PDF en el sistema Festum. Permite crear, leer, actualizar y eliminar documentos, con conversión a Base64 para almacenamiento y previsualización en tiempo real.

## 🎯 Características Principales

### ✅ Funcionalidades Implementadas

- **CRUD Completo**: Crear, leer, actualizar y eliminar documentos PDF
- **Conversión Base64**: Convierte archivos PDF a Base64 automáticamente
- **Previsualización**: Visor de PDF integrado en modal
- **Descarga de Documentos**: Permite descargar PDFs directamente
- **Filtros Avanzados**: Búsqueda por texto y tipo de documento
- **Validaciones**: Validación de tipo de archivo y tamaño (máx. 10 MB)
- **Tipos de Documento**: Categorización (Contrato, Cotización, Factura, etc.)
- **UI Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Simulación de API**: Mock data para desarrollo sin backend

## 📁 Estructura de Archivos

```
src/app/modules/catalogos/save-pdf/
├── save-pdf.component.ts          # Componente principal
├── save-pdf.component.html        # Template principal
├── save-pdf.component.scss        # Estilos principales
├── save-pdf.component.spec.ts     # Tests unitarios
│
├── documento-dialog/              # Modal crear/editar
│   ├── documento-dialog.component.ts
│   ├── documento-dialog.component.html
│   └── documento-dialog.component.scss
│
├── pdf-viewer/                    # Visor de PDF
│   ├── pdf-viewer.component.ts
│   ├── pdf-viewer.component.html
│   └── pdf-viewer.component.scss
│
└── README.md                      # Esta documentación

src/app/core/
├── models/
│   └── documento-pdf.model.ts     # Interfaces y tipos
│
└── services/
    └── documento-pdf.service.ts   # Servicio de datos
```

## 🚀 Uso del Módulo

### Importar el Componente en las Rutas

```typescript
// app.routes.ts
{
  path: 'catalogos/documentos-pdf',
  component: SavePdfComponent
}
```

### Uso Básico

El componente es standalone y puede usarse directamente:

```typescript
import { SavePdfComponent } from "./modules/catalogos/save-pdf/save-pdf.component";
```

## 🎨 Diseño y Estilo

### Colores Principales

- **Primary**: `#20b2aa` (Turquesa)
- **Accent**: Definido en tema de Angular Material
- **Background**: `#f8f9fa` (Gris claro)

### Componentes Material Utilizados

- MatTable con paginación y ordenamiento
- MatDialog para modales
- MatFormField para formularios
- MatChip para etiquetas de estado
- MatMenu para acciones contextuales
- MatSnackBar para notificaciones

## 📊 Tipos de Documento Soportados

| Tipo         | Descripción     | Icono             |
| ------------ | --------------- | ----------------- |
| CONTRATO     | Contrato        | description       |
| COTIZACION   | Cotización      | request_quote     |
| FACTURA      | Factura         | receipt           |
| RECIBO       | Recibo          | receipt_long      |
| ORDEN_COMPRA | Orden de Compra | shopping_cart     |
| MANUAL       | Manual          | menu_book         |
| PLANTILLA    | Plantilla       | article           |
| OTRO         | Otro            | insert_drive_file |

## 🔧 Funciones Utilitarias

### Modelo: `documento-pdf.model.ts`

```typescript
// Formatear tamaño de archivo
formatearTamano(bytes: number): string

// Validar que sea PDF
esPDF(nombreArchivo: string): boolean

// Convertir archivo a Base64
archivoABase64(file: File): Promise<string>

// Convertir Base64 a Blob
base64ABlob(base64: string): Blob

// Descargar PDF
descargarPDF(documento: DocumentoPdf): void
```

## 📡 Servicio: `documento-pdf.service.ts`

### Métodos Disponibles

```typescript
// Obtener todos los documentos
getDocumentos(filtros?: DocumentoPdfFiltros): Observable<DocumentoPdfResponse>

// Obtener documento por ID
getDocumentoById(id: number): Observable<DocumentoPdfResponse>

// Crear documento
crearDocumento(dto: CrearDocumentoPdfDto): Observable<DocumentoPdfResponse>

// Actualizar documento
actualizarDocumento(dto: ActualizarDocumentoPdfDto): Observable<DocumentoPdfResponse>

// Eliminar documento (soft delete)
eliminarDocumento(id: number): Observable<DocumentoPdfResponse>

// Toggle estado activo/inactivo
toggleEstado(id: number): Observable<DocumentoPdfResponse>

// Obtener estadísticas
getEstadisticas(): Observable<Statistics>
```

## 🔌 Integración con Backend

Actualmente el módulo funciona con datos mock. Para conectar con una API real:

### 1. Descomentar imports en el servicio

```typescript
// documento-pdf.service.ts
import { HttpClient, HttpParams } from "@angular/common/http";
import { ConfigService } from "./config.service";
```

### 2. Descomentar el constructor

```typescript
constructor(
  private http: HttpClient,
  private configService: ConfigService
) {
  this.API_URL = this.configService.getApiUrl('documentos-pdf');
}
```

### 3. Reemplazar implementaciones mock

Buscar comentarios `// 🔗 API real:` y descomentar el código HTTP correspondiente.

### 4. Endpoints Esperados

```
GET    /api/documentos-pdf              # Listar todos
GET    /api/documentos-pdf/:id          # Obtener uno
POST   /api/documentos-pdf              # Crear
PUT    /api/documentos-pdf/:id          # Actualizar
DELETE /api/documentos-pdf/:id          # Eliminar
PATCH  /api/documentos-pdf/:id/toggle   # Cambiar estado
```

## 📝 Interfaces Principales

### DocumentoPdf

```typescript
interface DocumentoPdf {
  id: number;
  nombre: string;
  descripcion?: string;
  nombreArchivo: string;
  tipoDocumento: TipoDocumento;
  archivoBase64: string;
  tamanoBytes: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  activo?: boolean;
  usuarioCreador?: string;
}
```

### CrearDocumentoPdfDto

```typescript
interface CrearDocumentoPdfDto {
  nombre: string;
  descripcion?: string;
  nombreArchivo: string;
  tipoDocumento: TipoDocumento;
  archivoBase64: string;
  tamanoBytes: number;
}
```

## 🎯 Validaciones

### Archivo PDF

- ✅ Solo archivos con extensión `.pdf`
- ✅ Tamaño máximo: 10 MB
- ✅ Conversión automática a Base64

### Formulario

- **Nombre**: 3-200 caracteres (requerido)
- **Descripción**: 0-500 caracteres (opcional)
- **Tipo**: Requerido (selección)
- **Archivo**: Requerido en creación, opcional en edición

## 🎨 Personalización de Estilos

Los estilos principales se encuentran en `save-pdf.component.scss`. Para cambiar colores:

```scss
// Color primario
$primary-color: #20b2aa;

// Color de hover
$hover-color: #1a9b94;

// Background
$bg-color: #f8f9fa;
```

## 🧪 Testing

```bash
# Ejecutar tests
ng test

# Ejecutar tests con cobertura
ng test --code-coverage
```

## 🚦 Estado del Módulo

- ✅ **Completado**: UI y funcionalidad CRUD
- ✅ **Completado**: Conversión Base64
- ✅ **Completado**: Visor de PDF
- ✅ **Completado**: Filtros y búsqueda
- ✅ **Completado**: Diseño responsive
- ⏳ **Pendiente**: Integración con backend real
- ⏳ **Pendiente**: Tests unitarios completos
- ⏳ **Pendiente**: Tests E2E

## 📚 Dependencias

- Angular 19
- Angular Material
- RxJS
- TypeScript

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. Seguir el patrón de diseño existente
2. Mantener coherencia visual con `catalogos/categorias`
3. Usar signals de Angular 19 cuando sea posible
4. Documentar cambios significativos
5. Actualizar este README si es necesario

## 📞 Soporte

Para dudas o problemas, contactar al equipo de desarrollo de Festum.

---

**Versión**: 1.0.0
**Última actualización**: 15 de noviembre de 2025
**Autor**: GitHub Copilot (Asistente IA)
