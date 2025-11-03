import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GalleryImage } from '../../../core/services/gallery.service';

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div mat-dialog-title class="dialog-header">
        <h2>{{ data.description || 'Vista previa' }}</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-dialog-content class="dialog-content">
        <img 
          [src]="data.url" 
          [alt]="data.description || 'Imagen de galería'"
          class="preview-image"
          loading="lazy"
        />
        
        @if (data.photographer) {
          <div class="photographer-info">
            <mat-icon>camera_alt</mat-icon>
            <span>Foto por: {{ data.photographer }}</span>
          </div>
        }
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cerrar</button>
        @if (data.photographerUrl) {
          <a 
            [href]="data.photographerUrl" 
            target="_blank" 
            mat-raised-button 
            color="primary"
          >
            Ver perfil
          </a>
        }
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 90vw;
      max-height: 90vh;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 16px 24px;
      
      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
      }
    }

    .dialog-content {
      padding: 0 24px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .preview-image {
      width: 100%;
      height: auto;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 8px;
    }

    .photographer-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class ImagePreviewDialogComponent {
  data: GalleryImage = inject(MAT_DIALOG_DATA);
}
