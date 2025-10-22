import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { Categoria } from '../../../../core/models/categoria.model';

export interface CategoriaDialogData {
  categoria?: Categoria;
  modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Categorías
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
  selector: 'app-categoria-dialog',
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
  templateUrl: './categoria-dialog.component.html',
  styleUrl: './categoria-dialog.component.scss'
})
export class CategoriaDialogComponent implements OnInit {
  categoriaForm!: FormGroup;
  modo: 'crear' | 'editar';
  guardando = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaDialogData
  ) {
    this.modo = data.modo;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.categoria && this.modo === 'editar') {
      this.categoriaForm.patchValue({
        descripcion: this.data.categoria.descripcion
      });
    }
  }

  /**
   * 📝 Inicializa el formulario con validaciones
   */
  private initializeForm(): void {
    this.categoriaForm = this.fb.group({
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
    if (this.categoriaForm.valid && !this.guardando) {
      this.guardando = true;
      
      const formValue = this.categoriaForm.value;
      const result = {
        descripcion: formValue.descripcion.trim(),
        ...(this.modo === 'editar' && this.data.categoria ? { id: this.data.categoria.id } : {})
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
    return this.categoriaForm.controls;
  }
}