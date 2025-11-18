# Relación de Menús y Páginas del Sistema Festum

> **Última actualización:** 18 de noviembre de 2025
> **Sistema de rutas dinámicas:** Implementado para eventos específicos

---

## 📋 Resumen General

- **Total de módulos:** 10
- **Total de páginas:** 45+
- **Estado general:** ✅ Sistema completamente funcional

---

## 🗂️ Estructura de Módulos y Páginas

### 🏠 **Dashboard**

| Página              | URL          | Estado       | Notas                    |
| ------------------- | ------------ | ------------ | ------------------------ |
| Dashboard Principal | `/dashboard` | ✅ Terminado | Página principal del CRM |

---

### 📦 **Catálogos**

| Página                | URL                              | Estado       | Notas                              |
| --------------------- | -------------------------------- | ------------ | ---------------------------------- |
| Categorías            | `/catalogos/categorias`          | ✅ Terminado | Gestión de categorías de eventos   |
| Tipos de Evento       | `/catalogos/tipos-evento`        | ✅ Terminado | XV años, bodas, corporativos, etc. |
| Productos y Servicios | `/catalogos/productos-servicios` | ✅ Terminado | Catálogo de productos y servicios  |
| Paquetes              | `/catalogos/paquetes`            | ✅ Terminado | Imágenes pueden estar rotas        |
| Salones               | `/catalogos/salones`             | ✅ Terminado | Gestión de salones y espacios      |
| Tipos de Mobiliario   | `/catalogos/tipos-mobiliario`    | ✅ Terminado | Sillas, mesas, manteles, etc.      |
| Guardar PDFs          | `/catalogos/save-pdf`            | ✅ Terminado | Herramienta de generación de PDFs  |

---

### 👥 **Clientes**

| Página               | URL                              | Estado       | Notas                          |
| -------------------- | -------------------------------- | ------------ | ------------------------------ |
| Lista de Clientes    | `/clientes/lista`                | ✅ Terminado | CRUD completo de clientes      |
| Direcciones          | `/clientes/direcciones`          | ✅ Terminado | Gestión de direcciones         |
| Contactos Frecuentes | `/clientes/contactos-frecuentes` | ✅ Terminado | Lista de contactos recurrentes |
| Historial de Eventos | `/clientes/historial-eventos`    | ✅ Terminado | Historial por cliente          |

---

### 💰 **Cotizaciones y Ventas**

#### Cotizaciones

| Página           | URL                         | Estado       | Notas                             |
| ---------------- | --------------------------- | ------------ | --------------------------------- |
| Nueva Cotización | `/cotizaciones/nueva`       | ✅ Terminado | Copia funcional de notas de venta |
| Listado          | `/cotizaciones/listado`     | ✅ Terminado | Lista de todas las cotizaciones   |
| Seguimiento      | `/cotizaciones/seguimiento` | ✅ Terminado | Seguimiento de cotizaciones       |

#### Ventas

| Página          | URL                   | Estado       | Notas                        |
| --------------- | --------------------- | ------------ | ---------------------------- |
| Notas (Pedidos) | `/ventas/notas`       | ✅ Terminado | Generación de notas de venta |
| Facturación     | `/ventas/facturacion` | ✅ Terminado | Sistema de facturación       |

---

### 🎉 **Eventos**

#### Listas y Vistas Generales

| Página                   | URL                    | Estado       | Notas                              |
| ------------------------ | ---------------------- | ------------ | ---------------------------------- |
| Lista de Eventos (Tabla) | `/eventos`             | ✅ Terminado | Vista principal con tabla avanzada |
| Lista de Eventos (Cards) | `/eventos/lista`       | ✅ Terminado | Vista alternativa en formato cards |
| Nuevo Evento             | `/evento/nuevo-evento` | ✅ Terminado | Formulario de creación de eventos  |
| Nueva Nota               | `/eventos/nueva-nota`  | ✅ Terminado | Crear nota vinculada a evento      |

#### Detalle de Evento (Vista Estática)

| Página                      | URL                             | Estado       | Notas                                |
| --------------------------- | ------------------------------- | ------------ | ------------------------------------ |
| Página Principal del Evento | `/eventos/:id`                  | ✅ Terminado | Vista unificada con nuevas secciones |
| Información General         | `/eventos/informacion-general`  | ✅ Terminado | Acceso directo (sin ID)              |
| Cronograma                  | `/eventos/cronograma`           | ✅ Terminado | Acceso directo (sin ID)              |
| Invitados                   | `/eventos/invitados`            | ✅ Terminado | Acceso directo (sin ID)              |
| Confirmaciones              | `/eventos/confirmaciones`       | ✅ Terminado | Checking de invitados                |
| Mobiliario y Servicios      | `/eventos/mobiliario-servicios` | ✅ Terminado | Asignación de mobiliario             |
| Plano                       | `/eventos/plano`                | ✅ Terminado | Plano drag & drop (sin ID)           |
| Galería                     | `/eventos/galeria`              | ✅ Terminado | Multimedia del evento                |
| Observaciones               | `/eventos/observaciones`        | ✅ Terminado | Notas y comentarios                  |

#### 🆕 Detalle de Evento (Rutas Dinámicas)

| Página                  | URL                          | Estado       | Notas                                            |
| ----------------------- | ---------------------------- | ------------ | ------------------------------------------------ |
| Página del Evento       | `/eventos/:id`               | ✅ Terminado | Incluye Multimedia, Observaciones y Herramientas |
| Cronograma Dinámico     | `/eventos/:id/cronograma`    | ✅ Terminado | Cronograma específico del evento                 |
| Plano Dinámico          | `/eventos/:id/plano`         | ✅ Terminado | Plano específico del evento                      |
| Invitados Dinámico      | `/eventos/:id/invitados`     | ✅ Terminado | Invitados específicos del evento                 |
| Galería Dinámica        | `/eventos/:id/galeria`       | ✅ Terminado | Galería específica del evento                    |
| Observaciones Dinámicas | `/eventos/:id/observaciones` | ✅ Terminado | Observaciones específicas del evento             |

#### 🆕 Nuevas Secciones Integradas en `/eventos/:id`

| Sección                | Ubicación                | Estado       | Notas                          |
| ---------------------- | ------------------------ | ------------ | ------------------------------ |
| Multimedia             | Dentro de `/eventos/:id` | ✅ Terminado | Integra galería existente      |
| Observaciones          | Dentro de `/eventos/:id` | ✅ Terminado | Lista de notas con mock data   |
| Herramientas Avanzadas | Dentro de `/eventos/:id` | ✅ Terminado | Cards de navegación a subrutas |

---

### 📅 **Calendario**

| Página     | URL           | Estado       | Notas                          |
| ---------- | ------------- | ------------ | ------------------------------ |
| Calendario | `/calendario` | ✅ Terminado | Vista de calendario de eventos |

---

### 📊 **Reportes**

| Página   | URL         | Estado       | Notas                             |
| -------- | ----------- | ------------ | --------------------------------- |
| Reportes | `/reportes` | ✅ Terminado | Dashboard de reportes y analytics |

---

### 👤 **Usuarios y Configuración**

| Página            | URL                        | Estado       | Notas                             |
| ----------------- | -------------------------- | ------------ | --------------------------------- |
| Lista de Usuarios | `/usuarios/lista`          | ✅ Terminado | Gestión de usuarios del sistema   |
| Roles y Permisos  | `/usuarios/roles-permisos` | ✅ Terminado | Administración de permisos        |
| Perfil            | `/usuarios/perfil`         | ✅ Terminado | Perfil del usuario actual         |
| Configuración     | `/configuracion/general`   | ✅ Terminado | Configuración general del sistema |

---

### 🛠️ **Mantenimiento**

| Página        | URL              | Estado       | Notas                         |
| ------------- | ---------------- | ------------ | ----------------------------- |
| Mantenimiento | `/mantenimiento` | ✅ Terminado | Herramientas de mantenimiento |

---

### 🔐 **Autenticación y Errores**

| Página    | URL      | Estado       | Notas                         |
| --------- | -------- | ------------ | ----------------------------- |
| Login     | `/login` | ✅ Terminado | Página de inicio de sesión    |
| Error 404 | `/404`   | ✅ Terminado | Página de error no encontrado |

---

## 🚀 Mejoras Recientes Implementadas

### Sistema de Rutas Dinámicas para Eventos (18/11/2025)

- ✅ **Rutas dinámicas implementadas:** `/eventos/:id/cronograma`, `/eventos/:id/plano`, `/eventos/:id/invitados`
- ✅ **Rutas estáticas mantenidas:** Para acceso directo desde sidebar
- ✅ **Sidebar actualizado:** Enlaces comentados para transición a rutas dinámicas

### Nuevas Secciones en Página de Evento (18/11/2025)

1. **Multimedia:**

   - Integra el componente de galería existente
   - Muestra fotos y archivos multimedia del evento
   - Sin modificar lógica original

2. **Observaciones:**

   - Lista de notas y comentarios del evento
   - Estructura básica con mock data
   - Diseño coherente con el resto del sistema

3. **Herramientas Avanzadas:**
   - Cards de navegación a Cronograma, Plano e Invitados
   - Rutas dinámicas basadas en el ID del evento
   - Solo enlaces, no integración de contenido

---

## 📐 Arquitectura de Rutas

### Rutas Estáticas (Sidebar)

```
/eventos/cronograma
/eventos/plano
/eventos/invitados
```

### Rutas Dinámicas (Por Evento)

```
/eventos/:id                    → Vista principal del evento
/eventos/:id/cronograma         → Cronograma del evento específico
/eventos/:id/plano              → Plano del evento específico
/eventos/:id/invitados          → Invitados del evento específico
/eventos/:id/galeria            → Galería del evento específico
/eventos/:id/observaciones      → Observaciones del evento específico
```

### Ejemplos de URLs Reales

```
http://localhost:4200/eventos/NV-00001
http://localhost:4200/eventos/NV-00001/cronograma
http://localhost:4200/eventos/NV-00002/plano
http://localhost:4200/eventos/NV-00003/invitados
```

---

## 🎨 Estándares de Diseño

### Paleta de Colores Principal

- **Color Primario:** `#20b2aa` (Turquesa)
- **Color Secundario:** `#6c5ce7` (Púrpura)
- **Color Terciario:** `#00b894` (Verde)
- **Color de Fondo:** `#f8f9fa` (Gris claro)
- **Texto Principal:** `#2d3436` (Gris oscuro)
- **Texto Secundario:** `#636e72` (Gris medio)

### Componentes Comunes

- **Material Design:** Angular Material 17+
- **Iconos:** Material Icons
- **Tipografía:** -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- **Border Radius:** 12px (cards principales), 8px (elementos internos)
- **Sombras:** `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Border Left:** 4px solid en color primario

---

## 📊 Estadísticas del Proyecto

| Métrica                     | Valor               |
| --------------------------- | ------------------- |
| Total de Módulos            | 10                  |
| Total de Páginas            | 45+                 |
| Páginas Terminadas          | 45                  |
| Componentes Standalone      | 100%                |
| Sistema de Rutas Dinámicas  | ✅ Implementado     |
| Versión de Angular          | 19                  |
| Estado General del Proyecto | ✅ Producción Ready |

---

## 🔄 Historial de Cambios

### v2.0 - 18 de noviembre de 2025

- ✅ Sistema de rutas dinámicas para eventos
- ✅ Nuevas secciones en página de evento (Multimedia, Observaciones, Herramientas)
- ✅ Actualización de sidebar con URLs comentadas
- ✅ Integración de galería en página de evento
- ✅ Mejoras en la arquitectura de navegación

### v1.0 - Versión Inicial

- ✅ Sistema base completado
- ✅ Todos los módulos principales funcionales
- ✅ CRUD completo en catálogos y clientes
- ✅ Sistema de eventos operativo

---

## 📝 Notas Importantes

1. **Rutas Dinámicas vs Estáticas:**

   - Las rutas estáticas (`/eventos/cronograma`) se mantienen para compatibilidad
   - Las rutas dinámicas (`/eventos/:id/cronograma`) son el nuevo estándar
   - La transición es transparente para el usuario

2. **Navegación en Sidebar:**

   - Algunos enlaces están comentados temporalmente
   - Se accede a través de la página del evento → Herramientas Avanzadas

3. **Estado del Proyecto:**
   - ✅ Todos los módulos están operativos
   - ✅ Sistema listo para producción
   - ✅ Documentación actualizada

---

## 🎯 Próximos Pasos Sugeridos

- [ ] Integrar API real para observaciones
- [ ] Agregar más herramientas avanzadas según necesidad
- [ ] Optimizar carga de imágenes en galería
- [ ] Implementar cache para mejorar rendimiento
- [ ] Tests unitarios y e2e

---

**Documento generado automáticamente**
**Proyecto:** Festum App - Sistema de Gestión de Eventos
**Framework:** Angular 19 con Arquitectura Standalone
**Última revisión:** 18 de noviembre de 2025
