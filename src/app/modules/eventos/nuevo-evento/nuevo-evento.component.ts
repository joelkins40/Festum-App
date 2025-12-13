import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { Observable, map, startWith } from 'rxjs';

import { NuevaNotaService } from '../../../core/services/nuevo-evento.service';
import { ListaEventosService } from '../../../core/services/lista-eventos-tabla.service';
import { ProductoSelectorDialogComponent } from './producto-selector-dialog/producto-selector-dialog.component';

import {
	ProductoNota,
	TipoLugar,
	CreateNotaDto,
} from '../../../core/models/nota.model';
import { Cliente } from '../../../core/models/cliente.model';
import { ClientesService } from '../../../core/services/clientes.service';
import { ProductosServiciosService } from '../../../core/services/productos-servicios.service';
import { ProductoServicio } from '../../../core/models/productos-servicios.model';
import { PlanoViewComponent } from '../../../shared/components/plano-view/plano-view.component';
import type {
	ElementItem,
	Product,
} from '../../../shared/components/plano-view/types';
import {
	PlantillasService,
	PlantillaEvento,
} from '../../../core/services/plantillas.service';
import { ButtonComponent } from "../../../shared/components/button";
import { ButtonIconComponent } from '../../../shared/components/button-icon';

@Component({
	selector: 'app-nueva-nota',
	standalone: true,
	imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatRadioModule,
    PlanoViewComponent,
    ButtonComponent,
    ButtonIconComponent
],
	templateUrl: './nuevo-evento.component.html',
	styleUrl: './nuevo-evento.component.scss',
})
export class NuevoEventoComponent implements OnInit {
	private fb = inject(FormBuilder);
	private nuevaNotaService = inject(NuevaNotaService);
	private eventosService = inject(ListaEventosService);
	private clientesService = inject(ClientesService);
	private productosService = inject(ProductosServiciosService);
	private plantillasService = inject(PlantillasService);
	private snackBar = inject(MatSnackBar);
	private dialog = inject(MatDialog);
	private router = inject(Router);

	// Form principal
	notaForm = this.fb.group({
		folio: ['', Validators.required],
		fechaRecepcion: [new Date(), Validators.required],
		fechaRegreso: [new Date(), Validators.required],
		nombreEvento: ['', [Validators.required, Validators.minLength(3)]],
		cliente: [null as Cliente | null, Validators.required],
		clienteBusqueda: [''],
		tipoLugar: [TipoLugar.DIRECCION_CLIENTE, Validators.required],
		direccionCliente: [''],
		salon: [null],
		nuevaDireccionCalle: [''],
		nuevaDireccionNumero: [''],
		nuevaDireccionColonia: [''],
		nuevaDireccionCiudad: [''],
		nuevaDireccionEstado: [''],
		nuevaDireccionCP: [''],
		observaciones: [''],
	});

	// Datos
	clientes: Cliente[] = [];
	clientesFiltrados$!: Observable<Cliente[]>;
	productosDisponibles: ProductoServicio[] = [];
	productosEnNota: ProductoNota[] = [];
	filteredProductosEnNota: ProductoNota[] = [];
	searchQuery = '';

	// Columnas de la tabla
	displayedColumns: string[] = [
		'nombre',
		'descripcion',
		'cantidad',
		'precioUnitario',
		'subtotal',
		'actions',
	];

	// Cálculos
	subtotal = 0;
	iva = 0;
	total = 0;

	// Estado
	clienteSeleccionado: Cliente | null = null;
	esClienteEspecial = false;

	// Plano view
	planoElements: ElementItem[] = [];
	selectedProductForPlano?: Product;
	selectedProductsOnly: ProductoNota[] = [];

	// Plantillas
	plantillasDisponibles: PlantillaEvento[] = [];
	plantillaSeleccionada: PlantillaEvento | null = null;
	showTemplatePreview = false;

	ngOnInit(): void {
		this.initializeFolio();
		this.loadClientes();
		this.loadProductos();
		this.loadPlantillas();
		this.setupClienteAutocomplete();
		this.setupLugarValidation();
		this.filteredProductosEnNota = this.productosEnNota;
	}

	initializeFolio(): void {
		const folio = this.nuevaNotaService.generarFolio();
		this.notaForm.patchValue({ folio });
	}

	loadClientes(): void {
		this.clientesService.getClientes().subscribe({
			next: (response) => {
				if (response.success && Array.isArray(response.data)) {
					this.clientes = response.data;
				}
			},
			error: () => {
				this.showMessage('Error al cargar clientes', 'error');
			},
		});
	}

	loadProductos(): void {
		this.productosService.getProductosServicios().subscribe({
			next: (response) => {
				if (response.success && Array.isArray(response.data)) {
					this.productosDisponibles = response.data.filter(
						(p: ProductoServicio) => p.activo !== false,
					);
				}
			},
			error: () => {
				this.showMessage('Error al cargar productos/servicios', 'error');
			},
		});
	}

	setupClienteAutocomplete(): void {
		const clienteBusquedaControl = this.notaForm.get('clienteBusqueda');
		if (clienteBusquedaControl) {
			this.clientesFiltrados$ = clienteBusquedaControl.valueChanges.pipe(
				startWith(''),
				map((value) => this.filterClientes(value ?? '')),
			);
		}
	}

	filterClientes(value: string): Cliente[] {
		const filterValue = value.toLowerCase();
		return this.clientes.filter((cliente) =>
			cliente.nombre.toLowerCase().includes(filterValue),
		);
	}

	onClienteSelected(cliente: Cliente): void {
		this.clienteSeleccionado = cliente;
		this.esClienteEspecial = cliente.clientePreferente;
		this.notaForm.patchValue({ cliente });

		// Si tiene direcciones, seleccionar la primera por defecto
		if (cliente.direcciones && cliente.direcciones.length > 0) {
			const direccion = cliente.direcciones[0].formatted;
			this.notaForm.patchValue({
				direccionCliente: `${direccion.line1}, ${direccion.line2}, ${direccion.line3}`,
			});
		}

		this.showMessage(
			`Cliente seleccionado${cliente.clientePreferente ? ' (Cliente Especial)' : ''}`,
			'success',
		);
	}

	displayCliente(cliente: Cliente | null): string {
		return cliente?.nombre ?? '';
	}

	setupLugarValidation(): void {
		this.notaForm.get('tipoLugar')?.valueChanges.subscribe((tipo) => {
			this.clearLugarValidators();

			if (tipo === TipoLugar.NUEVA_DIRECCION) {
				this.setNuevaDireccionValidators();
			} else if (tipo === TipoLugar.SALON) {
				this.notaForm.get('salon')?.setValidators([Validators.required]);
			}

			this.notaForm.get('salon')?.updateValueAndValidity();
		});
	}

	clearLugarValidators(): void {
		const camposDireccion = [
			'nuevaDireccionCalle',
			'nuevaDireccionNumero',
			'nuevaDireccionColonia',
			'nuevaDireccionCiudad',
			'nuevaDireccionEstado',
			'nuevaDireccionCP',
		];

		camposDireccion.forEach((campo) => {
			this.notaForm.get(campo)?.clearValidators();
			this.notaForm.get(campo)?.updateValueAndValidity();
		});

		this.notaForm.get('salon')?.clearValidators();
	}

	setNuevaDireccionValidators(): void {
		const camposDireccion = [
			'nuevaDireccionCalle',
			'nuevaDireccionNumero',
			'nuevaDireccionColonia',
			'nuevaDireccionCiudad',
			'nuevaDireccionEstado',
			'nuevaDireccionCP',
		];

		camposDireccion.forEach((campo) => {
			this.notaForm.get(campo)?.setValidators([Validators.required]);
			this.notaForm.get(campo)?.updateValueAndValidity();
		});
	}

	agregarProducto(producto: ProductoServicio): void {
		const precio = this.esClienteEspecial
			? producto.precioEspecial
			: producto.precioPublico;

		const productoNota: ProductoNota = {
			id: `temp-${Date.now()}-${Math.random()}`,
			productoServicioId: producto.id,
			tipo: producto.tipo,
			nombre: producto.nombre,
			descripcion: producto.descripcion || '',
			cantidad: 1,
			precioUnitario: precio || 0,
			subtotal: precio || 0,
		};

		this.productosEnNota = [...this.productosEnNota, productoNota];
		this.actualizarListaFiltrada();
		this.actualizarProductosSeleccionados();
		this.recalcularTotales();

		// Actualizar producto seleccionado para plano
		this.actualizarProductoParaPlano(productoNota);
	}

	abrirSelectorProductos(): void {
		const dialogRef = this.dialog.open(ProductoSelectorDialogComponent, {
			width: '800px',
			maxWidth: '90vw',
			maxHeight: '90vh',
			disableClose: false,
			autoFocus: true,
		});

		dialogRef
			.afterClosed()
			.subscribe((productosSeleccionados: ProductoNota[]) => {
				if (productosSeleccionados && productosSeleccionados.length > 0) {
					this.productosEnNota = [
						...this.productosEnNota,
						...productosSeleccionados,
					];
					this.actualizarListaFiltrada();
					this.actualizarProductosSeleccionados();
					this.recalcularTotales();
					this.showMessage(
						`Se agregaron ${productosSeleccionados.length} producto(s) correctamente`,
						'success',
					);
				}
			});
	}

	editarCantidad(producto: ProductoNota, nuevaCantidad: number): void {
		if (nuevaCantidad < 1) return;

		producto.cantidad = nuevaCantidad;
		producto.subtotal = producto.cantidad * producto.precioUnitario;
		this.actualizarListaFiltrada();
		this.recalcularTotales();
	}

	editarPrecio(producto: ProductoNota, nuevoPrecio: number): void {
		if (nuevoPrecio < 0) return;

		producto.precioUnitario = nuevoPrecio;
		producto.subtotal = producto.cantidad * producto.precioUnitario;
		this.actualizarListaFiltrada();
		this.recalcularTotales();
	}

	eliminarProducto(producto: ProductoNota): void {
		this.productosEnNota = this.productosEnNota.filter(
			(p) => p.id !== producto.id,
		);
		this.actualizarListaFiltrada();
		this.actualizarProductosSeleccionados();
		this.recalcularTotales();
		this.showMessage('Producto eliminado', 'success');
	}

	recalcularTotales(): void {
		this.subtotal = this.nuevaNotaService.calcularSubtotal(
			this.productosEnNota,
		);
		this.iva = this.nuevaNotaService.calcularIva(this.subtotal);
		this.total = this.nuevaNotaService.calcularTotal(this.subtotal, this.iva);
	}

	validarFormulario(): boolean {
		// Validar fechas
		const fechaRecepcion = this.notaForm.get('fechaRecepcion')?.value;
		const fechaRegreso = this.notaForm.get('fechaRegreso')?.value;

		if (
			fechaRecepcion &&
			fechaRegreso &&
			!this.nuevaNotaService.validarFechas(fechaRecepcion, fechaRegreso)
		) {
			this.showMessage(
				'La fecha de regreso debe ser mayor que la de recepción',
				'error',
			);
			return false;
		}

		// Validar que haya productos
		if (this.productosEnNota.length === 0) {
			this.showMessage('Debe agregar al menos un producto o servicio', 'error');
			return false;
		}

		// Validar formulario
		if (this.notaForm.invalid) {
			this.showMessage('Complete todos los campos requeridos', 'error');
			return false;
		}

		return true;
	}

	guardarNota(): void {
		if (!this.validarFormulario()) {
			return;
		}

		const formValue = this.notaForm.value;
		const tipoLugar = formValue.tipoLugar ?? TipoLugar.DIRECCION_CLIENTE;

		const dto: CreateNotaDto = {
			folio: formValue.folio ?? '',
			fechaRecepcion: formValue.fechaRecepcion ?? new Date(),
			fechaRegreso: formValue.fechaRegreso ?? new Date(),
			nombreEvento: formValue.nombreEvento ?? '',
			clienteId: this.clienteSeleccionado?.id ?? 0,
			lugar: this.construirLugar(
				tipoLugar,
				formValue,
			) as import('../../../core/models/nota.model').Lugar,
			productos: this.productosEnNota,
			subtotal: this.subtotal,
			iva: this.iva,
			total: this.total,
			observaciones: formValue.observaciones ?? undefined,
		};

		// Crear evento para la lista-tabla
		const direccionCliente = this.clienteSeleccionado?.direcciones?.[0];
		const eventoDto = {
			folio: formValue.folio ?? '',
			fechaRecepcion: formValue.fechaRecepcion ?? new Date(),
			fechaRegreso: formValue.fechaRegreso ?? new Date(),
			nombreEvento: formValue.nombreEvento ?? '',
			cliente: {
				id: this.clienteSeleccionado?.id ?? 0,
				nombre: this.clienteSeleccionado?.nombre ?? 'Cliente Desconocido',
				clienteEspecial: this.clienteSeleccionado?.clientePreferente ?? false,
				activo: this.clienteSeleccionado?.activo ?? true,
				direcciones: direccionCliente
					? [
							{
								fullAddress: `${direccionCliente.street} ${direccionCliente.number}`,
								city: direccionCliente.city,
								state: direccionCliente.state,
								country: direccionCliente.country,
								postalCode: direccionCliente.postalCode,
							},
						]
					: undefined,
			},
			lugar: {
				tipo: (tipoLugar === TipoLugar.DIRECCION_CLIENTE
					? 'direccionCliente'
					: tipoLugar === TipoLugar.NUEVA_DIRECCION
						? 'nuevaDireccion'
						: 'salonExistente') as
					| 'direccionCliente'
					| 'nuevaDireccion'
					| 'salonExistente',
				direccion: direccionCliente
					? {
							fullAddress: `${direccionCliente.street} ${direccionCliente.number}`,
							city: direccionCliente.city,
							state: direccionCliente.state,
							country: direccionCliente.country,
							postalCode: direccionCliente.postalCode,
						}
					: undefined,
			},
			productos: this.productosEnNota.map((p) => ({
				id: typeof p.id === 'string' ? 0 : p.id || 0,
				nombre: p.nombre,
				descripcion: p.descripcion,
				cantidad: p.cantidad,
				precioUnitario: p.precioUnitario,
				subtotal: p.subtotal,
				esServicio: p.tipo === 'Servicio',
			})),
			total: this.total,
		};

		// Guardar en NuevaNotaService (notas)
		this.nuevaNotaService.createNota(dto).subscribe({
			next: (response) => {
				if (response.success) {
					// Guardar también en ListaEventosService (eventos)
					this.eventosService.createEvento(eventoDto).subscribe({
						next: () => {
							this.showMessage('Evento guardado exitosamente', 'success');
							this.resetearFormulario();

							// Navegar a la lista de eventos
							this.router.navigate(['/eventos']);
						},
						error: () => {
							this.showMessage('Error al guardar en lista de eventos', 'error');
						},
					});
				} else {
					this.showMessage(
						response.message ?? 'Error al guardar nota',
						'error',
					);
				}
			},
			error: () => {
				this.showMessage('Error al guardar nota', 'error');
			},
		});
	}

	construirLugar(
		tipoLugar: TipoLugar,
		formValue: Partial<typeof this.notaForm.value>,
	): {
		tipo: TipoLugar;
		direccionCliente?: { line1: string; line2: string; line3: string };
		nuevaDireccion?: {
			calle: string;
			numero: string;
			colonia: string;
			ciudad: string;
			estado: string;
			codigoPostal: string;
		};
		salon?: unknown;
	} {
		const lugar: {
			tipo: TipoLugar;
			direccionCliente?: { line1: string; line2: string; line3: string };
			nuevaDireccion?: {
				calle: string;
				numero: string;
				colonia: string;
				ciudad: string;
				estado: string;
				codigoPostal: string;
			};
			salon?: unknown;
		} = { tipo: tipoLugar };

		if (tipoLugar === TipoLugar.DIRECCION_CLIENTE && this.clienteSeleccionado) {
			const direccion = this.clienteSeleccionado.direcciones[0]?.formatted;
			if (direccion) {
				lugar.direccionCliente = {
					line1: direccion.line1,
					line2: direccion.line2,
					line3: direccion.line3,
				};
			}
		} else if (tipoLugar === TipoLugar.NUEVA_DIRECCION) {
			lugar.nuevaDireccion = {
				calle: formValue.nuevaDireccionCalle ?? '',
				numero: formValue.nuevaDireccionNumero ?? '',
				colonia: formValue.nuevaDireccionColonia ?? '',
				ciudad: formValue.nuevaDireccionCiudad ?? '',
				estado: formValue.nuevaDireccionEstado ?? '',
				codigoPostal: formValue.nuevaDireccionCP ?? '',
			};
		} else if (tipoLugar === TipoLugar.SALON && formValue.salon) {
			lugar.salon = formValue.salon;
		}

		return lugar;
	}

	resetearFormulario(): void {
		this.notaForm.reset({
			tipoLugar: TipoLugar.DIRECCION_CLIENTE,
			fechaRecepcion: new Date(),
			fechaRegreso: new Date(),
		});
		this.productosEnNota = [];
		this.filteredProductosEnNota = [];
		this.selectedProductsOnly = [];
		this.searchQuery = '';
		this.clienteSeleccionado = null;
		this.esClienteEspecial = false;
		this.recalcularTotales();
		this.initializeFolio();
	}

	cancelar(): void {
		if (
			confirm(
				'¿Está seguro de que desea cancelar? Se perderán todos los cambios.',
			)
		) {
			this.resetearFormulario();
			this.showMessage('Operación cancelada', 'success');
		}
	}

	private showMessage(message: string, type: 'success' | 'error'): void {
		this.snackBar.open(message, 'Cerrar', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
		});
	}

	// Getters para template
	get tipoLugarEnum() {
		return TipoLugar;
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
		}).format(value);
	}

	onSearchProducto(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.searchQuery = input.value.toLowerCase().trim();
		this.actualizarListaFiltrada();
	}

	private actualizarListaFiltrada(): void {
		if (!this.searchQuery) {
			this.filteredProductosEnNota = [...this.productosEnNota];
		} else {
			this.filteredProductosEnNota = this.productosEnNota.filter((producto) =>
				producto.nombre.toLowerCase().includes(this.searchQuery),
			);
		}
	}

	private actualizarProductosSeleccionados(): void {
		this.selectedProductsOnly = this.productosEnNota.filter(
			(item) => item.tipo === 'Producto',
		);
		this.actualizarPlanoElements();
	}

	private actualizarPlanoElements(): void {
		this.planoElements = this.selectedProductsOnly.map((producto) => {
			// Buscar el producto original en productosDisponibles para obtener icono, color y tamaño
			const productoOriginal = this.productosDisponibles.find(
				(p) => p.id === producto.productoServicioId,
			);

			return {
				id: `producto_${producto.productoServicioId || producto.id}`,
				tipo: producto.tipo.toLowerCase(),
				nombre: producto.nombre,
				posicion: {
					x: 100 + Math.random() * 200,
					y: 100 + Math.random() * 200,
				},
				tamano: productoOriginal?.tamano || { ancho: 120, alto: 120 },
				color: productoOriginal?.color || '#20b2aa',
				icono: productoOriginal?.icono || 'inventory_2',
				rotacion: 0,
			};
		});
	}

	/**
	 * Actualiza el producto seleccionado para mostrarlo en el plano
	 */
	private actualizarProductoParaPlano(productoNota: ProductoNota): void {
		this.selectedProductForPlano = {
			id: productoNota.id,
			productoServicioId: productoNota.productoServicioId,
			tipo: productoNota.tipo,
			nombre: productoNota.nombre,
			descripcion: productoNota.descripcion,
			cantidad: productoNota.cantidad,
			precioUnitario: productoNota.precioUnitario,
			subtotal: productoNota.subtotal,
		};
	}

	loadPlantillas(): void {
		this.plantillasService.getPlantillas().subscribe({
			next: (plantillas) => {
				this.plantillasDisponibles = plantillas;
			},
			error: () => {
				this.showMessage('Error al cargar plantillas', 'error');
			},
		});
	}

	onPlantillaSelected(plantillaId: string): void {
		if (!plantillaId) {
			this.plantillaSeleccionada = null;
			this.showTemplatePreview = false;
			return;
		}

		this.plantillasService.getPlantillaById(plantillaId).subscribe({
			next: (plantilla) => {
				this.plantillaSeleccionada = plantilla || null;
				this.showTemplatePreview = !!plantilla;
			},
		});
	}

	confirmarAplicarPlantilla(): void {
		if (!this.plantillaSeleccionada) return;

		// const confirmacion = confirm(
		// 	`La plantilla "${this.plantillaSeleccionada.nombre}" reemplazará los productos actuales.\nLos servicios se conservarán intactos.\n¿Desea continuar?`,
		// );

    this.aplicarPlantilla(this.plantillaSeleccionada);
		// if (confirmacion) {
		// }
	}

	cancelarPlantilla(): void {
		this.plantillaSeleccionada = null;
		this.showTemplatePreview = false;
	}

	private aplicarPlantilla(plantilla: PlantillaEvento): void {
		// Preservar servicios existentes
		const serviciosExistentes = this.productosEnNota.filter(
			(item) => item.tipo === 'Servicio',
		);

		// Convertir elementos de plantilla a productos
		const productosDesdePlantilla = this.mapTemplateToProducts(plantilla);

		// Reemplazar productos manteniendo servicios
		this.productosEnNota = [...serviciosExistentes, ...productosDesdePlantilla];

		// Actualizar UI
		this.actualizarListaFiltrada();
		this.actualizarProductosSeleccionados();
		this.recalcularTotales();

		// Actualizar plano con elementos de la plantilla
		this.planoElements = plantilla.diseno.elementos.map((elem) => ({
			id: elem.id,
			tipo: elem.tipo,
			nombre: elem.nombre,
			posicion: elem.posicion,
			tamano: elem.tamano,
			color: elem.color,
			icono: elem.icono,
			rotacion: elem.rotacion || 0,
		}));

		this.showMessage(
			`Plantilla "${plantilla.nombre}" aplicada exitosamente`,
			'success',
		);
		this.plantillaSeleccionada = null;
		this.showTemplatePreview = false;
	}

	private mapTemplateToProducts(plantilla: PlantillaEvento): ProductoNota[] {
		const productosMap = new Map<number, number>();

		// Contar ocurrencias de cada producto en la plantilla
		plantilla.diseno.elementos.forEach((elem) => {
			if (elem.productoServicioId) {
				const count = productosMap.get(elem.productoServicioId) || 0;
				productosMap.set(elem.productoServicioId, count + 1);
			}
		});

		// Convertir a ProductoNota[]
		const productos: ProductoNota[] = [];

		productosMap.forEach((cantidad, productoId) => {
			const producto = this.productosDisponibles.find(
				(p) => p.id === productoId,
			);
			if (producto) {
				const precio = this.esClienteEspecial
					? producto.precioEspecial
					: producto.precioPublico;

				productos.push({
					id: `temp-${Date.now()}-${productoId}`,
					productoServicioId: producto.id,
					tipo: producto.tipo,
					nombre: producto.nombre,
					descripcion: producto.descripcion || '',
					cantidad,
					precioUnitario: precio || 0,
					subtotal: (precio || 0) * cantidad,
				});
			}
		});

		return productos;
	}

  public abrirDialogoNuevoCliente() {
    this.showMessage('Funcionalidad de agregar nuevo cliente no implementada aún', 'success');
  }

}
