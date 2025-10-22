# 🎉 Festum Admin - Dashboard Administrativo

Un dashboard administrativo moderno construido con **Angular 19** y **Angular Material**, diseñado para la gestión de eventos y usuarios.

## 🚀 Características Principales

- ✅ **Arquitectura Moderna**: Standalone components con lazy loading
- 🎨 **Angular Material**: UI components profesionales
- 🌙 **Tema Oscuro/Claro**: Toggle persistente en localStorage
- 📱 **Diseño Responsivo**: Sidebar colapsable en dispositivos móviles
- 🔐 **Sistema de Autenticación**: Login demo funcional
- 📊 **Dashboard**: Estadísticas y métricas en tiempo real
- 👥 **Gestión de Usuarios**: CRUD completo con tabla interactiva
- ⚙️ **Configuración**: Panel de configuración del sistema
- 🚫 **Error 404**: Página de error personalizada

## 📂 Estructura del Proyecto

```
src/app/
├── core/
│   └── layout/
│       ├── layout.component.ts/html/scss
│       ├── sidebar/
│       │   └── sidebar.component.ts/html/scss
│       └── topbar/
│           └── topbar.component.ts/html/scss
├── components/
│   ├── dashboard/
│   │   └── dashboard.component.ts/html/scss
│   ├── usuarios/
│   │   └── usuarios.component.ts/html/scss
│   ├── configuracion/
│   │   └── configuracion.component.ts/html/scss
│   ├── auth/
│   │   └── login/
│   │       └── login.component.ts/html/scss
│   └── error/
│       └── error-404/
│           └── error-404.component.ts/html/scss
├── modules/          # Carpeta para futuros módulos
├── app.routes.ts     # Configuración de rutas con lazy loading
├── app.component.ts  # Componente principal
└── styles.scss       # Estilos globales y temas
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Angular CLI 19+

### Pasos de instalación

1. **Clonar o descargar el proyecto**
2. **Instalar dependencias** (ya están configuradas):
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm start
   # o
   ng serve
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:4200
   ```

## 🔑 Credenciales Demo

Para acceder al dashboard, usa las siguientes credenciales:

- **Email**: `admin@festum.com`
- **Contraseña**: `123456`

## 📱 Rutas Disponibles

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/login` | LoginComponent | Página de autenticación |
| `/dashboard` | DashboardComponent | Panel principal con estadísticas |
| `/usuarios` | UsuariosComponent | Gestión de usuarios con tabla |
| `/configuracion` | ConfiguracionComponent | Configuración del sistema |
| `/404` | Error404Component | Página de error no encontrado |
| `/**` | - | Redirige a 404 |

## 🎨 Características del UI

### Sidebar
- **Navegación intuitiva** con iconos Material
- **Menú colapsable** para dispositivos móviles
- **Links activos** con indicador visual
- **Botón de logout** en la parte inferior

### Topbar
- **Nombre del sistema** configurable
- **Toggle tema oscuro/claro** con persistencia
- **Menú de usuario** con dropdown
- **Botón de menú móvil** responsive

### Dashboard
- **Tarjetas de estadísticas** con iconos y colores
- **Actividad reciente** en tiempo real
- **Acciones rápidas** para tareas comunes
- **Diseño en grid** responsivo

### Gestión de Usuarios
- **Tabla Material** con datos mock
- **Chips de estado** (Activo/Inactivo)
- **Chips de rol** (Admin/Editor/Usuario)
- **Menú de acciones** (Editar/Eliminar/Toggle)
- **Botón agregar usuario**

### Configuración
- **Formularios reactivos** con validación
- **Configuración de tema e idioma**
- **Toggles para notificaciones**
- **Export/Import** de configuración
- **Persistencia en localStorage**

## 🌙 Sistema de Temas

El proyecto incluye un sistema completo de temas:

- **Tema Claro** (por defecto)
- **Tema Oscuro** con persistencia
- **Toggle en topbar** para cambiar
- **Variables CSS** para personalización
- **Soporte completo** en todos los componentes

## 📦 Dependencias Principales

- **@angular/core**: ^19.2.0
- **@angular/material**: ^19.2.19
- **@angular/cdk**: ^19.2.19
- **@angular/router**: ^19.2.0
- **@angular/forms**: ^19.2.0

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia servidor de desarrollo
ng serve           # Alternativa con Angular CLI

# Construcción
npm run build      # Build para producción
ng build          # Alternativa con Angular CLI

# Testing
npm test          # Ejecuta tests unitarios
ng test           # Alternativa con Angular CLI

# Linting
ng lint           # Análisis de código (si está configurado)
```

## 📈 Próximas Características

- 🔒 **Autenticación real** con JWT
- 🌐 **API REST** integración
- 📊 **Charts y gráficos** con Chart.js
- 🔔 **Notificaciones push** en tiempo real
- 🌍 **Internacionalización** (i18n)
- 📋 **Más módulos** de gestión
- 🎯 **PWA** capabilities

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ por el equipo de Festum

---

¿Necesitas ayuda? Abre un issue en el repositorio o contacta al equipo de desarrollo.