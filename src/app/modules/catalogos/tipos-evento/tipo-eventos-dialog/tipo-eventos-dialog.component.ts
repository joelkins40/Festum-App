import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { TipoEvento } from '../../../../core/models/tipo-evento.model';

export interface TipoEventoDialogData {
  tipoEvento?: TipoEvento;
  modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Tipos de Evento
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
  selector: 'app-tipo-evento-dialog',
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
  templateUrl: './tipo-eventos-dialog.component.html',
  styleUrl: './tipo-eventos-dialog.component.scss'
})
export class TipoEventoDialogComponent implements OnInit {
  tipoEventoForm!: FormGroup;
  modo: 'crear' | 'editar';
  guardando = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TipoEventoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TipoEventoDialogData
  ) {
    this.modo = data.modo;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.tipoEvento && this.modo === 'editar') {
      this.tipoEventoForm.patchValue({
        descripcion: this.data.tipoEvento.descripcion
      });
    }
  }

  /**
   * 📝 Inicializa el formulario con validaciones
   */
  private initializeForm(): void {
    this.tipoEventoForm = this.fb.group({
      descripcion: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÁáÉéÍíÓóÚúÑñ0-9\s]+$/) // Solo letras, números y espacios
      ]]
    });
  }

  /**
   * 💾 Guarda los cambios
   */
  onSave(): void {
    if (this.tipoEventoForm.valid && !this.guardando) {
      this.guardando = true;
      
      const formValue = this.tipoEventoForm.value;
      const result = {
        descripcion: formValue.descripcion.trim(),
        ...(this.modo === 'editar' && this.data.tipoEvento ? { id: this.data.tipoEvento.id } : {})
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
    return this.tipoEventoForm.controls;
  }
}