import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

import {
  DocumentoPdf,
  TipoDocumento,
  TipoDocumentoLabels,
  TipoDocumentoIcons,
  archivoABase64,
  esPDF,
  formatearTamano
} from '../../../../core/models/documento-pdf.model';

export interface DocumentoDialogData {
  documento?: DocumentoPdf;
  modo: 'crear' | 'editar';
}

/**
 * 📝 Componente Modal para Crear/Editar Documentos PDF
 */
@Component({
  selector: 'app-documento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  templateUrl: './documento-dialog.component.html',
  styleUrl: './documento-dialog.component.scss'
})
export class DocumentoDialogComponent implements OnInit {
  documentoForm!: FormGroup;
  modo: 'crear' | 'editar';
  guardando = signal(false);
  archivoSeleccionado = signal<File | null>(null);
  archivoBase64 = signal<string>('');
  procesandoArchivo = signal(false);

  // Enums y Labels
  TipoDocumento = TipoDocumento;
  TipoDocumentoLabels = TipoDocumentoLabels;
  TipoDocumentoIcons = TipoDocumentoIcons;
  tiposDocumento = Object.values(TipoDocumento);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentoDialogData
  ) {
    this.modo = data.modo;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.documento && this.modo === 'editar') {
      this.documentoForm.patchValue({
        nombre: this.data.documento.nombre,
        descripcion: this.data.documento.descripcion || '',
        tipoDocumento: this.data.documento.tipoDocumento
      });
      this.archivoBase64.set(this.data.documento.archivoBase64);
    }
  }

  /**
   * 📝 Inicializa el formulario con validaciones
   */
  private initializeForm(): void {
    this.documentoForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]],
      descripcion: ['', [
        Validators.maxLength(500)
      ]],
      tipoDocumento: [TipoDocumento.OTRO, [
        Validators.required
      ]]
    });
  }

  /**
   * 📁 Maneja la selección de archivo
   */
  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validar que sea PDF
    if (!esPDF(file.name)) {
      alert('⚠️ Solo se permiten archivos PDF');
      input.value = '';
      return;
    }

    // Validar tamaño (máximo 10 MB)
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      alert('⚠️ El archivo es demasiado grande. Máximo 10 MB.');
      input.value = '';
      return;
    }

    this.procesandoArchivo.set(true);
    this.archivoSeleccionado.set(file);

    try {
      // Convertir a Base64
      const base64 = await archivoABase64(file);
      this.archivoBase64.set(base64);

      // Si está vacío el nombre, sugerirlo del archivo
      if (!this.documentoForm.get('nombre')?.value) {
        const nombreSugerido = file.name.replace(/\.pdf$/i, '');
        this.documentoForm.patchValue({ nombre: nombreSugerido });
      }
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      alert('❌ Error al procesar el archivo PDF');
      this.archivoSeleccionado.set(null);
    } finally {
      this.procesandoArchivo.set(false);
    }
  }

  /**
   * 🗑️ Limpiar archivo seleccionado
   */
  limpiarArchivo(): void {
    this.archivoSeleccionado.set(null);
    this.archivoBase64.set('');

    // Resetear input file
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * 💾 Guarda los cambios
   */
  onSave(): void {
    if (this.documentoForm.invalid) {
      this.documentoForm.markAllAsTouched();
      return;
    }

    // Validar que haya archivo en modo crear
    if (this.modo === 'crear' && !this.archivoBase64()) {
      alert('⚠️ Debe seleccionar un archivo PDF');
      return;
    }

    this.guardando.set(true);

    const formValue = this.documentoForm.value;

    if (this.modo === 'crear') {
      const result = {
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion?.trim() || undefined,
        tipoDocumento: formValue.tipoDocumento,
        nombreArchivo: this.archivoSeleccionado()?.name || 'documento.pdf',
        archivoBase64: this.archivoBase64(),
        tamanoBytes: this.archivoSeleccionado()?.size || 0
      };

      setTimeout(() => {
        this.dialogRef.close(result);
      }, 800);
    } else {
      const documentoId = this.data.documento?.id || 0;
      const nombreArchivoOriginal = this.data.documento?.nombreArchivo || 'documento.pdf';
      const tamanoOriginal = this.data.documento?.tamanoBytes || 0;

      const result = {
        id: documentoId,
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion?.trim() || undefined,
        tipoDocumento: formValue.tipoDocumento,
        ...(this.archivoBase64() && this.archivoBase64() !== this.data.documento?.archivoBase64 ? {
          archivoBase64: this.archivoBase64(),
          nombreArchivo: this.archivoSeleccionado()?.name || nombreArchivoOriginal,
          tamanoBytes: this.archivoSeleccionado()?.size || tamanoOriginal
        } : {})
      };

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
   * 📏 Formatear tamaño
   */
  formatearTamano(bytes: number): string {
    return formatearTamano(bytes);
  }

  /**
   * 🔧 Getter para acceso fácil a los controles del formulario
   */
  get f() {
    return this.documentoForm.controls;
  }
}
