import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Nota, TipoNota, EstadoNota, Cliente, Evento } from '../notas.models';
import { NotasService } from '../notas.service';

export interface VentaDialogData {
  nota?: Nota;
  modo: 'crear' | 'editar';
}

@Component({
  selector: 'app-venta-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './venta-dialog.component.html',
  styleUrl: './venta-dialog.component.scss'
})
export class VentaDialogComponent implements OnInit {
  ventaForm!: FormGroup;
  modoEdicion: boolean;
  titulo: string;

  // Catálogos
  clientes: Cliente[] = [];
  eventos: Evento[] = [];
  tiposNota: TipoNota[] = ['Paquete', 'Servicio'];
  estadosNota: EstadoNota[] = ['Pendiente', 'Pagada', 'Cancelada', 'Parcial'];

  constructor(
    private fb: FormBuilder,
    private notasService: NotasService,
    public dialogRef: MatDialogRef<VentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VentaDialogData
  ) {
    this.modoEdicion = data.modo === 'editar';
    this.titulo = this.modoEdicion ? 'Editar Nota de Venta' : 'Nueva Nota de Venta';
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCatalogos();
    
    if (this.modoEdicion && this.data.nota) {
      this.cargarDatosNota();
    }
  }

  private inicializarFormulario(): void {
    this.ventaForm = this.fb.group({
      tipo: ['', Validators.required],
      clienteId: ['', Validators.required],
      eventoId: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      total: ['', [Validators.required, Validators.min(0)]],
      estado: ['Pendiente', Validators.required],
      descripcion: ['', Validators.maxLength(500)]
    });
  }

  private cargarCatalogos(): void {
    // Cargar clientes
    this.notasService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });

    // Cargar eventos
    this.notasService.getEventos().subscribe(eventos => {
      this.eventos = eventos;
    });
  }

  private cargarDatosNota(): void {
    if (this.data.nota) {
      this.ventaForm.patchValue({
        tipo: this.data.nota.tipo,
        clienteId: this.data.nota.cliente.id,
        eventoId: this.data.nota.evento.id,
        fecha: this.data.nota.fecha,
        total: this.data.nota.total,
        estado: this.data.nota.estado,
        descripcion: this.data.nota.descripcion || ''
      });
    }
  }

  onGuardar(): void {
    if (this.ventaForm.valid) {
      const formData = this.ventaForm.value;
      
      if (this.modoEdicion && this.data.nota) {
        // Modo edición
        this.dialogRef.close({
          ...formData,
          id: this.data.nota.id
        });
      } else {
        // Modo creación
        this.dialogRef.close(formData);
      }
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  // Formatear el total como moneda
  formatearMoneda(event: any): void {
    const valor = event.target.value;
    if (valor) {
      const numero = parseFloat(valor.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numero)) {
        this.ventaForm.patchValue({ total: numero }, { emitEvent: false });
      }
    }
  }

  get f() {
    return this.ventaForm.controls;
  }
}
