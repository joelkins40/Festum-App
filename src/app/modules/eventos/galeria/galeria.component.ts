import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GalleryService, GalleryImage } from '../../../core/services/gallery.service';
import { ImagePreviewDialogComponent } from './image-preview-dialog.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss'
})
export class GaleriaComponent implements OnInit {
  private galleryService = inject(GalleryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Signals para manejo de estado reactivo
  images = this.galleryService.images;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadImages();
  }

  /**
   * Carga las imágenes desde el servicio
   */
  loadImages(): void {
    this.loading.set(true);
    this.error.set(null);

    this.galleryService.fetchImages(12).subscribe({
      next: (images) => {
        this.galleryService.updateImages(images);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las imágenes. Por favor, intenta de nuevo.');
        this.loading.set(false);
        console.error('Error loading images:', err);
      }
    });
  }

  /**
   * Abre el diálogo de vista previa con la imagen seleccionada
   */
  viewImage(image: GalleryImage): void {
    this.dialog.open(ImagePreviewDialogComponent, {
      data: image,
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'image-preview-dialog'
    });
  }

  /**
   * Elimina una imagen de la galería
   */
  deleteImage(image: GalleryImage, event: Event): void {
    event.stopPropagation();
    
    this.galleryService.deleteImage(image.id);
    
    this.snackBar.open('Imagen eliminada', 'Deshacer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    }).onAction().subscribe(() => {
      // Recargar imágenes si el usuario hace clic en "Deshacer"
      this.loadImages();
    });
  }

  /**
   * Recarga la galería completa
   */
  refreshGallery(): void {
    this.loadImages();
  }
}
