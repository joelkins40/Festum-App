# 🎉 Festum App - Proyecto Festum 2.0

Sistema integral de gestión para eventos y servicios, desarrollado con **Angular 19** y **Material Design**.

## ✨ Características

- 🎨 **Interfaz Moderna**: Diseño consistente con Material Design
- 📱 **Responsive**: Adaptable a dispositivos móviles y tablets
- 🔧 **TypeScript**: Desarrollo con tipado estricto
- 📊 **CRUD Completo**: Gestión de productos, servicios y categorías
- 🎯 **Modular**: Arquitectura organizada por módulos

## 🚀 Inicio Rápido

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo local:

```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente al modificar archivos.

### Construcción

Para construir el proyecto:

```bash
ng build
```

Los artefactos se almacenarán en el directorio `dist/`.

## 📁 Estructura del Proyecto

```
src/app/
├── core/                    # Servicios y modelos base
├── modules/                 # Módulos funcionales
│   ├── catalogos/          # Gestión de catálogos
│   │   ├── categorias/     # ✅ Categorías
│   │   └── productos-servicios/ # ✅ Productos y Servicios
│   ├── clientes/           # Gestión de clientes
│   ├── eventos/            # Gestión de eventos
│   └── cotizaciones/       # Sistema de cotizaciones
└── shared/                 # Componentes compartidos
```

## 🛠️ Tecnologías

- **Angular 17** - Framework principal
- **Material Design** - Sistema de diseño
- **TypeScript** - Lenguaje de desarrollo
- **SCSS** - Preprocesador CSS
- **RxJS** - Programación reactiva

## 📋 Pruebas

### Pruebas Unitarias

```bash
ng test
```

### Pruebas E2E

```bash
ng e2e
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**Joel Kins** - joel.kins40@gmail.com

---

Generado con ❤️ usando [Angular CLI](https://github.com/angular/angular-cli) version 19.2.17.
