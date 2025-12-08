import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  DocumentoPdf,
  TipoDocumentoLabels,
  formatearTamano,
  descargarPDF
} from '../../../../core/models/documento-pdf.model';
import { ButtonComponent } from "../../../../shared/components/button";

export interface PdfViewerData {
  documento: DocumentoPdf;
}

/**
 * 👁️ Componente para visualizar documentos PDF
 */
@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ButtonComponent
],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent implements OnInit {
  pdfUrl = signal<SafeResourceUrl | null>(null);
  loading = signal(true);
  error = signal(false);
  TipoDocumentoLabels = TipoDocumentoLabels;

  constructor(
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: PdfViewerData,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarPdf();
  }

  /**
   * 📄 Cargar y preparar PDF para visualización
   */
  private cargarPdf(): void {
    try {
      const base64 = this.data.documento.archivoBase64;

      // Convertir Base64 a Blob URL
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Sanitizar URL para uso seguro en iframe
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.pdfUrl.set(safeUrl);

      // Simular tiempo de carga para UX
      setTimeout(() => {
        this.loading.set(false);
      }, 800);

    } catch (error) {
      console.error('Error al cargar PDF:', error);
      this.error.set(true);
      this.loading.set(false);
    }
  }

  /**
   * 📥 Descargar PDF
   */
  descargar(): void {
    try {
      descargarPDF(this.data.documento);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  }

  /**
   * ❌ Cerrar visor
   */
  cerrar(): void {
    this.dialogRef.close();
  }

  /**
   * 📏 Formatear tamaño
   */
  formatearTamano(bytes: number): string {
    return formatearTamano(bytes);
  }
}
