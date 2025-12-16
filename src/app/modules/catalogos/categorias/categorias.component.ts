import { ButtonComponent } from './../../../shared/components/button/button.component';
import { ChipComponent } from './../../../shared/components/chip/chip.component';
import { DynamicFormDialogComponent } from './../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import {
  DynamicFormConfig,
  DynamicFormResult,
  calculateDialogWidth,
} from './../../../shared/components/dynamic-form-dialog/dynamic-form-dialog.types';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ButtonIconComponent } from '../../../shared/components/button-icon';

// Models y Services
import {
  Categoria,
  CrearCategoriaDto,
  ActualizarCategoriaDto,
} from '../../../core/models/categoria.model';
import { CategoriasService } from '../../../core/services/categorias.service';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CategoriaDialogComponent } from './categoria-dialog/categoria-dialog.component';

@Component({
  selector: 'app-categorias',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
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
    MatDividerModule,
    ButtonComponent,
    ButtonIconComponent,
    ChipComponent,
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export class CategoriasComponent implements OnInit {
  //
  private dialog = inject(MatDialog);

  // ===== FORM Y VALIDACIONES =====
  categoriaForm!: FormGroup;
  esEdicion = false;
  categoriaSeleccionada: Categoria | null = null;

  // ===== TABLA Y DATOS =====
  dataSource = new MatTableDataSource<Categoria>([]);
  columnasDisplayed: string[] = [
    'id',
    'descripcion',
    'fechaCreacion',
    'activo',
    'acciones',
  ];
  filtroTexto = '';

  // ===== ESTADOS =====
  loading = false;
  categorias: Categoria[] = [];

  // ===== VIEW CHILDREN =====
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private snackBar: MatSnackBar
  ) // private dialog: MatDialog
  {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.configurarTabla();
    this.suscribirACambios();
  }

  // ===== INICIALIZACIÓN =====

  /**
   * 🔧 Inicializar formulario reactivo
   */
  private inicializarFormulario(): void {
    this.categoriaForm = this.fb.group({
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
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
      this.dataSource.filterPredicate = (data: Categoria, filter: string) => {
        return data.descripcion.toLowerCase().includes(filter.toLowerCase());
      };
    });
  }

  /**
   * 📡 Suscribirse a cambios del servicio
   */
  private suscribirACambios(): void {
    this.categoriasService.categorias$.subscribe((categorias) => {
      this.categorias = categorias;
      this.dataSource.data = categorias;
    });

    this.categoriasService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  // ===== OPERACIONES CRUD =====

  /**
   * 📋 Cargar categorías desde el servicio
   */
  cargarCategorias(): void {
    this.categoriasService
      .getCategorias({
        busqueda: this.filtroTexto || undefined,
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarMensaje('Categorías cargadas exitosamente', 'success');
          }
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
          this.mostrarMensaje('Error al cargar categorías', 'error');
        },
      });
  }

  /**
   * 💾 Guardar categoría (crear o actualizar)
   */
  guardarCategoria(): void {
    if (this.categoriaForm.valid) {
      const descripcion = this.categoriaForm.get('descripcion')?.value;

      if (this.esEdicion && this.categoriaSeleccionada) {
        // Actualizar categoría existente
        const categoriaActualizada: ActualizarCategoriaDto = {
          id: this.categoriaSeleccionada.id,
          descripcion: descripcion,
        };

        this.categoriasService
          .actualizarCategoria(categoriaActualizada)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.mostrarMensaje(
                  'Categoría actualizada exitosamente',
                  'success'
                );
                this.cancelarEdicion();
              } else {
                this.mostrarMensaje(response.message, 'error');
              }
            },
            error: (error) => {
              console.error('Error al actualizar categoría:', error);
              this.mostrarMensaje('Error al actualizar la categoría', 'error');
            },
          });
      } else {
        // Crear nueva categoría
        const nuevaCategoria: CrearCategoriaDto = {
          descripcion: descripcion,
        };

        this.categoriasService.crearCategoria(nuevaCategoria).subscribe({
          next: (response) => {
            if (response.success) {
              this.mostrarMensaje('Categoría creada exitosamente', 'success');
              this.limpiarFormulario();
            } else {
              this.mostrarMensaje(response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error al crear categoría:', error);
            this.mostrarMensaje('Error al crear la categoría', 'error');
          },
        });
      }
    } else {
      this.mostrarMensaje(
        'Por favor, complete todos los campos requeridos',
        'warning'
      );
    }
  }

  /**
   * ➕ Abrir modal para crear nueva categoría
   */
  abrirModalCrear(): void {
    const config: DynamicFormConfig = {
      title: 'Crear Nueva Categoría',
      fields: [
        {
          type: 'text',
          key: 'descripcion',
          label: 'Descripción',
          placeholder: 'Ingrese la descripción de la categoría',
          required: true,
          minLength: 3,
          maxLength: 100,
        },
      ],
    };

    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      data: config,
      width: calculateDialogWidth(config.fields.length),
    });

    dialogRef.afterClosed().subscribe((result: DynamicFormResult) => {
      if (result.confirmed && result.data) {
        this.crearCategoria(result.data);
        console.log(result.data);
        console.log(result.confirmed);
      }
    });

    // const dialogRef = this.dialog.open(CategoriaDialogComponent, {
    //   width: '500px',
    //   disableClose: true,
    //   data: {
    //     modo: 'crear'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.crearCategoria(result);
    //   }
    // });
  }

  /**
   * ✏️ Abrir modal para editar categoría
   */
  abrirModalEditar(categoria: Categoria): void {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        categoria: categoria,
        modo: 'editar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.actualizarCategoria(result);
      }
    });
  }

  /**
   * ➕ Crear nueva categoría
   */
  private crearCategoria(categoriaData: Record<string, string>): void {
    const nuevaCategoria = {
      descripcion: categoriaData['descripcion'],
    };

    this.categoriasService.crearCategoria(nuevaCategoria).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Categoría creada exitosamente', 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        this.mostrarMensaje('Error al crear la categoría', 'error');
      },
    });
  }

  /**
   * ✏️ Actualizar categoría existente
   */
  private actualizarCategoria(categoriaData: any): void {
    const categoriaActualizada = {
      id: categoriaData.id,
      descripcion: categoriaData.descripcion,
    };

    this.categoriasService.actualizarCategoria(categoriaActualizada).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Categoría actualizada exitosamente', 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al actualizar categoría:', error);
        this.mostrarMensaje('Error al actualizar la categoría', 'error');
      },
    });
  }

  /**
   * 🗑️ Confirmar y eliminar categoría
   */
  confirmarEliminacion(categoria: Categoria): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      disableClose: true,
      data: {
        title: 'Eliminar Categoría',
        message: `¿Está seguro de que desea eliminar la categoría "${categoria.descripcion}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar Categoría',
        cancelText: 'Cancelar',
        type: 'danger',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarCategoria(categoria.id);
      }
    });
  }

  /**
   * 🗑️ Eliminar categoría
   */
  private eliminarCategoria(id: number): void {
    this.categoriasService.eliminarCategoria(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Categoría eliminada exitosamente', 'success');

          // Si estaba editando esta categoría, cancelar edición
          if (this.categoriaSeleccionada?.id === id) {
            this.cancelarEdicion();
          }
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al eliminar categoría:', error);
        this.mostrarMensaje('Error al eliminar la categoría', 'error');
      },
    });
  }

  // ===== UTILIDADES DEL FORMULARIO =====

  /**
   * 🧹 Limpiar formulario
   */
  limpiarFormulario(): void {
    this.categoriaForm.reset();
    this.categoriaForm.get('descripcion')?.setValue('');
    this.cancelarEdicion();
  }

  /**
   * ❌ Cancelar edición
   */
  cancelarEdicion(): void {
    this.esEdicion = false;
    this.categoriaSeleccionada = null;
    this.limpiarFormulario();
  }

  // ===== FUNCIONES DE TABLA =====

  /**
   * 🔍 Aplicar filtro de búsqueda
   */
  aplicarFiltro(): void {
    this.dataSource.filter = this.filtroTexto.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
      this.categoriasService.importarDesdeCSV(archivo).subscribe({
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
        },
      });
    } else {
      this.mostrarMensaje(
        'Por favor seleccione un archivo CSV válido',
        'warning'
      );
    }
  }

  /**
   * 📤 Exportar categorías a CSV
   */
  exportarCSV(): void {
    this.categoriasService.exportarACSV().subscribe({
      next: (blob) => {
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `categorias_${
          new Date().toISOString().split('T')[0]
        }.csv`;
        link.click();

        // Limpiar
        window.URL.revokeObjectURL(url);
        this.mostrarMensaje('Archivo CSV descargado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error al exportar CSV:', error);
        this.mostrarMensaje('Error al exportar el archivo CSV', 'error');
      },
    });
  }

  // ===== UTILIDADES =====

  /**
   * 📢 Mostrar mensaje con SnackBar
   */
  private mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' | 'warning' | 'info' = 'info'
  ): void {
    const config = {
      duration: 4000,
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${tipo}`],
    };

    this.snackBar.open(mensaje, 'Cerrar', config);
  }

  /**
   * 🎯 Getter para facilitar acceso a controles del formulario
   */
  get f() {
    return this.categoriaForm.controls;
  }
}
