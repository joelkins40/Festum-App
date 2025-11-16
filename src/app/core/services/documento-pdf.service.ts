import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
// import { HttpClient, HttpParams } from '@angular/common/http'; // Descomentar cuando se conecte al backend
// import { ConfigService } from './config.service'; // Descomentar cuando se conecte al backend
import {
	DocumentoPdf,
	CrearDocumentoPdfDto,
	ActualizarDocumentoPdfDto,
	DocumentoPdfResponse,
	DocumentoPdfFiltros,
	TipoDocumento,
} from '../models/documento-pdf.model';

@Injectable({
	providedIn: 'root',
})
export class DocumentoPdfService {
	// URL de la API desde servicio de configuración (descomentar cuando se conecte al backend)
	// private readonly API_URL: string;

	// Mock data para desarrollo - Documentos PDF de ejemplo
	private mockDocumentos: DocumentoPdf[] = [
		{
			id: 1,
			nombre: 'Contrato de Servicios Premium',
			descripcion: 'Contrato estándar para eventos premium',
			nombreArchivo: 'contrato-premium.pdf',
			tipoDocumento: TipoDocumento.CONTRATO,
			archivoBase64:
				'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzIgMCBSXQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDMgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooRG9jdW1lbnRvIFBERiBkZSBQcnVlYmEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAyMjEgMDAwMDAgbiAKMDAwMDAwMDMxMCAwMDAwMCBuIAowMDAwMDAwNDA0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCA1IDAgUgo+PgpzdGFydHhyZWYKNDUzCiUlRU9G',
			tamanoBytes: 1024000,
			fechaCreacion: new Date('2024-10-15'),
			activo: true,
			usuarioCreador: 'admin',
		},
		{
			id: 2,
			nombre: 'Plantilla Cotización Bodas',
			descripcion: 'Plantilla para generar cotizaciones de eventos tipo boda',
			nombreArchivo: 'plantilla-cotizacion-bodas.pdf',
			tipoDocumento: TipoDocumento.PLANTILLA,
			archivoBase64:
				'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzIgMCBSXQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDMgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooUGxhbnRpbGxhIENvdGl6YWNpw7NuKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA3NCAwMDAwMCBuIAowMDAwMDAwMjIxIDAwMDAwIG4gCjAwMDAwMDAzMTAgMDAwMDAgbiAKMDAwMDAwMDQwNCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgNSAwIFIKPj4Kc3RhcnR4cmVmCjQ1MwolJUVPRg==',
			tamanoBytes: 2048000,
			fechaCreacion: new Date('2024-10-20'),
			activo: true,
			usuarioCreador: 'admin',
		},
		{
			id: 3,
			nombre: 'Factura Octubre 2024',
			descripcion: 'Factura de servicios del mes de octubre',
			nombreArchivo: 'factura-oct-2024.pdf',
			tipoDocumento: TipoDocumento.FACTURA,
			archivoBase64:
				'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzIgMCBSXQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDMgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooRmFjdHVyYSBPY3R1YnJlIDIwMjQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAyMjEgMDAwMDAgbiAKMDAwMDAwMDMxMCAwMDAwMCBuIAowMDAwMDAwNDA0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCA1IDAgUgo+PgpzdGFydHhyZWYKNDUzCiUlRU9G',
			tamanoBytes: 512000,
			fechaCreacion: new Date('2024-11-01'),
			activo: true,
			usuarioCreador: 'admin',
		},
		{
			id: 4,
			nombre: 'Manual de Usuario Sistema',
			descripcion: 'Manual completo del sistema Festum',
			nombreArchivo: 'manual-usuario-festum.pdf',
			tipoDocumento: TipoDocumento.MANUAL,
			archivoBase64:
				'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzIgMCBSXQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDMgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooTWFudWFsIGRlIFVzdWFyaW8pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAyMjEgMDAwMDAgbiAKMDAwMDAwMDMxMCAwMDAwMCBuIAowMDAwMDAwNDA0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCA1IDAgUgo+PgpzdGFydHhyZWYKNDUzCiUlRU9G',
			tamanoBytes: 3072000,
			fechaCreacion: new Date('2024-09-10'),
			activo: true,
			usuarioCreador: 'admin',
		},
		{
			id: 5,
			nombre: 'Recibo de Pago - Cliente VIP',
			descripcion: 'Recibo de anticipo para evento corporativo',
			nombreArchivo: 'recibo-pago-vip-001.pdf',
			tipoDocumento: TipoDocumento.RECIBO,
			archivoBase64:
				'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzIgMCBSXQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDMgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooUmVjaWJvIGRlIFBhZ28pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAyMjEgMDAwMDAgbiAKMDAwMDAwMDMxMCAwMDAwMCBuIAowMDAwMDAwNDA0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCA1IDAgUgo+PgpzdGFydHhyZWYKNDUzCiUlRU9G',
			tamanoBytes: 256000,
			fechaCreacion: new Date('2024-11-05'),
			activo: true,
			usuarioCreador: 'admin',
		},
	];

	// Subject para mantener la lista actualizada en tiempo real
	private documentosSubject = new BehaviorSubject<DocumentoPdf[]>(
		this.mockDocumentos,
	);
	public documentos$ = this.documentosSubject.asObservable();

	// Loading state
	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading$ = this.loadingSubject.asObservable();

	constructor(
		// private http: HttpClient, // Descomentar cuando se conecte al backend
		// private configService: ConfigService // Descomentar cuando se conecte al backend
	) {
		// Inicializar URL de la API (descomentar cuando se conecte al backend)
		// this.API_URL = this.configService.getApiUrl('documentos-pdf');
	}

	/**
	 * 📋 Obtener todos los documentos PDF
	 */
	getDocumentos(
		filtros?: DocumentoPdfFiltros,
	): Observable<DocumentoPdfResponse> {
		this.loadingSubject.next(true);

		// 🔗 Implementación para API real (descomenta cuando tengas el backend):
		/*
    let params = new HttpParams();
    if (filtros) {
      if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
      if (filtros.tipoDocumento) params = params.set('tipoDocumento', filtros.tipoDocumento);
      if (filtros.activo !== undefined) params = params.set('activo', filtros.activo.toString());
      if (filtros.ordenarPor) params = params.set('ordenarPor', filtros.ordenarPor);
      if (filtros.direccion) params = params.set('direccion', filtros.direccion);
      if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
      if (filtros.limite) params = params.set('limite', filtros.limite.toString());
      if (filtros.fechaDesde) params = params.set('fechaDesde', filtros.fechaDesde.toISOString());
      if (filtros.fechaHasta) params = params.set('fechaHasta', filtros.fechaHasta.toISOString());
    }

    return this.http.get<DocumentoPdfResponse>(`${this.API_URL}`, { params })
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success && response.data) {
            this.documentosSubject.next(response.data as DocumentoPdf[]);
          }
        })
      );
    */

		// 🎭 Mock implementation (remover cuando tengas API real)
		let documentosFiltrados = [...this.mockDocumentos];

		if (filtros?.busqueda) {
			const busqueda = filtros.busqueda.toLowerCase();
			documentosFiltrados = documentosFiltrados.filter(
				(doc) =>
					doc.nombre.toLowerCase().includes(busqueda) ||
					doc.descripcion?.toLowerCase().includes(busqueda) ||
					doc.nombreArchivo.toLowerCase().includes(busqueda),
			);
		}

		if (filtros?.tipoDocumento) {
			documentosFiltrados = documentosFiltrados.filter(
				(doc) => doc.tipoDocumento === filtros.tipoDocumento,
			);
		}

		if (filtros?.activo !== undefined) {
			documentosFiltrados = documentosFiltrados.filter(
				(doc) => doc.activo === filtros.activo,
			);
		}

		// Ordenamiento
		if (filtros?.ordenarPor) {
			documentosFiltrados.sort((a, b) => {
				const aValue = a[filtros.ordenarPor as keyof DocumentoPdf];
				const bValue = b[filtros.ordenarPor as keyof DocumentoPdf];

				if (aValue === undefined || bValue === undefined) return 0;

				let comparison = 0;
				if (aValue > bValue) comparison = 1;
				else if (aValue < bValue) comparison = -1;

				return filtros.direccion === 'desc' ? -comparison : comparison;
			});
		}

		return of({
			success: true,
			message: 'Documentos obtenidos exitosamente',
			data: documentosFiltrados,
			totalRecords: documentosFiltrados.length,
		}).pipe(
			delay(500), // Simular latencia de red
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * 🔍 Obtener un documento por ID
	 */
	getDocumentoById(id: number): Observable<DocumentoPdfResponse> {
		this.loadingSubject.next(true);

		// 🔗 API real:
		// return this.http.get<DocumentoPdfResponse>(`${this.API_URL}/${id}`);

		// 🎭 Mock:
		const documento = this.mockDocumentos.find((d) => d.id === id);

		return of({
			success: !!documento,
			message: documento ? 'Documento encontrado' : 'Documento no encontrado',
			data: documento,
		}).pipe(
			delay(300),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * ➕ Crear un nuevo documento PDF
	 */
	crearDocumento(dto: CrearDocumentoPdfDto): Observable<DocumentoPdfResponse> {
		this.loadingSubject.next(true);

		// 🔗 API real:
		// return this.http.post<DocumentoPdfResponse>(`${this.API_URL}`, dto);

		// 🎭 Mock:
		const nuevoId = Math.max(...this.mockDocumentos.map((d) => d.id), 0) + 1;
		const nuevoDocumento: DocumentoPdf = {
			id: nuevoId,
			...dto,
			fechaCreacion: new Date(),
			activo: true,
			usuarioCreador: 'usuario-actual',
		};

		this.mockDocumentos.push(nuevoDocumento);
		this.documentosSubject.next([...this.mockDocumentos]);

		return of({
			success: true,
			message: 'Documento creado exitosamente',
			data: nuevoDocumento,
		}).pipe(
			delay(800),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * ✏️ Actualizar un documento existente
	 */
	actualizarDocumento(
		dto: ActualizarDocumentoPdfDto,
	): Observable<DocumentoPdfResponse> {
		this.loadingSubject.next(true);

		// 🔗 API real:
		// return this.http.put<DocumentoPdfResponse>(`${this.API_URL}/${dto.id}`, dto);

		// 🎭 Mock:
		const index = this.mockDocumentos.findIndex((d) => d.id === dto.id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Documento no encontrado',
			}).pipe(delay(300));
		}

		const documentoActualizado: DocumentoPdf = {
			...this.mockDocumentos[index],
			nombre: dto.nombre,
			descripcion: dto.descripcion,
			tipoDocumento: dto.tipoDocumento,
			...(dto.archivoBase64 && { archivoBase64: dto.archivoBase64 }),
			...(dto.nombreArchivo && { nombreArchivo: dto.nombreArchivo }),
			...(dto.tamanoBytes && { tamanoBytes: dto.tamanoBytes }),
			fechaActualizacion: new Date(),
		};

		this.mockDocumentos[index] = documentoActualizado;
		this.documentosSubject.next([...this.mockDocumentos]);

		return of({
			success: true,
			message: 'Documento actualizado exitosamente',
			data: documentoActualizado,
		}).pipe(
			delay(800),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * 🗑️ Eliminar un documento (soft delete)
	 */
	eliminarDocumento(id: number): Observable<DocumentoPdfResponse> {
		this.loadingSubject.next(true);

		// 🔗 API real:
		// return this.http.delete<DocumentoPdfResponse>(`${this.API_URL}/${id}`);

		// 🎭 Mock:
		const index = this.mockDocumentos.findIndex((d) => d.id === id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Documento no encontrado',
			}).pipe(delay(300));
		}

		// Soft delete
		this.mockDocumentos[index].activo = false;
		this.documentosSubject.next([...this.mockDocumentos]);

		return of({
			success: true,
			message: 'Documento eliminado exitosamente',
		}).pipe(
			delay(600),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * 🔄 Activar/Desactivar documento
	 */
	toggleEstado(id: number): Observable<DocumentoPdfResponse> {
		this.loadingSubject.next(true);

		const index = this.mockDocumentos.findIndex((d) => d.id === id);

		if (index === -1) {
			return of({
				success: false,
				message: 'Documento no encontrado',
			}).pipe(delay(300));
		}

		this.mockDocumentos[index].activo = !this.mockDocumentos[index].activo;
		this.documentosSubject.next([...this.mockDocumentos]);

		return of({
			success: true,
			message: `Documento ${this.mockDocumentos[index].activo ? 'activado' : 'desactivado'} exitosamente`,
			data: this.mockDocumentos[index],
		}).pipe(
			delay(400),
			map((response) => {
				this.loadingSubject.next(false);
				return response;
			}),
		);
	}

	/**
	 * 📊 Obtener estadísticas de documentos
	 */
	getEstadisticas(): Observable<{
		total: number;
		activos: number;
		inactivos: number;
		porTipo: Record<TipoDocumento, number>;
	}> {
		const total = this.mockDocumentos.length;
		const activos = this.mockDocumentos.filter((d) => d.activo).length;
		const inactivos = total - activos;

		const porTipo = Object.values(TipoDocumento).reduce(
			(acc, tipo) => {
				acc[tipo] = this.mockDocumentos.filter(
					(d) => d.tipoDocumento === tipo,
				).length;
				return acc;
			},
			{} as Record<TipoDocumento, number>,
		);

		return of({ total, activos, inactivos, porTipo }).pipe(delay(200));
	}
}
