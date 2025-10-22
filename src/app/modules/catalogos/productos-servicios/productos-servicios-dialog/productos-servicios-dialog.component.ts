import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ProductoServicio } from '../../../../core/models/productos-servicios.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { CategoriasService } from '../../../../core/services/categorias.service';

export interface ProductoServicioDialogData {
  productoServicio?: ProductoServicio;
  modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Productos y Servicios
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
  selector: 'app-productos-servicios-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './productos-servicios-dialog.component.html',
  styleUrl: './productos-servicios-dialog.component.scss'
})
export class ProductosServiciosDialogComponent implements OnInit {
  productoServicioForm!: FormGroup;
  modo: 'crear' | 'editar';
  guardando = false;
  cargandoCategorias = false;

  // Opciones para selectores
  tiposDisponibles: Array<{value: 'Producto' | 'Servicio', label: string}> = [
    { value: 'Producto', label: 'Producto' },
    { value: 'Servicio', label: 'Servicio' }
  ];

  categorias$: Observable<Categoria[]>;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    public dialogRef: MatDialogRef<ProductosServiciosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoServicioDialogData
  ) {
    this.modo = data.modo;
    this.categorias$ = this.categoriasService.categorias$;
    this.initializeForm();
    this.cargarCategorias();
  }

  ngOnInit(): void {
    if (this.data.productoServicio && this.modo === 'editar') {
      this.productoServicioForm.patchValue({
        tipo: this.data.productoServicio.tipo,
        categoriaId: this.data.productoServicio.categoriaId,
        clave: this.data.productoServicio.clave,
        cantidadStock: this.data.productoServicio.cantidadStock,
        nombre: this.data.productoServicio.nombre,
        descripcion: this.data.productoServicio.descripcion,
        precioPublico: this.data.productoServicio.precioPublico,
        precioEspecial: this.data.productoServicio.precioEspecial
      });
    }
  }

  /**
   * 📝 Inicializa el formulario con validaciones
   */
  private initializeForm(): void {
    this.productoServicioForm = this.fb.group({
      tipo: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      clave: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Z0-9]+$/) // Solo letras mayúsculas y números
      ]],
      cantidadStock: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/) // Solo números enteros
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]],
      descripcion: ['', [
        Validators.maxLength(500)
      ]],
      precioPublico: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Números decimales con hasta 2 decimales
      ]],
      precioEspecial: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Números decimales con hasta 2 decimales
      ]]
    });

    // Agregar validador personalizado para verificar que precio especial <= precio público
    this.productoServicioForm.setValidators(this.validarPrecios());
  }

  /**
   * 🔍 Cargar categorías disponibles
   */
  private cargarCategorias(): void {
    this.cargandoCategorias = true;
    this.categoriasService.getCategorias().subscribe({
      next: (response) => {
        this.cargandoCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.cargandoCategorias = false;
      }
    });
  }

  /**
   * ✅ Validador personalizado para precios
   */
  private validarPrecios(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const form = control as FormGroup;
      const precioPublico = form.get('precioPublico')?.value;
      const precioEspecial = form.get('precioEspecial')?.value;
      
      if (precioPublico && precioEspecial && parseFloat(precioEspecial) > parseFloat(precioPublico)) {
        return { precioEspecialMayor: true };
      }
      
      return null;
    };
  }

  /**
   * 🔤 Convertir clave a mayúsculas automáticamente
   */
  onClaveChange(event: any): void {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.productoServicioForm.patchValue({ clave: value });
  }

  /**
   * 🔢 Validar entrada numérica para stock
   */
  onStockChange(event: any): void {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.productoServicioForm.patchValue({ cantidadStock: value });
  }

  /**
   * 💰 Validar entrada numérica para precios
   */
  onPrecioChange(event: any, campo: string): void {
    const value = event.target.value.replace(/[^0-9.]/g, '');
    // Permitir solo un punto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      const newValue = parts[0] + '.' + parts.slice(1).join('');
      this.productoServicioForm.patchValue({ [campo]: newValue });
    }
  }

  /**
   * 💾 Guarda los cambios
   */
  onSave(): void {
    if (this.productoServicioForm.valid && !this.guardando) {
      this.guardando = true;
      
      const formValue = this.productoServicioForm.value;
      const result = {
        tipo: formValue.tipo,
        categoriaId: parseInt(formValue.categoriaId),
        clave: formValue.clave.trim(),
        cantidadStock: parseInt(formValue.cantidadStock),
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion?.trim() || '',
        precioPublico: parseFloat(formValue.precioPublico),
        precioEspecial: parseFloat(formValue.precioEspecial),
        ...(this.modo === 'editar' && this.data.productoServicio ? { id: this.data.productoServicio.id } : {})
      };
      
      // Simular delay de guardado para UX
      setTimeout(() => {
        this.dialogRef.close(result);
      }, 800);
    }
  }

  /**
   * ❌ Cancela y cierra el modal
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * 🎯 Obtener título del modal según el modo
   */
  getTitulo(): string {
    return this.modo === 'crear' ? 'Nuevo Producto/Servicio' : 'Editar Producto/Servicio';
  }

  /**
   * 🎯 Obtener icono del modal según el modo
   */
  getIcono(): string {
    return this.modo === 'crear' ? 'add_shopping_cart' : 'edit';
  }

  /**
   * 🔧 Getter para acceso fácil a los controles del formulario
   */
  get f() {
    return this.productoServicioForm.controls;
  }

  /**
   * ❗ Verificar si el formulario tiene el error de precio especial mayor
   */
  get tienePrecioEspecialMayor(): boolean {
    return this.productoServicioForm.hasError('precioEspecialMayor');
  }
}