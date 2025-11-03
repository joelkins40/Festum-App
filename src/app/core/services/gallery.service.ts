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

interface UnsplashPhoto {
	id: string;
	urls: { regular: string; small: string };
	user: { name: string; links: { html: string } };
	description?: string;
	alt_description?: string;
}

@Injectable({
	providedIn: 'root',
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

		console.log({ url });

		return this.http.get<UnsplashPhoto[]>(url).pipe(
			map((photos) =>
				photos.map((photo) => ({
					id: photo.id,
					url: photo.urls.regular,
					thumbnailUrl: photo.urls.small,
					photographer: photo.user.name,
					photographerUrl: photo.user.links.html,
					description: photo.description || photo.alt_description,
				})),
			),
			catchError(() => this.getMockImages(count)),
		);
	}

	/**
	 * Genera imágenes mock con URLs reales de eventos
	 */
	private getMockImages(count: number): Observable<GalleryImage[]> {
		const mockImages: GalleryImage[] = [
			{
				id: 'mock-1',
				url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
				photographer: 'Ana García',
				description: 'Elegante salón decorado para evento especial',
			},
			{
				id: 'mock-2',
				url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
				photographer: 'Carlos Ruiz',
				description: 'Hermosa decoración con flores para boda',
			},
			{
				id: 'mock-3',
				url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
				photographer: 'María López',
				description: 'Festejo con globos y decoración colorida',
			},
			{
				id: 'mock-4',
				url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
				photographer: 'Juan Pérez',
				description: 'Mesa de banquete elegantemente servida',
			},
			{
				id: 'mock-5',
				url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=300&fit=crop',
				photographer: 'Sofia Martínez',
				description: 'Pastel de celebración decorado profesionalmente',
			},
			{
				id: 'mock-6',
				url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
				photographer: 'Diego Fernández',
				description: 'Ambiente de fiesta con luces y música',
			},
			{
				id: 'mock-7',
				url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop',
				photographer: 'Laura Sánchez',
				description: 'Copa de champagne para brindis especial',
			},
			{
				id: 'mock-8',
				url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
				photographer: 'Miguel Torres',
				description: 'Arreglo floral para centro de mesa',
			},
			{
				id: 'mock-9',
				url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
				photographer: 'Ana García',
				description: 'Sillas decoradas para ceremonia',
			},
			{
				id: 'mock-10',
				url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
				photographer: 'Carlos Ruiz',
				description: 'Invitados disfrutando del evento',
			},
			{
				id: 'mock-11',
				url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
				photographer: 'María López',
				description: 'Platillo gourmet servido en el evento',
			},
			{
				id: 'mock-12',
				url: 'https://images.unsplash.com/photo-1519167758481-83f29da8fd18?w=800&h=600&fit=crop',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1519167758481-83f29da8fd18?w=400&h=300&fit=crop',
				photographer: 'Juan Pérez',
				description: 'Iluminación ambiental para evento nocturno',
			},
		];

		// Retornar solo la cantidad solicitada
		return of(mockImages.slice(0, count));
	}

	/**
	 * Elimina una imagen de la galería (solo del estado local)
	 */
	deleteImage(imageId: string): void {
		this.images.update((current) =>
			current.filter((img) => img.id !== imageId),
		);
	}

	/**
	 * Actualiza el signal con las nuevas imágenes
	 */
	updateImages(images: GalleryImage[]): void {
		this.images.set(images);
	}
}
