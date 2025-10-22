import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

// Models y Services
import { ProductoServicio, CrearProductoServicioDto, ActualizarProductoServicioDto } from '../../../core/models/productos-servicios.model';
import { Categoria } from '../../../core/models/categoria.model';
import { ProductosServiciosService } from '../../../core/services/productos-servicios.service';
import { CategoriasService } from '../../../core/services/categorias.service';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductosServiciosDialogComponent } from './productos-servicios-dialog/productos-servicios-dialog.component';

@Component({
  selector: 'app-productos-servicios',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './productos-servicios.component.html',
  styleUrl: './productos-servicios.component.scss'
})
export class ProductosServiciosComponent implements OnInit {
  
  // ===== FORM Y VALIDACIONES =====
  filtroForm!: FormGroup;
  productoServicioSeleccionado: ProductoServicio | null = null;
  
  // ===== TABLA Y DATOS =====
  dataSource = new MatTableDataSource<ProductoServicio>([]);
  columnasDisplayed: string[] = ['id', 'tipo', 'categoria', 'clave', 'nombre', 'stock', 'precioPublico', 'precioEspecial', 'activo', 'acciones'];
  filtroTexto = '';
  filtroTipo = '';
  filtroCategoria = '';
  
  // ===== ESTADOS =====
  loading = false;
  productosServicios: ProductoServicio[] = [];
  categorias: Categoria[] = [];
  
  // Opciones para filtros
  tiposDisponibles = [
    { value: '', label: 'Todos' },
    { value: 'Producto', label: 'Productos' },
    { value: 'Servicio', label: 'Servicios' }
  ];
  
  // ===== VIEW CHILDREN =====
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productosServiciosService: ProductosServiciosService,
    private categoriasService: CategoriasService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.configurarTabla();
    this.suscribirACambios();
  }

  // ===== INICIALIZACIÓN =====
  
  /**
   * 🔧 Inicializar formulario de filtros
   */
  private inicializarFormulario(): void {
    this.filtroForm = this.fb.group({
      busqueda: [''],
      tipo: [''],
      categoria: ['']
    });
  }

  /**
   * ⚙️ Configurar tabla con paginador y ordenamiento
   */
  private configurarTabla(): void {
    // Configurar después de que la vista se haya inicializado
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
      
      // Configurar filtro personalizado
      this.dataSource.filterPredicate = (data: ProductoServicio, filter: string) => {
        const filterObj = JSON.parse(filter);
        
        let matches = true;
        
        // Filtro por texto
        if (filterObj.texto) {
          const searchText = filterObj.texto.toLowerCase();
          matches = matches && (
            data.nombre.toLowerCase().includes(searchText) ||
            data.clave.toLowerCase().includes(searchText) ||
            data.descripcion.toLowerCase().includes(searchText) ||
            (data.categoria?.descripcion?.toLowerCase().includes(searchText) || false)
          );
        }
        
        // Filtro por tipo
        if (filterObj.tipo) {
          matches = matches && data.tipo === filterObj.tipo;
        }
        
        // Filtro por categoría
        if (filterObj.categoria) {
          matches = matches && data.categoriaId === parseInt(filterObj.categoria);
        }
        
        return matches;
      };
    });
  }

  /**
   * 📡 Suscribirse a cambios de los servicios
   */
  private suscribirACambios(): void {
    this.productosServiciosService.productosServicios$.subscribe(items => {
      this.productosServicios = items;
      this.dataSource.data = items;
    });

    this.productosServiciosService.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.categoriasService.categorias$.subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  // ===== OPERACIONES CRUD =====

  /**
   * 📋 Cargar datos iniciales
   */
  cargarDatos(): void {
    // Cargar productos/servicios
    this.productosServiciosService.getProductosServicios({
      busqueda: this.filtroTexto || undefined,
      tipo: (this.filtroTipo as 'Producto' | 'Servicio') || undefined,
      categoriaId: this.filtroCategoria ? parseInt(this.filtroCategoria) : undefined
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Productos y servicios cargados exitosamente', 'success');
        }
      },
      error: (error) => {
        console.error('Error al cargar productos/servicios:', error);
        this.mostrarMensaje('Error al cargar productos y servicios', 'error');
      }
    });

    // Cargar categorías
    this.categoriasService.getCategorias().subscribe({
      next: (response) => {
        if (!response.success) {
          console.warn('Error al cargar categorías');
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  /**
   * ➕ Abrir modal para crear nuevo producto/servicio
   */
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(ProductosServiciosDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        modo: 'crear'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearProductoServicio(result);
      }
    });
  }

  /**
   * ✏️ Abrir modal para editar producto/servicio
   */
  abrirModalEditar(item: ProductoServicio): void {
    const dialogRef = this.dialog.open(ProductosServiciosDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        productoServicio: item,
        modo: 'editar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actualizarProductoServicio(result);
      }
    });
  }

  /**
   * ➕ Crear nuevo producto/servicio
   */
  private crearProductoServicio(itemData: any): void {
    const nuevoItem: CrearProductoServicioDto = {
      tipo: itemData.tipo,
      categoriaId: itemData.categoriaId,
      clave: itemData.clave,
      cantidadStock: itemData.cantidadStock,
      nombre: itemData.nombre,
      descripcion: itemData.descripcion,
      precioPublico: itemData.precioPublico,
      precioEspecial: itemData.precioEspecial
    };
    
    this.productosServiciosService.crearProductoServicio(nuevoItem).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje(`${nuevoItem.tipo} creado exitosamente`, 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al crear elemento:', error);
        this.mostrarMensaje('Error al crear el elemento', 'error');
      }
    });
  }

  /**
   * ✏️ Actualizar producto/servicio existente
   */
  private actualizarProductoServicio(itemData: any): void {
    const itemActualizado: ActualizarProductoServicioDto = {
      id: itemData.id,
      tipo: itemData.tipo,
      categoriaId: itemData.categoriaId,
      clave: itemData.clave,
      cantidadStock: itemData.cantidadStock,
      nombre: itemData.nombre,
      descripcion: itemData.descripcion,
      precioPublico: itemData.precioPublico,
      precioEspecial: itemData.precioEspecial
    };
    
    this.productosServiciosService.actualizarProductoServicio(itemActualizado).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje(`${itemActualizado.tipo} actualizado exitosamente`, 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al actualizar elemento:', error);
        this.mostrarMensaje('Error al actualizar el elemento', 'error');
      }
    });
  }

  /**
   * 🗑️ Confirmar y eliminar producto/servicio
   */
  confirmarEliminacion(item: ProductoServicio): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      disableClose: true,
      data: {
        title: `Eliminar ${item.tipo}`,
        message: `¿Está seguro de que desea eliminar "${item.nombre}"? Esta acción no se puede deshacer.`,
        confirmText: `Eliminar ${item.tipo}`,
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarProductoServicio(item.id);
      }
    });
  }

  /**
   * 🗑️ Eliminar producto/servicio
   */
  private eliminarProductoServicio(id: number): void {
    this.productosServiciosService.eliminarProductoServicio(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Elemento eliminado exitosamente', 'success');
          
          // Si estaba seleccionado, limpiar selección
          if (this.productoServicioSeleccionado?.id === id) {
            this.productoServicioSeleccionado = null;
          }
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al eliminar elemento:', error);
        this.mostrarMensaje('Error al eliminar el elemento', 'error');
      }
    });
  }

  // ===== FUNCIONES DE FILTRADO =====

  /**
   * 🔍 Aplicar todos los filtros
   */
  aplicarFiltros(): void {
    const filtros = {
      texto: this.filtroTexto.trim(),
      tipo: this.filtroTipo,
      categoria: this.filtroCategoria
    };
    
    this.dataSource.filter = JSON.stringify(filtros);
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * 🧹 Limpiar todos los filtros
   */
  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroTipo = '';
    this.filtroCategoria = '';
    this.aplicarFiltros();
  }

  // ===== IMPORTAR/EXPORTAR CSV =====

  /**
   * 📥 Abrir selector de archivo para importar
   */
  abrirImportador(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * 📁 Procesar archivo CSV seleccionado
   */
  procesarArchivoCSV(event: any): void {
    const archivo = event.target.files[0];
    if (archivo && archivo.type === 'text/csv') {
      
      this.productosServiciosService.importarDesdeCSV(archivo).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarMensaje(response.message, 'success');
            // Resetear el input file
            this.fileInput.nativeElement.value = '';
          } else {
            this.mostrarMensaje(response.message, 'error');
          }
        },
        error: (error) => {
          console.error('Error al importar CSV:', error);
          this.mostrarMensaje('Error al procesar el archivo CSV', 'error');
        }
      });
    } else {
      this.mostrarMensaje('Por favor seleccione un archivo CSV válido', 'warning');
    }
  }

  /**
   * 📤 Exportar productos/servicios a CSV
   */
  exportarCSV(): void {
    this.productosServiciosService.exportarACSV().subscribe({
      next: (blob) => {
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `productos-servicios_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        // Limpiar
        window.URL.revokeObjectURL(url);
        this.mostrarMensaje('Archivo CSV descargado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error al exportar CSV:', error);
        this.mostrarMensaje('Error al exportar el archivo CSV', 'error');
      }
    });
  }

  // ===== UTILIDADES =====

  /**
   * 📢 Mostrar mensaje con SnackBar
   */
  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const config = {
      duration: 4000,
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${tipo}`]
    };

    this.snackBar.open(mensaje, 'Cerrar', config);
  }

  /**
   * 💰 Formatear precio como moneda
   */
  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio);
  }

  /**
   * 📊 Obtener nombre de categoría por ID
   */
  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria?.descripcion || 'Sin categoría';
  }

  /**
   * 🎯 Getter para facilitar acceso a controles del formulario de filtros
   */
  get f() {
    return this.filtroForm.controls;
  }
}
