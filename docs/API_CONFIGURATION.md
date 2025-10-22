# 🔧 Configuración de APIs

Este documento explica las diferentes formas de configurar las URLs de las APIs en la aplicación Festum.

## 📁 Archivos de Configuración

### 1. Environments (`src/environments/`)
- `environment.ts` - Configuración para desarrollo
- `environment.prod.ts` - Configuración para producción

### 2. Proxy de Desarrollo (`proxy.conf.json`)
- Redirige las llamadas `/api/*` al servidor backend
- Solo se usa en modo desarrollo

### 3. Servicio de Configuración (`config.service.ts`)
- Centraliza todas las URLs de endpoints
- Proporciona métodos helper para construir URLs

## 🚀 Uso

### Opción 1: Environment Variables (Simple)
```typescript
import { environment } from '../../../environments/environment';

private readonly API_URL = `${environment.apiUrl}/categorias`;
```

### Opción 2: Config Service (Recomendado)
```typescript
import { ConfigService } from './config.service';

constructor(private configService: ConfigService) {
  this.API_URL = this.configService.getApiUrl('categorias');
}
```

### Opción 3: Proxy para desarrollo
1. Las APIs usan URLs relativas: `/api/categorias`
2. El proxy redirige automáticamente a `http://localhost:3000/api/categorias`
3. En producción se usa la URL absoluta

## 🔄 Configuración por Entorno

### Desarrollo (con proxy)
```typescript
// environment.ts
apiUrl: '/api'

// Resultado final: /api/categorias → http://localhost:3000/api/categorias
```

### Desarrollo (sin proxy)
```typescript
// environment.ts
apiUrl: 'http://localhost:3000/api'

// Resultado final: http://localhost:3000/api/categorias
```

### Producción
```typescript
// environment.prod.ts
apiUrl: 'https://api.festum.com/api'

// Resultado final: https://api.festum.com/api/categorias
```

## 🛠️ Comandos para Development Server

### Con proxy (recomendado)
```bash
ng serve
```

### Sin proxy (especificar URL completa en environment.ts)
```bash
ng serve --configuration development
```

### Para producción
```bash
ng serve --configuration production
```

## 📋 Lista de Endpoints Configurados

Los siguientes endpoints están configurados en `ConfigService`:

- `/categorias` - Gestión de categorías
- `/tipos-evento` - Tipos de eventos
- `/eventos` - Eventos
- `/clientes` - Clientes
- `/proveedores` - Proveedores
- `/productos` - Productos
- `/servicios` - Servicios
- `/reservas` - Reservas
- `/facturacion` - Facturación
- `/reportes` - Reportes
- `/usuarios` - Usuarios
- `/auth` - Autenticación

## 🔑 Agregar Nuevos Endpoints

1. **En ConfigService:**
```typescript
private readonly endpoints = {
  // ... endpoints existentes
  nuevoEndpoint: '/nuevo-endpoint'
};
```

2. **En el servicio:**
```typescript
private readonly API_URL = this.configService.getApiUrl('nuevoEndpoint');
```

## 🌐 CORS y Headers

El archivo `proxy.conf.json` incluye configuración para CORS:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization`

## 🐛 Troubleshooting

### Error: Cannot connect to API
1. Verificar que el servidor backend esté corriendo en el puerto correcto
2. Revisar la configuración en `environment.ts`
3. Verificar que el proxy esté configurado correctamente en `angular.json`

### Error: CORS
1. Verificar configuración en `proxy.conf.json`
2. Asegurar que el backend permita CORS desde el origen de Angular

### URLs incorrectas
1. Verificar `ConfigService.getAllEndpoints()` para debug
2. Revisar que el environment correcto esté siendo usado
3. Verificar la configuración del proxy en `angular.json`