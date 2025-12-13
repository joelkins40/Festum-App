import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () =>
			import('./components/auth/login/login.component').then(
				(m) => m.LoginComponent,
			),
	},
	{
		path: '',
		loadComponent: () =>
			import('./core/layout/layout.component').then((m) => m.LayoutComponent),
		children: [
			{
				path: 'dashboard',
				loadComponent: () =>
					import('./components/home/home.component').then(
						(m) => m.HomeComponent,
					),
			},

			// Catálogos
			{
				path: 'catalogos/categorias',
				loadComponent: () =>
					import('./modules/catalogos/categorias/categorias.component').then(
						(m) => m.CategoriasComponent,
					),
			},
			{
				path: 'catalogos/tipos-evento',
				loadComponent: () =>
					import(
						'./modules/catalogos/tipos-evento/tipo-eventos.component'
					).then((m) => m.TipoEventosComponent),
			},
			{
				path: 'catalogos/productos-servicios',
				loadComponent: () =>
					import(
						'./modules/catalogos/productos-servicios/productos-servicios.component'
					).then((m) => m.ProductosServiciosComponent),
			},
			{
				path: 'catalogos/paquetes',
				loadComponent: () =>
					import('./modules/catalogos/paquetes/paquetes.component').then(
						(m) => m.PaquetesComponent,
					),
			},
			{
				path: 'catalogos/salones',
				loadComponent: () =>
					import('./modules/catalogos/salones/salones.component').then(
						(m) => m.SalonesComponent,
					),
			},
			{
				path: 'catalogos/salones/:id',
				loadComponent: () =>
					import(
						'./modules/catalogos/salones/plano-salones/plano-salones.component'
					).then((m) => m.PlanoSalonesComponent),
			},
			{
				path: 'catalogos/tipos-mobiliario',
				loadComponent: () =>
					import(
						'./modules/catalogos/tipos-mobiliario/tipos-mobiliario.component'
					).then((m) => m.TiposMobiliarioComponent),
			},
			{
				path: 'catalogos/save-pdf',
				loadComponent: () =>
					import('./modules/catalogos/save-pdf/save-pdf.component').then(
						(m) => m.SavePdfComponent,
					),
			},
			// src/app/modules/catalogos/save-pdf/save-pdf.component.ts

			// Clientes
			{
				path: 'clientes',
				loadComponent: () =>
					import('./modules/clientes/lista-clientes/lista-clientes.component').then(
						(m) => m.ListaComponent,
					),
			},
			// Vistas globales (acceso opcional desde sidebar)
			{
				path: 'clientes/todas-direcciones',
				loadComponent: () =>
					import('./modules/clientes/direcciones/direcciones.component').then(
						(m) => m.DireccionesComponent,
					),
			},
			{
				path: 'clientes/todos-contactos',
				loadComponent: () =>
					import(
						'./modules/clientes/contactos-frecuentes/contactos-frecuentes.component'
					).then((m) => m.ContactosFrecuentesComponent),
			},
			{
				path: 'clientes/todos-historiales',
				loadComponent: () =>
					import(
						'./modules/clientes/historial-eventos/historial-eventos.component'
					).then((m) => m.HistorialEventosComponent),
			},
			// Ruta dinámica para detalle de cliente
			{
				path: 'clientes/:id',
				loadComponent: () =>
					import('./modules/clientes/cliente-detalle/cliente-detalle.component').then(
						(m) => m.ClienteDetalleComponent,
					),
			},

			// Cotizaciones
			{
				path: 'cotizaciones/nueva-cotizacion',
				loadComponent: () =>
					import('./modules/cotizaciones/nueva-cotizacion/nueva-cotizacion.component').then(
						(m) => m.NuevaCotizacionComponent,
					),
			},
			{
				path: 'cotizaciones/listado',
				loadComponent: () =>
					import('./modules/cotizaciones/listado/listado.component').then(
						(m) => m.ListadoComponent,
					),
			},
			{
				path: 'cotizaciones/seguimiento',
				loadComponent: () =>
					import(
						'./modules/cotizaciones/seguimiento/seguimiento.component'
					).then((m) => m.SeguimientoComponent),
			},

			// Ventas
			{
				path: 'ventas/nota-venta',
				loadComponent: () =>
					import('./modules/ventas/nota-venta/nota-venta.component').then(
						(m) => m.NotasComponent,
					),
			},
			{
				path: 'ventas/facturacion',
				loadComponent: () =>
					import('./modules/ventas/facturacion/facturacion.component').then(
						(m) => m.FacturacionComponent,
					),
			},

			// Eventos
			{
				path: 'eventos',
				loadComponent: () =>
					import('./modules/eventos/lista-tabla/lista-tabla.component').then(
						(m) => m.ListaTablaComponent,
					),
			},
			// Ruta para mobiliario-servicios (acceso directo desde sidebar)
			{
				path: 'eventos/mobiliario-servicios',
				loadComponent: () =>
					import(
						'./modules/eventos/mobiliario-servicios/mobiliario-servicios.component'
					).then((m) => m.MobiliarioServiciosComponent),
			},
			// Rutas dinámicas para eventos específicos
			{
				path: 'eventos/:id',
				loadComponent: () =>
					import('./modules/eventos/evento-detalle/evento-detalle.component').then(
						(m) => m.EventoDetalleComponent,
					),
			},
			{
				path: 'eventos/:id/cronograma',
				loadComponent: () =>
					import('./modules/eventos/cronograma/cronograma.component').then(
						(m) => m.CronogramaComponent,
					),
			},
			{
				path: 'eventos/:id/plano',
				loadComponent: () =>
					import('./modules/eventos/plano/plano.component').then(
						(m) => m.PlanoComponent,
					),
			},
			{
				path: 'eventos/:id/invitados',
				loadComponent: () =>
					import('./modules/eventos/invitados/invitados.component').then(
						(m) => m.InvitadosComponent,
					),
			},
			{
				path: 'eventos/:id/galeria',
				loadComponent: () =>
					import('./modules/eventos/galeria/galeria.component').then(
						(m) => m.GaleriaComponent,
					),
			},
			{
				path: 'eventos/:id/observaciones',
				loadComponent: () =>
					import(
						'./modules/eventos/observaciones/observaciones.component'
					).then((m) => m.ObservacionesComponent),
			},
			// Ruta para crear un nuevo evento
			{
				path: 'evento/nuevo-evento',
				loadComponent: () =>
					import('./modules/eventos/nuevo-evento/nuevo-evento.component').then(
						(m) => m.NuevoEventoComponent,
					),
			},

			// Otros módulos
			{
				path: 'calendario',
				loadComponent: () =>
					import('./modules/calendario/calendario/calendario.component').then(
						(m) => m.CalendarioComponent,
					),
			},
			{
				path: 'reportes',
				loadComponent: () =>
					import('./modules/reportes/reportes/reportes.component').then(
						(m) => m.ReportesComponent,
					),
			},

			// Usuarios
			{
				path: 'usuarios/lista',
				loadComponent: () =>
					import('./modules/usuarios/lista/lista.component').then(
						(m) => m.ListaComponent,
					),
			},
			{
				path: 'usuarios/roles-permisos',
				loadComponent: () =>
					import(
						'./modules/usuarios/roles-permisos/roles-permisos.component'
					).then((m) => m.RolesPermisosComponent),
			},
			{
				path: 'usuarios/perfil',
				loadComponent: () =>
					import('./modules/usuarios/perfil/perfil.component').then(
						(m) => m.PerfilComponent,
					),
			},

			// Configuración
			{
				path: 'configuracion/general',
				loadComponent: () =>
					import('./modules/configuracion/general/general.component').then(
						(m) => m.GeneralComponent,
					),
			},

			// Mantenimiento
			{
				path: 'mantenimiento',
				loadComponent: () =>
					import(
						'./modules/mantenimiento/mantenimiento/mantenimiento.component'
					).then((m) => m.MantenimientoComponent),
			},
			{
				path: '',
				redirectTo: '/dashboard',
				pathMatch: 'full',
			},
		],
	},
	{
		path: '404',
		loadComponent: () =>
			import('./components/error/error-404/error-404.component').then(
				(m) => m.Error404Component,
			),
	},
	{
		path: '**',
		redirectTo: '/404',
	},
];
