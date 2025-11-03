import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  // Señal para almacenar las imágenes
  images = signal<GalleryImage[]>([]);
  
  // Clave de Unsplash API (opcional - si no está disponible, usa mock data)
  private readonly UNSPLASH_ACCESS_KEY = ''; // Dejar vacío para usar mock data
  private readonly UNSPLASH_API_URL = 'https://api.unsplash.com/photos';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene imágenes desde Unsplash API o devuelve datos mock
   */
  fetchImages(count: number = 12): Observable<GalleryImage[]> {
    if (this.UNSPLASH_ACCESS_KEY) {
      return this.fetchFromUnsplash(count);
    } else {
      return this.getMockImages(count);
    }
  }

  /**
   * Fetch real images from Unsplash API
   */
  private fetchFromUnsplash(count: number): Observable<GalleryImage[]> {
    const url = `${this.UNSPLASH_API_URL}?per_page=${count}&client_id=${this.UNSPLASH_ACCESS_KEY}`;
    
    return this.http.get<any[]>(url).pipe(
      map(photos => photos.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.small,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        description: photo.description || photo.alt_description
      }))),
      catchError(() => this.getMockImages(count))
    );
  }

  /**
   * Genera imágenes mock usando Unsplash Source (no requiere API key)
   */
  private getMockImages(count: number): Observable<GalleryImage[]> {
    const mockImages: GalleryImage[] = [];
    const categories = ['events', 'party', 'celebration', 'wedding', 'birthday', 'food'];
    const photographers = [
      'Ana García', 'Carlos Ruiz', 'María López', 'Juan Pérez',
      'Sofia Martínez', 'Diego Fernández', 'Laura Sánchez', 'Miguel Torres'
    ];

    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      const photographer = photographers[i % photographers.length];
      const randomId = Math.floor(Math.random() * 1000);
      
      mockImages.push({
        id: `mock-${i}-${randomId}`,
        url: `https://source.unsplash.com/800x600/?${category}&sig=${randomId}`,
        thumbnailUrl: `https://source.unsplash.com/400x300/?${category}&sig=${randomId}`,
        photographer: photographer,
        description: `Imagen de ${category}`
      });
    }

    return of(mockImages);
  }

  /**
   * Elimina una imagen de la galería (solo del estado local)
   */
  deleteImage(imageId: string): void {
    this.images.update(current => current.filter(img => img.id !== imageId));
  }

  /**
   * Actualiza el signal con las nuevas imágenes
   */
  updateImages(images: GalleryImage[]): void {
    this.images.set(images);
  }
}
