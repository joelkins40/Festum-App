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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

// Models y Services
import { TipoEvento, CrearTipoEventoDto, ActualizarTipoEventoDto } from '../../../core/models/tipo-evento.model';
import { TipoEventoService } from '../../../core/services/tipos-evento.service';

// Dialog Components
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TipoEventoDialogComponent } from './tipo-eventos-dialog/tipo-eventos-dialog.component';

@Component({
  selector: 'app-tipo-eventos',
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
    MatDividerModule
  ],
  templateUrl: './tipo-eventos.component.html',
  styleUrl: './tipo-eventos.component.scss'
})
export class TipoEventosComponent implements OnInit {
  
  // ===== FORM Y VALIDACIONES =====
  tipoEventoForm!: FormGroup;
  esEdicion = false;
  tipoEventoSeleccionado: TipoEvento | null = null;
  
  // ===== TABLA Y DATOS =====
  dataSource = new MatTableDataSource<TipoEvento>([]);
  columnasDisplayed: string[] = ['id', 'descripcion', 'fechaCreacion', 'activo', 'acciones'];
  filtroTexto = '';
  
  // ===== ESTADOS =====
  loading = false;
  tiposEvento: TipoEvento[] = [];
  
  // ===== VIEW CHILDREN =====
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private tipoEventoService: TipoEventoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarTiposEvento();
    this.configurarTabla();
    this.suscribirACambios();
  }

  // ===== INICIALIZACIÓN =====
  
  /**
   * 🔧 Inicializar formulario reactivo
   */
  private inicializarFormulario(): void {
    this.tipoEventoForm = this.fb.group({
      descripcion: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]]
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
      this.dataSource.filterPredicate = (data: TipoEvento, filter: string) => {
        return data.descripcion.toLowerCase().includes(filter.toLowerCase());
      };
    });
  }

  /**
   * 📡 Suscribirse a cambios del servicio
   */
  private suscribirACambios(): void {
    this.tipoEventoService.tiposEvento$.subscribe(tiposEvento => {
      this.tiposEvento = tiposEvento;
      this.dataSource.data = tiposEvento;
    });

    this.tipoEventoService.loading$.subscribe(loading => {
      this.loading = loading;
    });
  }

  // ===== OPERACIONES CRUD =====

  /**
   * 📋 Cargar tipos de evento desde el servicio
   */
  cargarTiposEvento(): void {
    this.tipoEventoService.getTiposEvento({
      busqueda: this.filtroTexto || undefined
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Tipos de evento cargados exitosamente', 'success');
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de evento:', error);
        this.mostrarMensaje('Error al cargar tipos de evento', 'error');
      }
    });
  }

  /**
   * 💾 Guardar tipo de evento (crear o actualizar)
   */
  guardarTipoEvento(): void {
    if (this.tipoEventoForm.valid) {
      const descripcion = this.tipoEventoForm.get('descripcion')?.value;
      
      if (this.esEdicion && this.tipoEventoSeleccionado) {
        // Actualizar tipo de evento existente
        const tipoEventoActualizado: ActualizarTipoEventoDto = {
          id: this.tipoEventoSeleccionado.id,
          descripcion: descripcion
        };
        
        this.tipoEventoService.actualizarTipoEvento(tipoEventoActualizado).subscribe({
          next: (response) => {
            if (response.success) {
              this.mostrarMensaje('Tipo de evento actualizado exitosamente', 'success');
              this.cancelarEdicion();
            } else {
              this.mostrarMensaje(response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error al actualizar tipo de evento:', error);
            this.mostrarMensaje('Error al actualizar el tipo de evento', 'error');
          }
        });
      } else {
        // Crear nuevo tipo de evento
        const nuevoTipoEvento: CrearTipoEventoDto = {
          descripcion: descripcion
        };
        
        this.tipoEventoService.crearTipoEvento(nuevoTipoEvento).subscribe({
          next: (response) => {
            if (response.success) {
              this.mostrarMensaje('Tipo de evento creado exitosamente', 'success');
              this.limpiarFormulario();
            } else {
              this.mostrarMensaje(response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error al crear tipo de evento:', error);
            this.mostrarMensaje('Error al crear el tipo de evento', 'error');
          }
        });
      }
    } else {
      this.mostrarMensaje('Por favor, complete todos los campos requeridos', 'warning');
    }
  }

  /**
   * ➕ Abrir modal para crear nuevo tipo de evento
   */
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(TipoEventoDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        modo: 'crear'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearTipoEvento(result);
      }
    });
  }

  /**
   * ✏️ Abrir modal para editar tipo de evento
   */
  abrirModalEditar(tipoEvento: TipoEvento): void {
    const dialogRef = this.dialog.open(TipoEventoDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        tipoEvento: tipoEvento,
        modo: 'editar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actualizarTipoEvento(result);
      }
    });
  }

  /**
   * ➕ Crear nuevo tipo de evento
   */
  private crearTipoEvento(tipoEventoData: any): void {
    const nuevoTipoEvento = {
      descripcion: tipoEventoData.descripcion
    };
    
    this.tipoEventoService.crearTipoEvento(nuevoTipoEvento).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Tipo de evento creado exitosamente', 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al crear tipo de evento:', error);
        this.mostrarMensaje('Error al crear el tipo de evento', 'error');
      }
    });
  }

  /**
   * ✏️ Actualizar tipo de evento existente
   */
  private actualizarTipoEvento(tipoEventoData: any): void {
    const tipoEventoActualizado = {
      id: tipoEventoData.id,
      descripcion: tipoEventoData.descripcion
    };
    
    this.tipoEventoService.actualizarTipoEvento(tipoEventoActualizado).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Tipo de evento actualizado exitosamente', 'success');
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al actualizar tipo de evento:', error);
        this.mostrarMensaje('Error al actualizar el tipo de evento', 'error');
      }
    });
  }

  /**
   * 🗑️ Confirmar y eliminar tipo de evento
   */
  confirmarEliminacion(tipoEvento: TipoEvento): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      disableClose: true,
      data: {
        title: 'Eliminar Tipo de Evento',
        message: `¿Está seguro de que desea eliminar el tipo de evento "${tipoEvento.descripcion}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar Tipo de Evento',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarTipoEvento(tipoEvento.id);
      }
    });
  }

  /**
   * 🗑️ Eliminar tipo de evento
   */
  private eliminarTipoEvento(id: number): void {
    this.tipoEventoService.eliminarTipoEvento(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje('Tipo de evento eliminado exitosamente', 'success');
          
          // Si estaba editando este tipo de evento, cancelar edición
          if (this.tipoEventoSeleccionado?.id === id) {
            this.cancelarEdicion();
          }
        } else {
          this.mostrarMensaje(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error al eliminar tipo de evento:', error);
        this.mostrarMensaje('Error al eliminar el tipo de evento', 'error');
      }
    });
  }

  // ===== UTILIDADES DEL FORMULARIO =====

  /**
   * 🧹 Limpiar formulario
   */
  limpiarFormulario(): void {
    this.tipoEventoForm.reset();
    this.tipoEventoForm.get('descripcion')?.setValue('');
    this.cancelarEdicion();
  }

  /**
   * ❌ Cancelar edición
   */
  cancelarEdicion(): void {
    this.esEdicion = false;
    this.tipoEventoSeleccionado = null;
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
      
      this.tipoEventoService.importarDesdeCSV(archivo).subscribe({
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
   * 📤 Exportar tipos de evento a CSV
   */
  exportarCSV(): void {
    this.tipoEventoService.exportarACSV().subscribe({
      next: (blob) => {
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tipos_evento_${new Date().toISOString().split('T')[0]}.csv`;
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
   * 🎯 Getter para facilitar acceso a controles del formulario
   */
  get f() {
    return this.tipoEventoForm.controls;
  }
}
