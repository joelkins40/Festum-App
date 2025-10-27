import { Component, Inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';

import { Paquete, ProductoIncluido } from '../../../../core/models/paquete.model';
import { ProductoServicio } from '../../../../core/models/productos-servicios.model';
import { ProductosServiciosService } from '../../../../core/services/productos-servicios.service';

export interface PaqueteDialogData {
  paquete?: Paquete;
  modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Paquetes
 * Maneja formularios reactivos con validaciones completas y tabla de productos
 */
@Component({
  selector: 'app-paquete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './paquete-dialog.component.html',
  styleUrl: './paquete-dialog.component.scss'
})
export class PaqueteDialogComponent implements OnInit {
  paqueteForm!: FormGroup;
  modo: 'crear' | 'editar';
  guardando = false;

  // Datos básicos
  tiposDisponibles = ['Paquete', 'Servicio'];
  categoriasDisponibles = ['Boda', 'Corporativo', 'Lounge', 'XV Años', 'Infantil', 'Graduación'];

  // Autocompletado de productos
  productoControl = new FormControl('');
  productos: ProductoServicio[] = [];
  productosFiltrados$!: Observable<ProductoServicio[]>;
  productoSeleccionado: ProductoServicio | null = null;

  // Tabla de productos seleccionados
  @ViewChild('productosTable') table!: MatTable<ProductoIncluido>;
  productosSeleccionados: ProductoIncluido[] = [];
  productosDataSource = new MatTableDataSource<ProductoIncluido>([]);
  displayedColumns: string[] = ['producto', 'cantidad', 'precioUnitario', 'subtotal', 'acciones'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaqueteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaqueteDialogData,
    private productosService: ProductosServiciosService,
    private cdr: ChangeDetectorRef
  ) {
    this.modo = data.modo;
    this.initializeForm();
    this.initializeAutocomplete();
  }

  ngOnInit(): void {
    this.cargarProductos();

    if (this.data.paquete && this.modo === 'editar') {
      this.paqueteForm.patchValue({
        tipo: this.data.paquete.tipo,
        nombre: this.data.paquete.nombre,
        descripcionCorta: this.data.paquete.descripcionCorta,
        categoria: this.data.paquete.categoria,
        precioTotal: this.data.paquete.precioTotal,
        disponibilidad: this.data.paquete.disponibilidad
      });

      // Cargar productos del paquete
      if (this.data.paquete.productos && this.data.paquete.productos.length > 0) {
        this.productosSeleccionados = this.data.paquete.productos.map(productoIncluido => ({
          productoServicio: productoIncluido.productoServicio,
          cantidad: productoIncluido.cantidad,
          precioUnitario: productoIncluido.precioUnitario ?? productoIncluido.productoServicio.precioPublico
        }));

        this.actualizarTabla();
      }
    }
  }  /**
   * 🔍 Inicializa el autocompletado de productos
   */
  private initializeAutocomplete(): void {
    this.productosFiltrados$ = this.productoControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const nombre = typeof value === 'string' ? value : '';
        return nombre ? this._filtrarProductos(nombre) : this.productos.slice();
      })
    );
  }

  /**
   * 📦 Carga todos los productos disponibles
   */
  private cargarProductos(): void {
    this.productosService.getProductosServicios().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.productos = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  /**
   * � Filtra productos basado en el texto de búsqueda
   */
  private _filtrarProductos(nombre: string): ProductoServicio[] {
    const filtro = nombre.toLowerCase();
    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(filtro) ||
      producto.clave.toLowerCase().includes(filtro)
    );
  }

  /**
   * �📝 Inicializa el formulario con validaciones
   */
  private initializeForm(): void {
    this.paqueteForm = this.fb.group({
      tipo: ['Paquete', [Validators.required]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      descripcionCorta: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      categoria: ['', [Validators.required]],
      precioTotal: [0, [Validators.required, Validators.min(0)]],
      disponibilidad: [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * 🎯 Maneja la selección de un producto del autocompletado
   */
  onProductoSeleccionado(event: any): void {
    this.productoSeleccionado = event.option.value;
    this.agregarProductoATabla();
  }

  /**
   * ⌨️ Maneja el evento Enter en el autocompletado
   */
  onEnterAutocomplete(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();

    // Si hay un producto seleccionado, agregarlo
    if (this.productoSeleccionado) {
      this.agregarProductoATabla();
    }

    // Limpiar el input
    this.productoControl.setValue('');
    this.productoSeleccionado = null;
  }

  /**
   * ⌨️ Maneja el evento Enter en campos de cantidad (evita borrar registros)
   */
  onCantidadEnter(event: Event, index: number): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();

    // Opcional: Enfocar la siguiente fila
    const nextIndex = index + 1;
    if (nextIndex < this.productosSeleccionados.length) {
      // Buscar el siguiente input de cantidad
      setTimeout(() => {
        const nextInput = document.querySelector(
          `.cantidad-table-field:nth-of-type(${nextIndex + 1}) input`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }, 0);
    }
  }

  /**
   * 📄 Función para mostrar el nombre del producto en el autocompletado
   */
  displayProducto(producto: ProductoServicio): string {
    return producto ? producto.nombre : '';
  }

  /**
   * ➕ Agrega un producto a la tabla (con Enter o click)
   */
  agregarProductoATabla(): void {
    if (!this.productoSeleccionado) {
      return;
    }

    // Verificar si el producto ya está en la tabla
    const existe = this.productosSeleccionados.find(p => p.productoServicio.id === this.productoSeleccionado!.id);
    if (existe) {
      existe.cantidad += 1; // Incrementar en 1
    } else {
      this.productosSeleccionados.push({
        productoServicio: this.productoSeleccionado,
        cantidad: 1, // Empezar con cantidad 1
        precioUnitario: this.productoSeleccionado.precioPublico // Inicializar con precio público
      });
    }

    // Actualizar la tabla
    this.actualizarTabla();

    // Limpiar selección
    this.productoControl.setValue('');
    this.productoSeleccionado = null;
  }

  /**
   * ⌨️ Maneja el evento Enter en el autocompletado
   */
  onEnterPressed(): void {
    // Solo agregar si tenemos un producto seleccionado y el focus está en el autocomplete
    if (this.productoSeleccionado) {
      this.agregarProductoATabla();
    }
  }

  /**
   * ⌨️ Maneja el evento Enter específicamente en el input del autocompletado
   */
  onAutoCompleteEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target as HTMLElement;

    // Solo procesar si el evento viene del input del autocompletado
    if (!target || !target.closest('.producto-autocomplete')) {
      return;
    }

    // Prevenir el comportamiento por defecto
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();

    // Solo agregar si tenemos un producto seleccionado
    if (this.productoSeleccionado) {
      this.agregarProductoATabla();
    }
  }

  /**
   * 🗑️ Elimina un producto de la tabla
   */
  eliminarProductoDeTabla(index: number): void {
    this.productosSeleccionados.splice(index, 1);
    this.actualizarTabla();
  }

  /**
   * 🔄 Actualiza la cantidad de un producto en la tabla
   */
  actualizarCantidadProducto(index: number, nuevaCantidad: number): void {
    if (nuevaCantidad < 1) {
      nuevaCantidad = 1;
    }
    this.productosSeleccionados[index].cantidad = nuevaCantidad;

    // Forzar actualización de la tabla y detección de cambios
    this.actualizarTabla();
    this.cdr.detectChanges();
  }

  /**
   * 💰 Actualiza el precio unitario de un producto específico
   */
  actualizarPrecioProducto(index: number, nuevoPrecio: number): void {
    if (nuevoPrecio < 0) {
      nuevoPrecio = 0;
    }
    this.productosSeleccionados[index].precioUnitario = nuevoPrecio;

    // Forzar actualización de la tabla y detección de cambios
    this.actualizarTabla();
    this.cdr.detectChanges();
  }

  /**
   * ⌨️ Maneja el evento Enter en campos de precio (evita borrar registros)
   */
  onPrecioEnter(event: Event, index: number): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();

    // Opcional: Enfocar el siguiente campo de precio o cantidad
    console.log('Enter en precio del producto', index);
  }

  /**
   * 🧮 Calcula el subtotal de un producto individual
   */
  calcularSubtotal(productoIncluido: ProductoIncluido): number {
    const precio = productoIncluido.precioUnitario ?? productoIncluido.productoServicio.precioPublico;
    const subtotal = precio * productoIncluido.cantidad;
    console.log('Calculando subtotal:', {
      producto: productoIncluido.productoServicio.nombre,
      precioUnitario: productoIncluido.precioUnitario,
      precioPublico: productoIncluido.productoServicio.precioPublico,
      precio: precio,
      cantidad: productoIncluido.cantidad,
      subtotal: subtotal
    });
    return subtotal;
  }

  /**
   * �💰 Calcula el precio total basado en los productos seleccionados
   */
  calcularPrecioTotal(): number {
    return this.productosSeleccionados.reduce((total, productoIncluido) => {
      return total + this.calcularSubtotal(productoIncluido);
    }, 0);
  }

  /**
   * 🔧 Actualiza la tabla de productos de manera consistente
   */
  private actualizarTabla(): void {
    // Recrear el MatTableDataSource para forzar actualización
    this.productosDataSource = new MatTableDataSource<ProductoIncluido>([...this.productosSeleccionados]);

    // Forzar detección de cambios
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    // Usar setTimeout para asegurar que el DOM se actualice
    setTimeout(() => {
      if (this.table) {
        this.table.renderRows();
      }
      this.cdr.detectChanges();
    }, 0);
  }

  /**
   * 🔍 TrackBy function para ayudar a Angular a rastrear elementos de la tabla
   */
  trackByProducto(index: number, item: ProductoIncluido): number {
    return item.productoServicio.id;
  }

  /**
   * � Método de emergencia para forzar recarga completa
   */


  /**
   * �🔍 Debug: Verificar estado de la tabla
   */
  debugTabla(): void {
    console.log('=== DEBUG TABLA ===');
    console.log('Productos seleccionados length:', this.productosSeleccionados.length);
    console.log('Productos seleccionados:', this.productosSeleccionados);
    console.log('Data source data length:', this.productosDataSource.data.length);
    console.log('Data source data:', this.productosDataSource.data);
    console.log('Displayed columns:', this.displayedColumns);
    console.log('Table exists:', !!this.table);

    // Forzar actualización completa
    this.actualizarTabla();
    console.log('Precio total calculado:', this.calcularPrecioTotal());
    this.actualizarTabla();

    alert(`Debug: Tienes ${this.productosSeleccionados.length} productos seleccionados, pero la tabla muestra ${this.productosDataSource.data.length} productos.`);
  }

  /**
   * 🗑️ Elimina un producto de la tabla
   */
  eliminarProducto(producto: ProductoIncluido): void {
    const index = this.productosSeleccionados.findIndex(p => p.productoServicio.id === producto.productoServicio.id);
    if (index >= 0) {
      this.productosSeleccionados.splice(index, 1);
      this.productosDataSource.data = [...this.productosSeleccionados];
    }
  }

  /**
   *  Guarda los cambios
   */
  onSave(): void {
    if (this.paqueteForm.valid && !this.guardando) {
      this.guardando = true;

      const formValue = this.paqueteForm.value;

      // Convertir productos seleccionados a formato de muebles
      const muebles = this.productosSeleccionados.map(productoIncluido => ({
        id: productoIncluido.productoServicio.id,
        nombre: productoIncluido.productoServicio.nombre,
        cantidad: productoIncluido.cantidad
      }));

      const result = {
        tipo: formValue.tipo,
        nombre: formValue.nombre.trim(),
        descripcionCorta: formValue.descripcionCorta.trim(),
        categoria: formValue.categoria,
        precioTotal: this.calcularPrecioTotal(), // Usar precio calculado automáticamente
        disponibilidad: formValue.disponibilidad,
        muebles: muebles,
        ...(this.modo === 'editar' && this.data.paquete ? { id: this.data.paquete.id } : {})
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
   * 🔧 Getter para acceso fácil a los controles del formulario
   */
  get f() {
    return this.paqueteForm.controls;
  }
}
