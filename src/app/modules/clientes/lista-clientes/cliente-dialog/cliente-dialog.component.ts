import {
	Component,
	OnInit,
	inject,
	OnDestroy,
	AfterViewInit,
	ViewChild,
	ElementRef,
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
	FormArray,
	FormsModule,
} from '@angular/forms';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ChipComponent } from '../../../../shared/components/chip';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import {
	Cliente,
	Direccion,
	GeoapifyFeature,
} from '../../../../core/models/cliente.model';
import { LoggerService } from '../../../../core/services/logger.service';
import { GeoapifyService } from '../../../../core/services/geoapify.service';

export interface ClienteDialogData {
	cliente?: Cliente;
	modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Clientes
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
	selector: 'app-cliente-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatCheckboxModule,
		MatCardModule,
		ChipComponent,
		MatChipsModule,
	],
	templateUrl: './cliente-dialog.component.html',
	styleUrl: './cliente-dialog.component.scss',
})
export class ClienteDialogComponent
	implements OnInit, OnDestroy, AfterViewInit
{
	clienteForm!: FormGroup;
	modo: 'crear' | 'editar';
	guardando = false;
	data: ClienteDialogData;

	// AUTOCOMPLETADO GEOAPIFY
	searchText = '';
	autocompleteResults: GeoapifyFeature[] = [];
	showAutocomplete = false;
	private destroy$ = new Subject<void>();

	// LOGGER
	logger = inject(LoggerService);

	@ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<ClienteDialogComponent>,
		private geoapifyService: GeoapifyService,
	) {
		this.data = inject(MAT_DIALOG_DATA);
		this.modo = this.data.modo;
		this.initializeForm();
	}

	ngOnInit(): void {
		if (this.modo === 'editar' && this.data.cliente) {
			this.cargarDatos();
		}
		this.setupAutocomplete();
	}

	ngAfterViewInit(): void {
		// Focus en el input de nombre
		setTimeout(() => {
			if (this.nombreInput) {
				this.nombreInput.nativeElement.focus();
			}
		}, 200);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * 🔧 Inicializar formulario reactivo con validaciones
	 */
	private initializeForm(): void {
		this.clienteForm = this.fb.group({
			nombre: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(100),
					Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
				],
			],
			direcciones: this.fb.array(
				[],
				[Validators.required, Validators.minLength(1)],
			),
			clientePreferente: [false, []],
		});
	}

	/**
	 * 📍 Configurar autocompletado de direcciones
	 */
	private setupAutocomplete(): void {
		// No agregar dirección vacía automáticamente
		// El usuario debe seleccionar una dirección del autocompletado primero
		// o hacer clic en el botón "Agregar dirección manualmente"
	}

	/**
	 * 📝 Cargar datos para edición
	 */
	private cargarDatos(): void {
		if (this.data.cliente) {
			this.clienteForm.patchValue({
				nombre: this.data.cliente.nombre,
				clientePreferente: this.data.cliente.clientePreferente,
			});

			// Cargar direcciones existentes
			this.direccionesArray.clear();
			if (
				this.data.cliente.direcciones &&
				this.data.cliente.direcciones.length > 0
			) {
				this.data.cliente.direcciones.forEach((direccion: Direccion) => {
					this.agregarDireccion(direccion);
				});
			}
			// No agregar dirección vacía si no hay direcciones existentes
			// El usuario debe seleccionar una dirección del autocompletado o agregarla manualmente
		}
	}

	/**
	 * ➕ Agregar nueva dirección al formulario
	 */
	agregarDireccion(direccion?: Direccion): void {
		// console.log("===agregarDireccion===")
		// console.log({direccion})
		const direccionForm = this.fb.group({
			street: [direccion?.street || '', [Validators.required]],
			number: [direccion?.number || '', [Validators.required]],
			neighborhood: [direccion?.neighborhood || '', [Validators.required]],
			city: [direccion?.city || '', [Validators.required]],
			state: [direccion?.state || '', [Validators.required]],
			country: [direccion?.country || 'México', [Validators.required]],
			postalCode: [direccion?.postalCode || '', [Validators.required]],
			formatted: this.fb.group({
				line1: [direccion?.formatted?.line1 || '', [Validators.required]],
				line2: [direccion?.formatted?.line2 || ''],
				line3: [direccion?.formatted?.line3 || ''],
			}),
			geoapifyPlaceId: [direccion?.geoapifyPlaceId || ''],
			confidence: [direccion?.confidence || 0],
			source: [direccion?.source || 'Geoapify'],
		});

		this.direccionesArray.push(direccionForm);
	}

	/**
	 * 🗑️ Eliminar dirección del formulario
	 */
	eliminarDireccion(index: number): void {
		if (this.direccionesArray.length > 1) {
			this.direccionesArray.removeAt(index);
		}
	}

	/**
	 * � Buscar direcciones con autocompletado
	 */
	buscarDirecciones(query: string): void {
		if (!query || query.length < 3) {
			this.autocompleteResults = [];
			this.showAutocomplete = false;
			return;
		}

		this.geoapifyService
			.autocomplete(query, 5)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.autocompleteResults = response.features;
					this.showAutocomplete = this.autocompleteResults.length > 0;
					// console.log({autocompleteResults:this.autocompleteResults})
				},
				error: (error) => {
					console.error('Error en autocompletado:', error);
					this.autocompleteResults = [];
					this.showAutocomplete = false;
				},
			});
	}

	/**
	 * 📍 Seleccionar dirección del autocompletado
	 */
	seleccionarDireccion(feature: GeoapifyFeature): void {
		const direccionFormateada =
			this.geoapifyService.formatearDireccion(feature);
		//! BUG: numero de la casa no es debuelto por la API de Geoapify
		//! BUG: neighborhood no es debuelto por la API de Geoapify
		// console.log({
		//   direccionActual: feature,
		//   postalCode: feature.properties.postcode,
		//   direccionFormateada: direccionFormateada
		// })
		this.agregarDireccion(direccionFormateada);
		this.searchText = '';
		this.showAutocomplete = false;
		this.autocompleteResults = [];
	}

	/**
	 * �💾 Guardar cliente
	 */
	guardar(): void {
		if (this.clienteForm.invalid) {
			this.marcarCamposComoTocados();
			return;
		}

		this.guardando = true;

		// Simular tiempo de procesamiento
		setTimeout(() => {
			const formValue = this.clienteForm.value;
			this.dialogRef.close(formValue);
		}, 300);
	}

	/**
	 * ❌ Cancelar y cerrar diálogo
	 */
	cancelar(): void {
		this.dialogRef.close();
	}

	/**
	 * 🔍 Marcar todos los campos como tocados para mostrar errores
	 */
	private marcarCamposComoTocados(): void {
		Object.keys(this.clienteForm.controls).forEach((key) => {
			const control = this.clienteForm.get(key);
			if (control) {
				control.markAsTouched();
				if (control instanceof FormArray) {
					control.controls.forEach((innerControl) => {
						if (innerControl instanceof FormGroup) {
							Object.keys(innerControl.controls).forEach((innerKey) => {
								innerControl.get(innerKey)?.markAsTouched();
							});
						}
					});
				}
			}
		});
	}

	// ===== GETTERS PARA VALIDACIONES Y TEMPLATE =====

	get nombre() {
		return this.clienteForm.get('nombre');
	}

	get direccionesArray(): FormArray {
		// console.log({
		//   valoresFormulario: this.clienteForm.value.nombre,
		//   niIdea: this.clienteForm.get('direcciones')
		// })
		return this.clienteForm.get('direcciones') as FormArray;
	}

	get clientePreferente() {
		return this.clienteForm.get('clientePreferente');
	}

	get esFormularioValido(): boolean {
		const esValido = this.clienteForm.valid && this.direccionesArray.length > 0;
		// this.logger.log({
		// 	errorForm: this.clienteForm.errors,
		// 	esValido,
		// 	valoresForm: this.clienteForm.value,
		// 	direccionesCount: this.direccionesArray.length,
		//   veamos: this.clienteForm.get('direccion.lng')
		// });
		return esValido;
	}

	get tituloModal(): string {
		return this.modo === 'crear' ? 'Nuevo Cliente' : 'Editar Cliente';
	}

	get iconoModal(): string {
		return this.modo === 'crear' ? 'person_add' : 'edit';
	}

	get textoBotonGuardar(): string {
		if (this.guardando) {
			return 'Guardando...';
		}
		return this.modo === 'crear' ? 'Crear Cliente' : 'Actualizar Cliente';
	}

	/**
	 * Obtener el FormGroup de una dirección específica
	 */
	getDireccionFormGroup(index: number): FormGroup {
		return this.direccionesArray.at(index) as FormGroup;
	}

	/**
	 * Verificar si se pueden eliminar direcciones
	 */
	get puedeEliminarDirecciones(): boolean {
		return this.direccionesArray.length > 1;
	}
}
