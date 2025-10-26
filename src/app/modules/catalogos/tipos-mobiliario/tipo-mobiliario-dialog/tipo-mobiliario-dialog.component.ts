import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { TipoMobiliario } from '../tipo-mobiliario.model';

export interface TipoMobiliarioDialogData {
  tipoMobiliario?: TipoMobiliario;
  modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Tipos de Mobiliario
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
  selector: 'app-tipo-mobiliario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './tipo-mobiliario-dialog.component.html',
  styleUrl: './tipo-mobiliario-dialog.component.scss'
})
export class TipoMobiliarioDialogComponent implements OnInit {
  tipoMobiliarioForm!: FormGroup;
  modo: 'crear' | 'editar';
  guardando = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TipoMobiliarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TipoMobiliarioDialogData
  ) {
    this.modo = data.modo;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.modo === 'editar' && this.data.tipoMobiliario) {
      this.cargarDatos();
    }
  }

  /**
   * 🔧 Inicializar formulario reactivo con validaciones
   */
  private initializeForm(): void {
    this.tipoMobiliarioForm = this.fb.group({
      descripcion: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.,()]+$/)
      ]]
    });
  }

  /**
   * 📝 Cargar datos para edición
   */
  private cargarDatos(): void {
    if (this.data.tipoMobiliario) {
      this.tipoMobiliarioForm.patchValue({
        descripcion: this.data.tipoMobiliario.descripcion
      });
    }
  }

  /**
   * 💾 Guardar tipo de mobiliario
   */
  guardar(): void {
    if (this.tipoMobiliarioForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.guardando = true;

    // Simular tiempo de procesamiento
    setTimeout(() => {
      const formValue = this.tipoMobiliarioForm.value;
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
    Object.keys(this.tipoMobiliarioForm.controls).forEach(key => {
      const control = this.tipoMobiliarioForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // ===== GETTERS PARA VALIDACIONES EN TEMPLATE =====

  get descripcion() {
    return this.tipoMobiliarioForm.get('descripcion');
  }

  get esFormularioValido(): boolean {
    return this.tipoMobiliarioForm.valid;
  }

  get tituloModal(): string {
    return this.modo === 'crear' ? 'Nuevo Tipo de Mobiliario' : 'Editar Tipo de Mobiliario';
  }

  get iconoModal(): string {
    return this.modo === 'crear' ? 'add_box' : 'edit';
  }

  get textoBotonGuardar(): string {
    if (this.guardando) {
      return 'Guardando...';
    }
    return this.modo === 'crear' ? 'Crear Tipo de Mobiliario' : 'Actualizar Tipo de Mobiliario';
  }
}
