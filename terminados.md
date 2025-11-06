# Relación de menús y páginas del sistema

| Módulo / Página              | URL                            | Estado       | Notas                                 |
| ---------------------------- | ------------------------------ | ------------ | ------------------------------------- |
| **Dashboard**                | /dashboard                     | ✅ Terminado |                                       |
| **Catalogos**                | /catalogos                     |              |                                       |
| ├── Listado                  | /catalogos/categorias          | ✅ Terminado |                                       |
| ├── Tipos Evento             | /catalogos/tipos-evento        | ✅ Terminado |                                       |
| ├── Productos servicios      | /catalogos/productos-servicios | ✅ Terminado |                                       |
| ├── Paquetes                 | /catalogos/paquetes            | ✅ Terminado | Las imagenes estan rotas o no existen |
| ├── Salones                  | /catalogos/salones             | ✅ Terminado |                                       |
| └── Tipos Mobiliario         | /catalogos/tipos-mobiliario    | ✅ Terminado |                                       |
| **Clientes**                 |                                |              |                                       |
| ├── Listado de clientes      | /clientes/lista                | ✅ Terminado |                                       |
| ├── Direcciones              | /clientes/direcciones          | ✅ Terminado |                                       |
| ├── Contactos Frecuentes     | /clientes/contactos-frecuentes | ✅ Terminado |                                       |
| └── Hitorial de Eventos      | /clientes/historial-eventos    | ✅ Terminado |                                       |
| **Cotizaciones**             |                                |              |                                       |
| ├── Nueva                    | /cotizaciones/nueva            | ✅ Terminado | Solo es una copia de /ventas/notas    |
| ├── Listado                  | /cotizaciones/listado          | ✅ Terminado |                                       |
| └── Seguimiento              | /cotizaciones/seguimiento      | ✅ Terminado |                                       |
| ├── **Ventas**               |                                |              |                                       |
| ├── Notas                    | /ventas/notas                  | ✅ Terminado |                                       |
| └── Facturación              | /ventas/facturacion            | ✅ Terminado |                                       |
| **Eventos**                  |                                |              |                                       |
| ├── Tabla lista de Eventos   | /eventos                       | ✅ Terminado |                                       |
| └── Pagina de un Evento      | /eventos/:folioEvento          | ✅ Terminado |                                       |
| ├── Lista de Eventos         | /eventos/lista                 | ✅ Terminado |                                       |
| ├── Nueva Nota               | /eventos/nueva                 | ✅ Terminado |                                       |
| ├── **Detalle de Evento**    |                                |              |                                       |
| ├── Informacion General      | /eventos/informacion-general   | ✅ Terminado |                                       |
| ├── Cronograma               | /eventos/cronograma            | ✅ Terminado |                                       |
| ├── Invitados                | /eventos/invitados             | ✅ Terminado |                                       |
| ├── Confirmaciones           | /eventos/confirmaciones        | ✅ Terminado |                                       |
| ├── Mobiliario y servicios   | /eventos/mobiliario-servicios  | ✅ Terminado |                                       |
| ├── Plano                    | /eventos/plano                 | ✅ Terminado |                                       |
| ├── Galería                  | /eventos/galeria               | ✅ Terminado |                                       |
| └── Observaciones            | /eventos/observaciones         | ✅ Terminado |                                       |
| **Calendario**               |                                |              |                                       |
| └── Calendario               | /calendario                    | ✅ Terminado |                                       |
| **Reportes**                 |                                |              |                                       |
| └── Reportes                 | /reportes                      | ✅ Terminado |                                       |
| **usuarios y configuracion** |                                |              |                                       |
| ├── usuarios                 | /usuarios/lista                | ✅ Terminado |                                       |
| ├── Roles y permisos         | /usuarios/roles-permisos       | ✅ Terminado |                                       |
| ├── perfil                   | /usuarios/perfil               | ✅ Terminado |                                       |
| └── configuracion            | /configuracion/general         | ✅ Terminado |                                       |
| **Mantenimiento**            |                                |              |                                       |
| └── Mantenimiento            | /mantenimiento                 | ✅ Terminado |                                       |

---

✅ **Módulos parcialmente completados:** Cotizaciones, Ventas
🕓 **Pendientes:** Dashboard, Seguimiento, Facturación, todo el módulo de Eventos
