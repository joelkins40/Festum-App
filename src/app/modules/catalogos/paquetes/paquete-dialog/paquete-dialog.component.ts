import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

import { Paquete } from '../paquetes.model';

export interface PaqueteDialogData {
  paquete?: Paquete;
  modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Paquetes
 * Maneja formularios reactivos con validaciones completas
 */
@Component({
  selector: 'app-paquete-dialog',
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
    MatTooltipModule
  ],
  templateUrl: './paquete-dialog.component.html',
  styleUrl: './paquete-dialog.component.scss'
})
export class PaqueteDialogComponent implements OnInit {
  paqueteForm!: FormGroup;
  modo: 'crear' | 'editar';
  guardando = false;

  tiposDisponibles = ['Paquete', 'Servicio'];
  categoriasDisponibles = ['Boda', 'Corporativo', 'Lounge', 'XV Años', 'Infantil', 'Graduación'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaqueteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaqueteDialogData
  ) {
    this.modo = data.modo;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.paquete && this.modo === 'editar') {
      this.paqueteForm.patchValue({
        tipo: this.data.paquete.tipo,
        nombre: this.data.paquete.nombre,
        descripcionCorta: this.data.paquete.descripcionCorta,
        categoria: this.data.paquete.categoria,
        precioTotal: this.data.paquete.precioTotal,
        disponibilidad: this.data.paquete.disponibilidad,
        imagen: this.data.paquete.imagen || ''
      });

      // Cargar muebles si existen
      if (this.data.paquete.muebles && this.data.paquete.muebles.length > 0) {
        this.muebles.clear();
        this.data.paquete.muebles.forEach(mueble => {
          this.muebles.push(this.fb.group({
            id: [mueble.id],
            nombre: [mueble.nombre, [Validators.required]],
            cantidad: [mueble.cantidad, [Validators.required, Validators.min(1)]]
          }));
        });
      }
    }
  }

  /**
   * 📝 Inicializa el formulario con validaciones
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
      disponibilidad: [0, [Validators.required, Validators.min(0)]],
      imagen: [''],
      muebles: this.fb.array([this.crearMuebleFormGroup()])
    });
  }

  /**
   * 🪑 Crea un FormGroup para un mueble
   */
  private crearMuebleFormGroup(): FormGroup {
    return this.fb.group({
      id: [Math.floor(Math.random() * 1000)],
      nombre: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * 🪑 Getter para acceder al FormArray de muebles
   */
  get muebles(): FormArray {
    return this.paqueteForm.get('muebles') as FormArray;
  }

  /**
   * ➕ Agregar nuevo mueble
   */
  agregarMueble(): void {
    this.muebles.push(this.crearMuebleFormGroup());
  }

  /**
   * 🗑️ Eliminar mueble
   */
  eliminarMueble(index: number): void {
    if (this.muebles.length > 1) {
      this.muebles.removeAt(index);
    }
  }

  /**
   * 💾 Guarda los cambios
   */
  onSave(): void {
    if (this.paqueteForm.valid && !this.guardando) {
      this.guardando = true;

      const formValue = this.paqueteForm.value;

      interface MuebleFormValue {
        id: number;
        nombre: string;
        cantidad: number;
      }

      const result = {
        tipo: formValue.tipo,
        nombre: formValue.nombre.trim(),
        descripcionCorta: formValue.descripcionCorta.trim(),
        categoria: formValue.categoria,
        precioTotal: formValue.precioTotal,
        disponibilidad: formValue.disponibilidad,
        imagen: formValue.imagen || undefined,
        muebles: (formValue.muebles as MuebleFormValue[]).filter(m => m.nombre && m.cantidad > 0),
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
