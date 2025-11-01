import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { Observable, map, startWith } from 'rxjs';
import { NuevaNotaService } from './nueva-nota.service';
import { ProductoNota, TipoLugar, CreateNotaDto } from './models/nota.model';
import { Cliente } from '../../clientes/lista/cliente.model';
import { ClientesService } from '../../clientes/lista/clientes.service';
import { ProductosServiciosService } from '../../../core/services/productos-servicios.service';
import { ProductoServicio } from '../../../core/models/productos-servicios.model';

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
	],
	templateUrl: './nueva-nota.component.html',
	styleUrl: './nueva-nota.component.scss',
})
export class NuevaNotaComponent implements OnInit {
	private fb = inject(FormBuilder);
	private nuevaNotaService = inject(NuevaNotaService);
	private clientesService = inject(ClientesService);
	private productosService = inject(ProductosServiciosService);
	private snackBar = inject(MatSnackBar);

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

	ngOnInit(): void {
		this.initializeFolio();
		this.loadClientes();
		this.loadProductos();
		this.setupClienteAutocomplete();
		this.setupLugarValidation();
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
			descripcion: producto.descripcion,
			cantidad: 1,
			precioUnitario: precio,
			subtotal: precio,
		};

		this.productosEnNota.push(productoNota);
		this.recalcularTotales();
		this.showMessage('Producto agregado', 'success');
	}

	editarCantidad(producto: ProductoNota, nuevaCantidad: number): void {
		if (nuevaCantidad < 1) return;

		producto.cantidad = nuevaCantidad;
		producto.subtotal = producto.cantidad * producto.precioUnitario;
		this.recalcularTotales();
	}

	editarPrecio(producto: ProductoNota, nuevoPrecio: number): void {
		if (nuevoPrecio < 0) return;

		producto.precioUnitario = nuevoPrecio;
		producto.subtotal = producto.cantidad * producto.precioUnitario;
		this.recalcularTotales();
	}

	eliminarProducto(producto: ProductoNota): void {
		const index = this.productosEnNota.findIndex((p) => p.id === producto.id);
		if (index > -1) {
			this.productosEnNota.splice(index, 1);
			this.recalcularTotales();
			this.showMessage('Producto eliminado', 'success');
		}
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
			) as import('./models/nota.model').Lugar,
			productos: this.productosEnNota,
			subtotal: this.subtotal,
			iva: this.iva,
			total: this.total,
			observaciones: formValue.observaciones ?? undefined,
		};

		this.nuevaNotaService.createNota(dto).subscribe({
			next: (response) => {
				if (response.success) {
					this.showMessage('Nota guardada exitosamente', 'success');
					this.resetearFormulario();
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
}
